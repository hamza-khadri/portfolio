// Tiny fake Notion API to test the sync without a token:
//   node scripts/dev/mock-notion.mjs &   then   NOTION_API_BASE=http://localhost:4010/v1 NOTION_TOKEN=x npm run sync
import http from 'node:http'

const t = (s, a = {}) => ({ plain_text: s, annotations: a, href: null })
const link = (s, href) => ({ plain_text: s, annotations: {}, href })
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')

const prop = (o) => o
const page = (id, title, slug, extra = {}) => ({
  id, created_time: '2026-10-01T09:00:00.000Z', last_edited_time: '2026-10-09T09:00:00.000Z',
  properties: {
    Titre: { title: [t(title)] }, Slug: { rich_text: [t(slug)] }, Publié: { checkbox: true },
    'Description SEO': { rich_text: [t(extra.desc ?? 'Une description courte.')] },
    'Mots-clés': { multi_select: [{ name: 'IA' }, { name: 'No-code' }] }, Catégorie: { select: { name: 'Tutoriel' } },
    Langue: { select: { name: 'FR' } }, 'Date de publication': { date: { start: extra.date ?? '2026-10-05' } },
    'Image de couverture': { files: extra.cover ? [{ type: 'file', file: { url: 'http://localhost:4010/img/cover.png' } }] : [] },
    'Texte alternatif couverture': { rich_text: [t('Couverture de test')] },
  },
})

const pages = [
  page('p1', 'Mon premier article <test> & "quotes"', 'mon-premier-article', { cover: true }),
  page('p2', 'Deuxième article', 'deuxieme-article', { date: '2026-10-08', desc: '' }),
  page('p3', 'Slug cassé', 'Slug Cassé !'),
  page('p4', 'Doublon', 'deuxieme-article'),
]
const blocks = {
  p1: [
    { id: 'b1', type: 'heading_1', heading_1: { rich_text: [t('Intro')] } },
    { id: 'b2', type: 'paragraph', paragraph: { rich_text: [t('Du '), t('gras', { bold: true }), t(' et un '), link('lien', 'https://example.com'), t(' et un '), link('xss', 'javascript:alert(1)'), t(' <script>x</script>')] } },
    { id: 'b3', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [t('un')] }, has_children: true },
    { id: 'b4', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [t('deux')] } },
    { id: 'b5', type: 'code', code: { language: 'javascript', rich_text: [t('const a = 1 < 2')] } },
    { id: 'b6', type: 'image', image: { type: 'file', file: { url: 'http://localhost:4010/img/a.png' }, caption: [t('Légende')] } },
    { id: 'b7', type: 'table', table: { has_column_header: true }, has_children: true },
    { id: 'b8', type: 'callout', callout: { icon: { type: 'emoji', emoji: '💡' }, rich_text: [t('Astuce')] } },
    { id: 'b9', type: 'heading_2', heading_2: { rich_text: [t('Intro')] } },
    { id: 'b10', type: 'weird_block', weird_block: {} },
  ],
  p2: [{ id: 'c1', type: 'paragraph', paragraph: { rich_text: [t('Juste un paragraphe sans description SEO, assez long pour tester l extrait automatique et le temps de lecture.')] } }],
  b3: [{ id: 'n1', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [t('enfant')] } }],
  b7: [
    { id: 'r1', type: 'table_row', table_row: { cells: [[t('A')], [t('B')]] } },
    { id: 'r2', type: 'table_row', table_row: { cells: [[t('1')], [t('2')]] } },
  ],
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const json = (o) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)) }
  if (url.pathname.startsWith('/img/')) { res.setHeader('content-type', 'image/png'); return res.end(png) }
  if (req.headers.authorization !== 'Bearer x') { res.statusCode = 401; return json({ message: 'bad token' }) }
  if (req.method === 'POST' && url.pathname.endsWith('/query')) return json({ results: pages, has_more: false })
  const m = url.pathname.match(/blocks\/(.+)\/children/)
  if (m) return json({ results: blocks[m[1]] || [], has_more: false })
  res.statusCode = 404; json({ message: 'nope' })
}).listen(4010, () => console.log('mock notion on :4010'))
