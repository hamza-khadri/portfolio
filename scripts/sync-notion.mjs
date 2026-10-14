#!/usr/bin/env node
// Notion "Blog HKcom" database -> static HTML pages at the project root, built by Vite as
// extra inputs (vite.config.js) so they share the homepage's CSS/JS (v2/blog.jsx):
//   blog.html                   -> /blog              (FR)
//   blog/<slug>.html            -> /blog/<slug>
//   en/blog.html                -> /en/blog           (EN)
//   en/blog/<slug>.html         -> /en/blog/<slug>
// Each article = one Notion entry per language, linked by the relations
// "Version anglaise" / "Version française" (hreflang + language switcher).
//   public/blog/images/*        -> images downloaded from Notion (their URLs expire after ~1h)
//   public/blog/images/*-og.jpg -> 1200x630 link-preview version of each cover (og:image)
//   public/rss.xml, public/en/rss.xml, public/sitemap.xml
// Only pages with "Publié" ticked are generated; untick = gone at next deploy.
// Required env: NOTION_TOKEN. Optional: NOTION_DATABASE_ID, SITE_URL.
// BLOG_MOCK=1: fake articles from scripts/dev/mock-blog.mjs instead of Notion (local UI work, refused in CI).

import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createClient } from './blog/notion.mjs'
import { plain, renderBlocks, slugify } from './blog/render.mjs'
import { LANGS, articlePage, indexPage, rssFeed, sitemapUrls } from './blog/templates.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'public')
const BLOG_DIR = path.join(ROOT, 'blog')
const EN_DIR = path.join(ROOT, 'en')
const IMG_DIR = path.join(PUBLIC, 'blog', 'images')
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

/** Link-preview image (og:image) from a downloaded cover: 1200x630 JPEG, a few hundred KB at most.
    Full-size covers (several MB) are dropped by WhatsApp and slow or cropped elsewhere. */
