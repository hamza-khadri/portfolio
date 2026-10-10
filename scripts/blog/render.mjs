// Notion blocks -> safe HTML. Everything coming from Notion is escaped.

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const plain = (rt = []) => rt.map((t) => t.plain_text ?? '').join('')

export const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function safeHref(h) {
  if (!h) return null
  if (h.startsWith('/') || h.startsWith('#')) return h
  try {
    const u = new URL(h)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(u.protocol) ? u.href : null
  } catch {
    return null
  }
}

export function richText(rt = []) {
  return rt
    .map((t) => {
      let s = esc(t.plain_text ?? '').replace(/\n/g, '<br>')
      const a = t.annotations || {}
      if (a.code) s = `<code>${s}</code>`
      if (a.bold) s = `<strong>${s}</strong>`
      if (a.italic) s = `<em>${s}</em>`
      if (a.strikethrough) s = `<s>${s}</s>`
      if (a.underline) s = `<u>${s}</u>`
      const href = safeHref(t.href)
      if (href) {
        const ext = /^https?:/.test(href)
        s = `<a href="${esc(href)}"${ext ? ' rel="noopener"' : ''}>${s}</a>`
      }
      return s
    })
    .join('')
}

const warned = new Set()
const warnOnce = (msg) => {
  if (!warned.has(msg)) {
    warned.add(msg)
    console.warn(`  ! ${msg}`)
  }
}

async function children(b, ctx) {
  return b.children?.length ? renderBlocks(b.children, ctx) : ''
}

async function renderListItem(b, ctx) {
  const data = b[b.type]
  return `<li>${richText(data.rich_text)}${await children(b, ctx)}</li>`
}

export async function renderBlocks(blocks, ctx) {
  let html = ''
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
      const tag = b.type === 'bulleted_list_item' ? 'ul' : 'ol'
      let items = ''
      while (i < blocks.length && blocks[i].type === b.type) items += await renderListItem(blocks[i++], ctx)
      html += `<${tag}>${items}</${tag}>`
      continue
    }
    if (b.type === 'to_do') {
      let items = ''
      while (i < blocks.length && blocks[i].type === 'to_do') {
        const t = blocks[i].to_do
        items += `<li class="todo${t.checked ? ' done' : ''}"><span aria-hidden="true">${t.checked ? '☑' : '☐'}</span> ${richText(t.rich_text)}${await children(blocks[i], ctx)}</li>`
        i++
      }
      html += `<ul class="todos">${items}</ul>`
      continue
    }
    html += await renderBlock(b, ctx)
    i++
  }
  return html
}

async function renderBlock(b, ctx) {
  const d = b[b.type]
  switch (b.type) {
    case 'paragraph': {
      const inner = richText(d.rich_text)
      return inner ? `<p>${inner}</p>${await children(b, ctx)}` : ''
    }
    case 'heading_1':
    case 'heading_2':
    case 'heading_3': {
      const level = { heading_1: 2, heading_2: 3, heading_3: 4 }[b.type]
      const id = ctx.headingId(plain(d.rich_text))
      return `<h${level} id="${esc(id)}">${richText(d.rich_text)}</h${level}>`
    }
    case 'quote':
      return `<blockquote>${richText(d.rich_text)}${await children(b, ctx)}</blockquote>`
    case 'callout': {
      const icon = d.icon?.type === 'emoji' ? `<span class="callout-icon" aria-hidden="true">${esc(d.icon.emoji)}</span>` : ''
      return `<aside class="callout">${icon}<div>${richText(d.rich_text)}${await children(b, ctx)}</div></aside>`
    }
    case 'code': {
      const lang = (d.language || '').replace(/[^a-z0-9+#-]/gi, '')
      return `<pre><code${lang ? ` class="language-${esc(lang)}"` : ''}>${esc(plain(d.rich_text))}</code></pre>`
    }
    case 'divider':
      return '<hr>'
    case 'toggle':
      return `<details><summary>${richText(d.rich_text)}</summary>${await children(b, ctx)}</details>`
    case 'image': {
      const src = await ctx.resolveFile(d, b.id)
      if (!src) return ''
      const cap = richText(d.caption)
      return `<figure><img src="${esc(src)}" alt="${esc(plain(d.caption))}" loading="lazy" decoding="async">${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`
    }
    case 'table': {
      const rows = (b.children || []).filter((r) => r.type === 'table_row')
      const cell = (tag, c) => `<${tag}>${richText(c)}</${tag}>`
      const body = rows
        .map((r, idx) => {
          const head = d.has_column_header && idx === 0
          return `<tr>${r.table_row.cells.map((c, ci) => cell(head || (d.has_row_header && ci === 0) ? 'th' : 'td', c)).join('')}</tr>`
        })
        .join('')
      return `<div class="table-wrap"><table>${body}</table></div>`
    }
    case 'bookmark':
    case 'embed':
    case 'link_preview': {
      const href = safeHref(d.url)
      return href ? `<p class="link-card"><a href="${esc(href)}" rel="noopener">${esc(d.url)}</a></p>` : ''
    }
    case 'video':
    case 'file':
    case 'pdf': {
      const url = d.type === 'external' ? d.external?.url : null
      const href = safeHref(url)
      if (!href) {
        warnOnce(`bloc "${b.type}" hébergé par Notion ignoré (lien expirant), utilise un lien externe`)
        return ''
      }
      return `<p class="link-card"><a href="${esc(href)}" rel="noopener">${esc(url)}</a></p>`
    }
    case 'equation':
      return `<pre class="equation">${esc(d.expression)}</pre>`
    case 'column_list':
      return `<div class="cols">${await children(b, ctx)}</div>`
    case 'column':
      return `<div>${await children(b, ctx)}</div>`
    case 'synced_block':
      return children(b, ctx)
    case 'table_of_contents':
    case 'breadcrumb':
    case 'child_page':
    case 'child_database':
    case 'unsupported':
      return ''
    default:
      warnOnce(`bloc "${b.type}" non géré, ignoré`)
      return ''
  }
}
