#!/usr/bin/env node
// Runs after a successful deploy (.github/workflows/deploy.yml).
// For each article the Notion button asked to publish ("Publication demandée" ticked) and that is now online:
//   ticks "Publié", clears "Publication demandée", fills "Date de publication" if it was empty.
// The list comes from .blog-publish.json, written by scripts/sync-notion.mjs. No file = nothing to do.
// Requested articles that could not be built (empty or invalid slug, duplicate...) are left as they are
// and make this step fail, so the GitHub run turns red and the reason shows in its logs.
// Needs NOTION_TOKEN with the "Update content" capability.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { REQUEST_PROP, createClient } from './blog/notion.mjs'

const FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.blog-publish.json')

async function main() {
  let requests
  try {
    requests = JSON.parse(await readFile(FILE, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return console.log('Aucune publication demandée.')
    throw err
  }
  if (!process.env.NOTION_TOKEN) throw new Error('NOTION_TOKEN manquant')
  const client = createClient(process.env.NOTION_TOKEN)

  for (const post of requests.publish) {
    await client.updatePage(post.id, {
      Publié: { checkbox: true },
      [REQUEST_PROP]: { checkbox: false },
      ...(post.setDate ? { 'Date de publication': { date: { start: post.setDate } } } : {}),
    })
    console.log(`En ligne, case Publié cochée: "${post.title}"`)
  }

  if (requests.rejected.length) {
    for (const r of requests.rejected) console.error(`  ! Non publié: ${r.reason}`)
    throw new Error(`${requests.rejected.length} article(s) demandé(s) non publié(s), corrige-les dans Notion puis relance le bouton`)
  }
}

main().catch((err) => {
  console.error(`\nMise à jour Notion échouée: ${err.message}`)
  process.exit(1)
})