async function ogImage(post) {
  if (!post.cover?.startsWith('/blog/images/')) return null // no cover, or external URL used as-is
  const name = `${path.basename(post.cover).replace(/\.\w+$/, '')}-og.jpg`
  try {
    await sharp(path.join(PUBLIC, post.cover))
      .resize(1200, 630, { fit: 'cover' })
      .flatten({ background: '#07080A' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(IMG_DIR, name))
    return `/blog/images/${name}`
  } catch (err) {
    skipped.push(`"${post.title}": image de partage non générée (${err.message}), couverture d'origine utilisée`)
    return null
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
  // Publication date = the "Date de publication" property. Never the edit date; falls back to the creation date.
  if (!date('Date de publication')) skipped.push(`"${title}": "Date de publication" vide, date de création utilisée (${page.created_time.slice(0, 10)})`)
  const published = new Date(date('Date de publication') || page.created_time).toISOString()
  const updated = new Date([date('Dernière publication'), page.last_edited_time, published].filter(Boolean).sort().at(-1)).toISOString()
  return {
    id: page.id, title, slug, published, updated, created: page.created_time,
    description: plain(p['Description SEO']?.rich_text).trim(),
    tags: (p['Mots-clés']?.multi_select || []).map((o) => o.name),
    category: p['Catégorie']?.select?.name || '',
    lang: p['Langue']?.select?.name === 'EN' ? 'en' : 'fr',
    relIds: [...(p['Version anglaise']?.relation || []), ...(p['Version française']?.relation || [])].map((r) => r.id),
    relatedIds: (p['Articles liés']?.relation || []).map((r) => r.id),
    coverFile: p['Image de couverture']?.files?.[0] || null,
    coverAlt: plain(p['Texte alternatif couverture']?.rich_text).trim() || title,
  }
}

/** Pair FR/EN entries through the relations (either side may hold the link). Only published, opposite-language posts count. */
function linkTranslations(posts) {
  const byId = new Map(posts.map((p) => [p.id, p]))
  const pair = (a, b) => { if (!a.alt) a.alt = b; if (!b.alt) b.alt = a }
  for (const p of posts) {
    for (const id of p.relIds) {
      const other = byId.get(id)
      if (!other) continue // unpublished or unknown target: no link, no dead hreflang
      if (other.lang === p.lang) {
        skipped.push(`"${p.title}": la version liée "${other.title}" est dans la même langue (${p.lang.toUpperCase()}), lien ignoré`)
        continue
      }
      pair(p, other)
    }
  }
  for (const p of posts) {
    if (p.alt && p.alt.alt !== p) skipped.push(`"${p.title}": relation non réciproque avec "${p.alt.title}"`)
  }
}

const MAX_RELATED = 3

/** "Articles liés" -> post.related: published, same language, not itself, no duplicates, max 3 (extra ones are ignored). */
function linkRelated(posts) {
  const byId = new Map(posts.map((p) => [p.id, p]))
  for (const p of posts) {
    p.related = []
    for (const id of p.relatedIds) {
      const other = byId.get(id)
      if (!other || other === p || p.related.includes(other)) continue // unpublished / unknown / self / duplicate
      if (other.lang !== p.lang) {
        skipped.push(`"${p.title}": l'article lié "${other.title}" est dans l'autre langue, ignoré (Voir aussi = même langue)`)
        continue
      }
      p.related.push(other)
    }
    if (p.related.length > MAX_RELATED) {
      skipped.push(`"${p.title}": ${p.related.length} articles liés, seuls les ${MAX_RELATED} premiers sont affichés`)
      p.related = p.related.slice(0, MAX_RELATED)
    }
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
    /** Pixel size of a downloaded raster image (null for SVG or external URLs, which can scale freely). */
    async imageSize(src) {
      if (!src.startsWith('/blog/images/') || src.endsWith('.svg')) return null
      try {
        const { width, height } = await sharp(path.join(PUBLIC, src)).metadata()
        return width && height ? { width, height } : null
      } catch {
        return null
      }
    },
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
  post.og = await ogImage(post)
  return { post, bodyHtml }
}

async function main() {
  const token = process.env.NOTION_TOKEN
  let pages = []
  let client
  if (process.env.BLOG_MOCK) {
    if (process.env.CI) throw new Error('BLOG_MOCK interdit en CI: ce serait déployer de faux articles.')
    const { createMockClient } = await import('./dev/mock-blog.mjs')
    client = createMockClient()
    pages = await client.queryPublished()
    console.warn('BLOG_MOCK: articles fictifs (scripts/dev/mock-blog.mjs), pas Notion.')
  } else if (token) {
    client = createClient(token)
    pages = await client.queryPublished(DATABASE_ID)
  } else if (process.env.CI) {
    throw new Error('NOTION_TOKEN manquant en CI: build annulé pour ne pas déployer un blog vide.')
  } else {
    console.warn('NOTION_TOKEN absent: blog vide généré (normal en local sans token).')
  }

  // Everything here is generated (git-ignored): start clean so unpublished posts disappear.
  for (const p of [BLOG_DIR, EN_DIR, path.join(ROOT, 'blog.html'), path.join(PUBLIC, 'blog'), path.join(PUBLIC, 'en'), path.join(PUBLIC, 'blog.html')]) {
    await rm(p, { recursive: true, force: true })
  }
  await mkdir(BLOG_DIR, { recursive: true })
  await mkdir(path.join(EN_DIR, 'blog'), { recursive: true })
  await mkdir(path.join(PUBLIC, 'en'), { recursive: true })

  const seen = new Set()
  const built = []
  for (const page of pages) {
    const post = toPost(page)
    if (!post) continue
    const key = `${post.lang}/${post.slug}`
    if (seen.has(key)) {
      skipped.push(`"${post.title}": slug en double "${post.slug}" (${post.lang.toUpperCase()})`)
      continue
    }
    seen.add(key)
    built.push(await buildPost(post, client))
  }
  // Newest publication first; same day -> most recently created first (stable, independent of Notion's query order).
  built.sort((a, b) => b.post.published.localeCompare(a.post.published) || b.post.created.localeCompare(a.post.created))
  const posts = built.map((b) => b.post)
  linkTranslations(posts)
  linkRelated(posts)

  const dirOf = (lang) => (lang === 'en' ? path.join(EN_DIR, 'blog') : BLOG_DIR)
  for (const { post, bodyHtml } of built) await writeFile(path.join(dirOf(post.lang), `${post.slug}.html`), articlePage(post, bodyHtml))
  for (const lang of LANGS) {
    const list = posts.filter((p) => p.lang === lang)
    await writeFile(lang === 'en' ? path.join(EN_DIR, 'blog.html') : path.join(ROOT, 'blog.html'), indexPage(list, lang))
    await writeFile(lang === 'en' ? path.join(PUBLIC, 'en', 'rss.xml') : path.join(PUBLIC, 'rss.xml'), rssFeed(list, lang))
  }
  const base = await readFile(path.join(ROOT, 'scripts', 'sitemap.base.xml'), 'utf8')
  const withNs = base.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">')
  await writeFile(path.join(PUBLIC, 'sitemap.xml'), withNs.replace('</urlset>', `${sitemapUrls(posts)}</urlset>`))

  console.log(`Blog: ${posts.length} article(s) publié(s)${posts.length ? ' -> ' + posts.map((p) => `${p.lang}:${p.slug}`).join(', ') : ''}`)
  for (const s of skipped) console.warn(`  ! ${s}`)
}

main().catch((err) => {
  console.error(`\nSync Notion échouée: ${err.message}`)
  process.exit(1)
})
