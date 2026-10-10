#!/usr/bin/env node
// Notion "Blog HKcom" database -> static pages in public/ (copied as-is into dist by Vite).
//   public/blog.html            -> /blog
//   public/blog/<slug>.html     -> /blog/<slug>
//   public/blog/images/*        -> images downloaded from Notion (their URLs expire after ~1h)
//   public/rss.xml, public/sitemap.xml
// Only pages with "Publié" ticked are generated; untick = gone at next deploy.
// Required env: NOTION_TOKEN. Optional: NOTION_DATABASE_ID, SITE_URL.

import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from './blog/notion.mjs'
import { plain, renderBlocks, slugify } from './blog/render.mjs'
import { articlePage, indexPage, rssFeed, sitemapUrls } from './blog/templates.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'public')
const BLOG_DIR = path.join(PUBLIC, 'blog')
const IMG_DIR = path.join(BLOG_DIR, 'images')
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2946cd44-3872-4074-bbdd-343dcc9ebcae'
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif', 'image/svg+xml': 'svg' }
const skipped = []

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`image ${res.status}`)
  const type = (res.headers.get('content-type') || '').split(';')[0].trim()
  const buf = Buffer.from(await res.arrayBuffer())
  let ext = EXT[type]
  if (!ext) {
    const m = new URL(url).pathname.match(/\.(png|jpe?g|webp|gif|avif|svg)$/i)
    ext = m ? m[1].toLowerCase().replace('jpeg', 'jpg') : null
  }
  if (!ext) throw new Error(`type d'image non supporté (${type || 'inconnu'})`)
  const name = `${createHash('sha1').update(buf).digest('hex').slice(0, 12)}.${ext}`
  await mkdir(IMG_DIR, { recursive: true })
  await writeFile(path.join(IMG_DIR, name), buf)
  return `/blog/images/${name}`
}

/** Notion file object ({type:'file'|'external', ...}) -> public path. Hosted files must succeed. */
async function resolveFile(fileObj) {
  const url = fileObj.type === 'file' ? fileObj.file?.url : fileObj.external?.url
  if (!url) return null
  try {
    return await download(url)
  } catch (err) {
    if (fileObj.type === 'external' && url.startsWith('https://')) return url
    throw new Error(`téléchargement d'image impossible: ${err.message}`)
  }
}

function toPost(page) {
  const p = page.properties
  const title = plain(p['Titre']?.title).trim()
  const slug = plain(p['Slug']?.rich_text).trim()
  if (!title) return skip(page, 'titre vide')
  if (!slug) return skip(page, `"${title}": slug vide`)
  if (!SLUG_RE.test(slug)) return skip(page, `"${title}": slug invalide "${slug}" (minuscules, chiffres et tirets seulement)`)
  const date = (k) => p[k]?.date?.start || null
  const published = new Date(date('Date de publication') || page.created_time).toISOString()
  const updated = new Date([date('Dernière publication'), page.last_edited_time, published].filter(Boolean).sort().at(-1)).toISOString()
  return {
    id: page.id, title, slug, published, updated,
    description: plain(p['Description SEO']?.rich_text).trim(),
    tags: (p['Mots-clés']?.multi_select || []).map((o) => o.name),
    category: p['Catégorie']?.select?.name || '',
    lang: p['Langue']?.select?.name === 'EN' ? 'en' : 'fr',
    coverFile: p['Image de couverture']?.files?.[0] || null,
    coverAlt: plain(p['Texte alternatif couverture']?.rich_text).trim() || title,
  }
}

function skip(page, reason) {
  skipped.push(reason)
  return null
}

async function buildPost(post, client) {
  const blocks = await client.getBlocksDeep(post.id)
  const used = new Set()
  const ctx = {
    resolveFile,
    headingId(text) {
      let id = slugify(text) || 'section'
      for (let n = 2; used.has(id); n++) id = `${slugify(text) || 'section'}-${n}`
      used.add(id)
      return id
    },
  }
  const bodyHtml = await renderBlocks(blocks, ctx)
  const text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  post.readingMinutes = Math.max(1, Math.round(text.split(' ').length / 200))
  if (!post.description) {
    post.description = text.slice(0, 155).replace(/\s+\S*$/, '') + '…'
    skipped.push(`"${post.title}": pas de Description SEO, extrait automatique utilisé`)
  } else if (post.description.length > 160) {
    skipped.push(`"${post.title}": Description SEO de ${post.description.length} caractères (160 max conseillé)`)
  }
  post.cover = post.coverFile ? await resolveFile(post.coverFile) : null
  return { post, bodyHtml }
}

async function main() {
  const token = process.env.NOTION_TOKEN
  let pages = []
  let client
  if (token) {
    client = createClient(token)
    pages = await client.queryPublished(DATABASE_ID)
  } else if (process.env.CI) {
    throw new Error('NOTION_TOKEN manquant en CI: build annulé pour ne pas déployer un blog vide.')
  } else {
    console.warn('NOTION_TOKEN absent: blog vide généré (normal en local sans token).')
  }

  await rm(BLOG_DIR, { recursive: true, force: true })
  await rm(path.join(PUBLIC, 'blog.html'), { force: true })
  await mkdir(BLOG_DIR, { recursive: true })

  const seen = new Set()
  const built = []
  for (const page of pages) {
    const post = toPost(page)
    if (!post) continue
    if (seen.has(post.slug)) {
      skipped.push(`"${post.title}": slug en double "${post.slug}"`)
      continue
    }
    seen.add(post.slug)
    built.push(await buildPost(post, client))
  }
  built.sort((a, b) => b.post.published.localeCompare(a.post.published))
  const posts = built.map((b) => b.post)

  for (const { post, bodyHtml } of built) await writeFile(path.join(BLOG_DIR, `${post.slug}.html`), articlePage(post, bodyHtml))
  await writeFile(path.join(PUBLIC, 'blog.html'), indexPage(posts))
  await writeFile(path.join(PUBLIC, 'rss.xml'), rssFeed(posts))
  const base = await readFile(path.join(ROOT, 'scripts', 'sitemap.base.xml'), 'utf8')
  await writeFile(path.join(PUBLIC, 'sitemap.xml'), base.replace('</urlset>', `${sitemapUrls(posts)}</urlset>`))

  console.log(`Blog: ${posts.length} article(s) publié(s)${posts.length ? ' -> ' + posts.map((p) => p.slug).join(', ') : ''}`)
  for (const s of skipped) console.warn(`  ! ${s}`)
}

main().catch((err) => {
  console.error(`\nSync Notion échouée: ${err.message}`)
  process.exit(1)
})
