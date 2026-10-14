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

// Image layout. Notion's API doesn't return the width or alignment set in the editor, so it is
// written in the caption as bracket tags, removed from the displayed caption and the alt text:
//   "[moyenne droite] Ma légende", "[40% gauche]", "[petite] [sans légende] Texte alternatif"
const SIZES = { petite: 33, small: 33, moyenne: 50, medium: 50, grande: 75, large: 75, pleine: 100, full: 100 }
const ALIGNS = { gauche: 'left', left: 'left', droite: 'right', right: 'right', centre: 'center', center: 'center', centrée: 'center', centree: 'center' }
const NO_CAPTION = /^(sans[- ]l[ée]gende|no[- ]caption)$/
const TAG_RE = /\[([^\[\]]*)\]/g

function parseTag(inner, out) {
  const s = inner.trim().toLowerCase()
  if (NO_CAPTION.test(s)) return (out.hideCaption = true)
  const words = s.split(/[\s,]+/).filter(Boolean)
  if (!words.length) return false
  const next = { ...out }
  for (const w of words) {
    const pct = w.match(/^(\d{1,3})%$/)
    if (pct && +pct[1] >= 10 && +pct[1] <= 100) next.width = +pct[1]
    else if (SIZES[w]) next.width = SIZES[w]
    else if (ALIGNS[w]) next.align = ALIGNS[w]
    else return false // not a layout tag ("[1]", "[sic]"...): left in the caption
  }
  Object.assign(out, next)
  return true
}

export function imageLayout(caption = []) {
  const out = { width: null, align: null, hideCaption: false }
  const cleaned = caption.map((t) => ({ ...t, plain_text: (t.plain_text ?? '').replace(TAG_RE, (m, inner) => (parseTag(inner, out) ? '' : m)) }))
  // Tidy the spaces left by removed tags, then drop empty segments.
  cleaned.forEach((t, i) => {
    t.plain_text = t.plain_text.replace(/ {2,}/g, ' ')
    if (i === 0) t.plain_text = t.plain_text.trimStart()
    if (i === cleaned.length - 1) t.plain_text = t.plain_text.trimEnd()
  })
  if (out.width === 100) out.width = out.align = null // full width: nothing to size or float
  if (out.align === 'center' && !out.width) out.align = null
  // Left/right without a size: half width, otherwise the text would have no room to wrap.
  if ((out.align === 'left' || out.align === 'right') && !out.width) out.width = 50
  return { ...out, caption: cleaned.filter((t) => t.plain_text) }
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
        items += `<li class="todo${t.checked ? ' done' : ''}"><span class="check" aria-hidden="true"></span><span>${richText(t.rich_text)}${await children(blocks[i], ctx)}</span></li>`
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
    case 'heading_3':
    case 'heading_4': {
      const level = { heading_1: 2, heading_2: 3, heading_3: 4, heading_4: 5 }[b.type]
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
      const { caption, width, align, hideCaption } = imageLayout(d.caption)
      const cap = hideCaption ? '' : richText(caption)
      // Real pixel size: never upscaled past it (blurry), and width/height reserve the space while loading.
      const size = await ctx.imageSize?.(src)
      const cls = [align && `align-${align}`, width && 'is-sized'].filter(Boolean).join(' ')
      const style = [width && `--w:${width}%`, size && `--max:${size.width}px`].filter(Boolean).join(';')
      const attrs = `${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}`
      const dims = size ? ` width="${size.width}" height="${size.height}"` : ''
      return `<figure${attrs}><img src="${esc(src)}" alt="${esc(plain(caption).trim())}"${dims} loading="lazy" decoding="async">${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`
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
    case 'column': {
      // width_ratio is only sent by recent Notion API versions; without it, columns share the width.
      const ratio = Number(d?.width_ratio)
      return `<div${ratio > 0 ? ` style="--ratio:${Math.round(ratio * 1000) / 1000}"` : ''}>${await children(b, ctx)}</div>`
    }
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
