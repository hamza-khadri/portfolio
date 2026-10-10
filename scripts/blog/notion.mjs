// Minimal Notion API client (fetch only, no dependency).
// Any API error throws: the build fails and nothing gets deployed, so a Notion
// outage or a bad token can never wipe the blog from the live site.

const API = process.env.NOTION_API_BASE || 'https://api.notion.com/v1'
const VERSION = process.env.NOTION_VERSION || '2022-06-28'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function createClient(token) {
  async function request(path, { method = 'GET', body } = {}, attempt = 0) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': VERSION,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (res.status === 429 || res.status >= 500) {
      if (attempt >= 5) throw new Error(`Notion ${method} ${path} -> ${res.status} after ${attempt} retries`)
      const wait = Number(res.headers.get('retry-after')) * 1000 || 1000 * 2 ** attempt
      await sleep(wait)
      return request(path, { method, body }, attempt + 1)
    }
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Notion ${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`)
    }
    return res.json()
  }

  /** All pages of the database whose "Publié" checkbox is ticked. */
  async function queryPublished(databaseId) {
    const results = []
    let cursor
    do {
      const data = await request(`/databases/${databaseId}/query`, {
        method: 'POST',
        body: {
          page_size: 100,
          start_cursor: cursor,
          filter: { property: 'Publié', checkbox: { equals: true } },
        },
      })
      results.push(...data.results)
      cursor = data.has_more ? data.next_cursor : undefined
    } while (cursor)
    return results
  }

  /** Every block of a page, children included (lists, toggles, tables, columns...). */
  async function getBlocksDeep(blockId) {
    const blocks = []
    let cursor
    do {
      const qs = new URLSearchParams({ page_size: '100' })
      if (cursor) qs.set('start_cursor', cursor)
      const data = await request(`/blocks/${blockId}/children?${qs}`)
      blocks.push(...data.results)
      cursor = data.has_more ? data.next_cursor : undefined
    } while (cursor)
    for (const b of blocks) {
      if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') {
        b.children = await getBlocksDeep(b.id)
      }
    }
    return blocks
  }

  return { queryPublished, getBlocksDeep }
}
