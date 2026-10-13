// HTML templates for /blog and /blog/<slug>. Static pages (SEO: content and nav are in
// the markup), built by Vite as extra inputs so they share the homepage's system:
// v2/styles.css (tokens, glass, nav, rows, footer…) + v2/blog.css (index, article, prose),
// and v2/blog.jsx for the light grid, cursor, reveals and the page transition.

import { esc, slugify } from './render.mjs'
import STRINGS from '../../v2/strings.js'
import { PT_HEAD_SCRIPT } from '../../v2/lib/page-transition.js'
import { VIEW_MOBILE, fold, pagerHtml } from '../../v2/lib/blog-index.js'

export const SITE = (process.env.SITE_URL || 'https://hamzakhadri.com').replace(/\/$/, '')
export const AUTHOR = 'Hamza Khadri'
export const DEFAULT_OG = `${SITE}/assets/og-image.png`

const T = {
  fr: {
    home: 'Accueil', blog: 'Blog', read: 'min de lecture', readShort: 'min', back: 'Tous les articles',
    empty: 'Les premiers articles arrivent bientôt.', updated: 'Mis à jour le', updatedShort: 'Mis à jour',
    indexTitle: 'Blog | Hamza Khadri',
    indexDesc: "Articles sur l'IA, l'automatisation, le no-code et le product, par Hamza Khadri.",
    indexLabel: 'BLOG — IA, NO-CODE, PRODUCT', indexH1: ['Ce que je construis,', "ce que j'en apprends."],
    indexLead: "IA, automatisation, no-code et product : ce que je construis et ce que j'en apprends.",
    cta: 'Un process à automatiser ?', ctaLabel: 'PARLONS-EN', ctaText: "Parlons-en : je repère les opportunités IA dans vos process et je les concrétise.", ctaBtn: 'Me contacter',
    rss: 'Flux RSS', published: 'Publié le', publishedShort: 'Publié', reading: 'Lecture', category: 'Catégorie',
    seeAlso: 'Voir aussi', seeAlsoLabel: 'À LIRE ENSUITE', switchAria: 'Lire cet article en français', switchIndexAria: 'Blog en français',
    toc: 'Sommaire', tocOpen: 'Ouvrir le sommaire', tocClose: 'Fermer le sommaire', tags: 'Mots-clés', readLabel: 'Lire', skip: 'Aller au contenu',
    view: 'Affichage', viewList: 'Vue liste', viewGrid: 'Vue 3 colonnes',
    search: 'Rechercher un article', searchPh: 'Rechercher : IA, Figma, no-code…', filters: 'Catégories', all: 'Tous',
    noMatch: 'Aucun article ne correspond.', reset: 'Tout afficher', pager: 'Pagination', prev: 'Page précédente', next: 'Page suivante', page: 'Page',
  },
  en: {
    home: 'Home', blog: 'Blog', read: 'min read', readShort: 'min', back: 'All articles',
    empty: 'First articles coming soon.', updated: 'Updated', updatedShort: 'Updated',
    indexTitle: 'Blog | Hamza Khadri',
    indexDesc: 'Articles on AI, automation, no-code and product, by Hamza Khadri.',
    indexLabel: 'BLOG — AI, NO-CODE, PRODUCT', indexH1: ['What I build,', 'what I learn from it.'],
    indexLead: 'AI, automation, no-code and product: what I build and what I learn from it.',
    cta: 'A process to automate?', ctaLabel: "LET'S TALK", ctaText: 'Let’s talk: I spot AI opportunities in your processes and make them real.', ctaBtn: 'Get in touch',
    rss: 'RSS feed', published: 'Published on', publishedShort: 'Published', reading: 'Reading', category: 'Category',
    seeAlso: 'See also', seeAlsoLabel: 'READ NEXT', switchAria: 'Read this article in English', switchIndexAria: 'Blog in English',
    toc: 'Contents', tocOpen: 'Open contents', tocClose: 'Close contents', tags: 'Tags', readLabel: 'Read', skip: 'Skip to content',
    view: 'Layout', viewList: 'List view', viewGrid: '3-column view',
    search: 'Search articles', searchPh: 'Search: AI, Figma, no-code…', filters: 'Categories', all: 'All',
    noMatch: 'No article matches.', reset: 'Show all', pager: 'Pagination', prev: 'Previous page', next: 'Next page', page: 'Page',
  },
}


export const LANGS = ['fr', 'en']
/** Path prefix of the blog for a language: FR keeps /blog, EN lives under /en/blog. */
export const blogPath = (lang) => (lang === 'en' ? '/en/blog' : '/blog')
export const postPath = (lang, slug) => `${blogPath(lang)}/${slug}`
export const rssPath = (lang) => (lang === 'en' ? '/en/rss.xml' : '/rss.xml')
const HREFLANG = { fr: 'fr-BE', en: 'en' }

/** <link rel=alternate hreflang> set for a page and its translation (same set used in the sitemap). */
export function alternates(entries) {
  // entries: [{ lang, url }]
  if (entries.length < 2) return ''
  const fr = entries.find((e) => e.lang === 'fr')
  return entries.map((e) => `<link rel="alternate" hreflang="${HREFLANG[e.lang]}" href="${esc(e.url)}">\n`).join('') +
    (fr ? `<link rel="alternate" hreflang="x-default" href="${esc(fr.url)}">\n` : '')
}

/* Icons: the same 1.5px line set as v2/lib/icons.jsx. */
const icon = (d, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`
const ARROW_UR = '<path d="M7 17 17 7M8 7h9v9"/>'
const ARROW_L = '<path d="M19 12H5M11 6l-6 6 6 6"/>'
const BURGER = '<path d="M4 8h16M4 16h16"/>'
const CLOSE = '<path d="M6 6l12 12M18 6 6 18"/>'
const LIST = '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>'

const LOGO = `<svg viewBox="0 0 77 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 0H15.4V24.9691H0V0Z" fill="currentColor"/><path d="M30.8 0H46.2V50H30.8V0Z" fill="currentColor"/><path d="M15.4 25H30.8L15.4 49.9691H0L15.4 25Z" fill="currentColor"/><path d="M61.6 0H77L61.6 24.9691H46.2L61.6 0Z" fill="currentColor"/><path d="M61.6 25H77V49.9691H61.6V25Z" fill="currentColor"/></svg>`

const pad = (n) => String(n).padStart(2, '0')

/** Button with the home's sheen + rolling label. */
const btn = (href, label, cls = 'btn glass') =>
  `<a class="${cls}" href="${esc(href)}"><span class="btn-sheen" aria-hidden="true"></span><span class="btn-txt"><span>${esc(label)}</span><span aria-hidden="true">${esc(label)}</span></span>${icon(ARROW_UR)}</a>`

/** Split-line display title (same markup as SectionHead), revealed line by line. */
const lines = (arr) => arr.map((l, i) => `<span class="ln"><span class="ln-in" style="--li:${i}">${esc(l)}</span></span>`).join('')

/** Posts per page on the index (search, filters and pages run client-side: v2/lib/blog-index.js). */
export const PAGE_SIZE = 6

/** Post rows: the home's work list. The whole row is the link (stretched title link).
    The same markup lays out as a list or as cards in columns (.post-list.is-grid, v2/blog.css);
    a post without a cover gets a placeholder that only the cards show.
    With `index`, rows carry what the search/filters need, and rows past the first page start hidden. */
function postRows(posts, lang, heading = 'h2', index = false) {
  const t = T[lang]
  const data = (p, i) => index
    ? ` data-cat="${esc(slugify(p.category))}" data-search="${esc(fold([p.title, p.description, p.category, ...p.tags].join(' ')))}"`
    : ''
  return posts.map((p, i) => `<li class="work-row post-row${index && i >= PAGE_SIZE ? ' is-off' : ''}" data-reveal="up" style="--i:${Math.min(i % PAGE_SIZE, 5)}" data-cursor="label:${t.readLabel}"${data(p, i)}${p.cover ? ` data-preview="${i}" data-label="${esc(p.category || t.blog)}"` : ''}>
<span class="num">${pad(i + 1)}</span>
<div class="main">
<div class="title-line"><${heading} class="name"><a class="row-link" href="${postPath(lang, esc(p.slug))}"><span>${esc(p.title)}</span></a></${heading}></div>
<p class="desc">${esc(p.description)}</p>
${p.category || p.tags.length ? `<div class="tags">${p.category ? `<span class="tag tag-cat">${esc(p.category)}</span>` : ''}${p.tags.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>` : ''}
</div>
<div class="side"><time class="year" datetime="${p.published}">${fmtShort(p.published, lang)}</time><span class="mins">${p.readingMinutes} ${t.readShort}</span><span class="arrow" aria-hidden="true">${icon(ARROW_UR, '')}</span></div>
${p.cover ? `<div class="thumb glass"><img src="${esc(p.cover)}" alt="" width="1200" height="630" loading="lazy" decoding="async"></div>` : `<div class="thumb thumb-empty glass" aria-hidden="true">${LOGO}</div>`}
</li>`).join('\n')
}

/** Floating cover that follows the pointer over the rows (desktop). */
const previewFor = (posts) => posts.some((p) => p.cover)
  ? `<div class="work-preview glass" aria-hidden="true">${posts.map((p, i) => p.cover ? `<img data-i="${i}" src="${esc(p.cover)}" alt="" loading="lazy">` : '').join('')}<span class="lbl"></span></div>`
  : ''

/* Runs right after the index list, before the first paint: mobile readers and those who chose the columns get the cards without a flash of the list. */
const VIEW_SCRIPT = `<script>try{if(matchMedia("${VIEW_MOBILE}").matches||localStorage.getItem("hk_blog_view")==="grid")document.currentScript.previousElementSibling.classList.add("is-grid")}catch(e){}</script>`

/** `index`: the blog index (search data, pages, list/columns choice). `grid`: always in columns ("See also"). */
const postList = (posts, lang, heading, { index = false, grid = false } = {}) =>
  `<div class="work-list" data-reveal="line"></div>\n<ol class="work-list post-list${grid ? ' is-grid' : ''}">\n${postRows(posts, lang, heading, index)}\n</ol>${index ? VIEW_SCRIPT : ''}`

const CHEVRON = '<path d="m6 9 6 6 6-6"/>'
const CHECK = '<path d="m5 12 4.5 4.5L19 7"/>'
const SEARCH = '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/>'
const VIEW_LIST = '<path d="M4 6h16M4 12h16M4 18h16"/>'
const VIEW_GRID = '<rect x="3.5" y="5" width="4.5" height="14" rx="1"/><rect x="9.75" y="5" width="4.5" height="14" rx="1"/><rect x="16" y="5" width="4.5" height="14" rx="1"/>'

/** Search field + category dropdown (state in the URL: ?q=&cat=&page=) and the list/columns switch (remembered in the browser). */
function postTools(posts, lang) {
  const t = T[lang]
  const cats = new Map()
  for (const p of posts) if (p.category) cats.set(p.category, (cats.get(p.category) || 0) + 1)
  const opts = [['', t.all, posts.length], ...[...cats].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c, n]) => [slugify(c), c, n])]
  const option = ([slug, label, n], i) => `<li id="post-cat-${i}" role="option" class="post-filter-opt" data-cat="${esc(slug)}" data-label="${esc(label)}" aria-selected="${i === 0}"><span>${esc(label)}</span><span class="n tnum">${n}</span>${icon(CHECK, 'tick')}</li>`
  const filter = `<div class="post-filter">
<button type="button" class="post-filter-btn glass" aria-haspopup="listbox" aria-expanded="false" aria-controls="post-cat-list" aria-labelledby="post-cat-k post-cat-v">
<span class="k" id="post-cat-k">${t.category}</span><span class="v" id="post-cat-v">${esc(t.all)}</span><span class="n tnum">${posts.length}</span>${icon(CHEVRON, 'chev')}
</button>
<ul id="post-cat-list" class="post-filter-list glass" role="listbox" aria-label="${t.filters}" tabindex="-1" hidden>${opts.map(option).join('')}</ul>
</div>`
  return `<div class="post-tools" data-reveal="up">
<form class="post-search glass" role="search" action="" data-pt="off">
${icon(SEARCH)}<label class="sr-only" for="post-q">${t.search}</label>
<input id="post-q" name="q" type="search" placeholder="${esc(t.searchPh)}" autocomplete="off" spellcheck="false" enterkeyhint="search">
<kbd aria-hidden="true">/</kbd>
</form>
${cats.size > 1 ? filter : ''}
<div class="post-view glass" role="group" aria-label="${t.view}">
<button type="button" class="post-view-btn" data-view="list" aria-pressed="true" aria-label="${t.viewList}" title="${t.viewList}">${icon(VIEW_LIST)}</button>
<button type="button" class="post-view-btn" data-view="grid" aria-pressed="false" aria-label="${t.viewGrid}" title="${t.viewGrid}">${icon(VIEW_GRID)}</button>
</div>
</div>
<p class="post-status label" aria-live="polite"></p>`
}

const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`

const absolute = (u) => (u.startsWith('http') ? u : `${SITE}${u}`)

const fmtDate = (iso, lang) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-BE', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso))
const fmtShort = (iso, lang) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-BE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso))

/** The home's nav, as static markup. Section links go back to the home (/#work…), Blog is lit. */
function nav(lang, switchTo, self) {
  const s = STRINGS[lang]
  const items = [
    ['work', '/#work'], ['about', '/#about'], ['services', '/#services'], ['blog', blogPath(lang)], ['contact', '/#contact'],
  ]
  const langLink = (l) => l === lang
    ? `<a href="${esc(self)}" class="on" aria-current="true" lang="${l}">${l}</a>`
    : `<a href="${esc(switchTo.href)}" hreflang="${l}" lang="${l}" aria-label="${esc(switchTo.aria)}">${l}</a>`
  return `<div class="nav-progress" aria-hidden="true"></div>
<div class="nav-wrap">
<nav class="nav glass" aria-label="Primary">
<a href="/" class="nav-logo" aria-label="${AUTHOR} — ${T[lang].home}">${LOGO}<span class="nav-name">${AUTHOR}</span></a>
<div class="nav-links">${items.map(([k, href]) => `<a href="${href}" class="nav-link${k === 'blog' ? ' active' : ''}"${k === 'blog' ? ' aria-current="page"' : ''}>${esc(s.nav[k])}<span class="dot" aria-hidden="true"></span></a>`).join('')}</div>
<div class="nav-right">
<div class="lang ${lang}" role="group" aria-label="Language"><span class="lang-thumb" aria-hidden="true"></span>${['en', 'fr'].map(langLink).join('')}</div>
<button class="btn btn-icon glass nav-burger" type="button" aria-label="${esc(s.menu)}" aria-expanded="false" data-menu="${esc(s.menu)}" data-close="${esc(s.close)}">${icon(BURGER, 'ico ico-burger')}${icon(CLOSE, 'ico ico-close').replace('<svg', '<svg style="display:none"')}</button>
</div>
</nav>
</div>
<div class="menu-sheet" aria-hidden="true">${items.map(([k, href], i) => `<a href="${href}" tabindex="-1"${k === 'blog' ? ' aria-current="page"' : ''}><span class="label">${pad(i + 1)}</span>${esc(s.nav[k])}${icon(ARROW_UR, 'sheet-arrow')}</a>`).join('')}</div>`
}

/** Closing CTA (the home's contact section) + the home's footer. */
function closing(lang) {
  const t = T[lang]
  const s = STRINGS[lang]
  return `<section id="contact" class="section blog-cta">
<div class="wrap">
<div class="sec-label label" data-reveal="fade">${t.ctaLabel}</div>
<h2 class="display contact-title lines">${lines([t.cta])}</h2>
<p class="lead cta-lead" data-reveal="up" style="--i:1">${esc(t.ctaText)}</p>
<div class="cta-actions" data-reveal="up" style="--i:2">${btn('/#contact', t.ctaBtn, 'btn btn-primary glass')}<a class="mail" href="mailto:${esc(s.contactEmail)}" data-pt="off">${esc(s.contactEmail)}</a></div>
</div>
</section>`
}

function footer(lang) {
  const t = T[lang]
  const s = STRINGS[lang]
  return `<footer class="footer">
<div class="wrap cols">
<div><span class="label">${esc(s.footer)}</span><span class="note">${esc(s.footerNote)}</span></div>
<div class="clock glass"><span class="led" aria-hidden="true"></span><span class="label tnum">${esc(s.localTime)} <span data-clock></span></span></div>
<div><span class="label">${esc(s.roleLine)}</span> · <a class="label rss" href="${rssPath(lang)}">${t.rss}</a></div>
</div>
</footer>`
}

function layout({ lang, title, description, canonical, ogImage, ogAlt = AUTHOR, ogSized = true, ogType = 'website', ld = [], body, extraHead = '', switchTo, floating = '', preview = '' }) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#07080A">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${AUTHOR}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" type="application/rss+xml" title="Blog ${AUTHOR}" href="${SITE}${rssPath(lang)}">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${AUTHOR}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(ogImage)}">
${ogSized ? `<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n` : ''}<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'fr_BE'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="twitter:image:alt" content="${esc(ogAlt)}">
${extraHead}${ld.map(jsonLd).join('\n')}
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800&f[]=satoshi@400,500,600,700&display=swap" rel="stylesheet">
<style>html{background:#07080A;color-scheme:dark}body{margin:0;background:#07080A}html.pt-enter body::after{content:"";position:fixed;inset:0;z-index:98;background:#07080A}</style>
<script>${PT_HEAD_SCRIPT}try{localStorage.setItem("hk_lang","${lang}")}catch(e){}</script>
<link rel="stylesheet" href="/v2/styles.css">
<link rel="stylesheet" href="/v2/blog.css">
</head>
<body class="blog">
<div id="chrome"></div>
<a class="skip" href="#main">${T[lang].skip}</a>
${nav(lang, switchTo, new URL(canonical).pathname)}
<main id="main">
${body}
${closing(lang)}
</main>
${footer(lang)}
${floating}
${preview}
<script type="module" src="/v2/blog.jsx"></script>
</body>
</html>
`
}

/** Table of contents: every heading of the article (h2 to h6), in reading order. Top-level ones are numbered,
    the others indented under them. Rendered twice: next to the text (sticky on desktop, under the cover on mobile)
    and in the floating panel mobile readers open once they have scrolled past it. */
function tocFor(bodyHtml, lang) {
  const t = T[lang]
  const heads = [...bodyHtml.matchAll(/<h([2-6]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)].map((m) => ({ level: Number(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, '') }))
  if (heads.length < 2) return { inline: '', floating: '' }
  const top = Math.min(...heads.map((h) => h.level))
  let n = 0
  const list = `<ol class="toc-list">${heads.map((h) => `<li><a href="#${h.id}" style="--d:${h.level - top}">${h.level === top ? `<span class="n tnum">${pad(++n)}</span>` : ''}<span>${h.text}</span></a></li>`).join('')}</ol>`
  const title = `<div class="toc-title label">${t.toc}</div>`
  return {
    inline: `<nav class="toc" aria-label="${t.toc}">${title}${list}</nav>`,
    floating: `<div class="toc-float">
<nav class="toc-sheet glass" id="toc-sheet" aria-label="${t.toc}" hidden><div class="toc-sheet-scroll">${title}${list}</div></nav>
<button class="btn btn-icon glass toc-fab" type="button" aria-controls="toc-sheet" aria-expanded="false" aria-label="${t.tocOpen}" data-open="${t.tocOpen}" data-close="${t.tocClose}">${icon(LIST, 'ico ico-list')}${icon(CLOSE, 'ico ico-close').replace('<svg', '<svg style="display:none"')}</button>
</div>`,
  }
}

export function articlePage(post, bodyHtml) {
  const t = T[post.lang]
  const url = `${SITE}${postPath(post.lang, post.slug)}`
  const alt = post.alt || null
  const other = post.lang === 'en' ? 'fr' : 'en'
  // Link preview: the 1200x630 version of the cover, else the translation's, else the site default.
  const shared = [post, alt].find((x) => x?.og || x?.cover)
  const image = shared ? absolute(shared.og || shared.cover) : DEFAULT_OG
  const modified = post.updated > post.published ? post.updated : post.published
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: post.title, description: post.description, image: [image],
      datePublished: post.published, dateModified: modified, inLanguage: post.lang,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Person', name: AUTHOR, url: SITE },
      publisher: { '@type': 'Person', name: AUTHOR, url: SITE },
      ...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.home, item: SITE },
        { '@type': 'ListItem', position: 2, name: t.blog, item: `${SITE}${blogPath(post.lang)}` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ]
  const showUpdated = post.updated.slice(0, 10) > post.published.slice(0, 10)
  const toc = tocFor(bodyHtml, post.lang)
  const row = (k, v) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`
  const body = `<section id="blog-head" class="section post-head">
<div class="wrap">
<a class="back label" href="${blogPath(post.lang)}" data-reveal="fade">${icon(ARROW_L)}${t.back}</a>
<div class="post-head-grid">
<div class="post-head-copy">
${post.category ? `<div class="sec-label label" data-reveal="fade">${esc(post.category.toUpperCase())}</div>` : ''}
<h1 class="display post-title lines"><span class="ln"><span class="ln-in">${esc(post.title)}</span></span></h1>
<p class="lead" data-reveal="up" style="--i:2">${esc(post.description)}</p>
</div>
<aside class="hero-meta-card glass post-meta" data-reveal="blur" style="--i:3">
${row(t.publishedShort, `<time datetime="${post.published}">${fmtDate(post.published, post.lang)}</time>`)}
${showUpdated ? row(t.updatedShort, `<time datetime="${post.updated}">${fmtDate(post.updated, post.lang)}</time>`) : ''}
${row(t.reading, `${post.readingMinutes} ${t.read}`)}
${post.category ? row(t.category, esc(post.category)) : ''}
</aside>
</div>
${post.cover ? `<figure class="post-cover glass" data-reveal="scale" style="--i:3"><img src="${esc(post.cover)}" alt="${esc(post.coverAlt)}" width="1200" height="630" decoding="async"></figure>` : ''}
</div>
</section>
<section id="article" class="section post-body">
<div class="wrap post-layout${toc.inline ? ' has-toc' : ''}">
${toc.inline}
<div class="post-main">
<article class="prose">
${bodyHtml}
</article>
${post.tags.length ? `<ul class="post-tags" aria-label="${t.tags}">${post.tags.map((x) => `<li class="tag">${esc(x)}</li>`).join('')}</ul>` : ''}
</div>
</div>
</section>
${post.related?.length ? `<section id="related" class="section">
<div class="wrap">
<header class="sec-head"><div class="sec-label label" data-reveal="fade">${t.seeAlsoLabel}</div><h2 class="display h-1 lines" id="see-also">${lines([t.seeAlso])}</h2></header>
${postList(post.related, post.lang, 'h3', { grid: true })}
</div>
</section>` : ''}`
  return layout({ lang: post.lang, title: `${post.title} | ${AUTHOR}`, description: post.description, canonical: url, ogImage: image, ogAlt: shared ? shared.coverAlt : AUTHOR, ogSized: !shared || !!shared.og, ogType: 'article', ld, body,
    floating: toc.floating,
    switchTo: alt
      ? { href: postPath(alt.lang, alt.slug), aria: T[other].switchAria }
      : { href: blogPath(other), aria: T[other].switchIndexAria },
    extraHead: alternates(alt ? [post, alt].map((x) => ({ lang: x.lang, url: `${SITE}${postPath(x.lang, x.slug)}` })) : []) +
      `<meta property="article:published_time" content="${post.published}">\n<meta property="article:modified_time" content="${modified}">\n` })
}

export function indexPage(posts, lang) {
  const t = T[lang]
  const other = lang === 'en' ? 'fr' : 'en'
  const base = `${SITE}${blogPath(lang)}`
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog Hamza Khadri', url: base, inLanguage: lang,
      author: { '@type': 'Person', name: AUTHOR, url: SITE },
      blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}${postPath(lang, p.slug)}`, datePublished: p.published })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: SITE },
      { '@type': 'ListItem', position: 2, name: t.blog, item: base } ] },
  ]
  const body = `<section id="blog-head" class="section blog-head">
<div class="wrap">
<header class="sec-head">
<div>
<div class="sec-label label" data-reveal="fade">${t.indexLabel}</div>
<h1 class="display h-1 lines" style="max-width:16ch">${lines(t.indexH1)}</h1>
<p class="lead blog-lead" data-reveal="up" style="--i:2">${esc(t.indexLead)}</p>
</div>
<div class="sec-index" aria-hidden="true" data-reveal="fade">blog</div>
</header>
</div>
</section>
<section id="posts" class="section blog-posts">
<div class="wrap">
${posts.length ? `${postTools(posts, lang)}
${postList(posts, lang, 'h2', { index: true })}
<div class="post-empty" hidden><p class="lead">${t.noMatch}</p>${btn('#posts', t.reset, 'btn glass post-reset')}</div>
<nav class="pager" aria-label="${t.pager}" data-size="${PAGE_SIZE}" data-labels="${esc(JSON.stringify({ page: t.page, prev: t.prev, next: t.next }))}">${pagerHtml(1, Math.ceil(posts.length / PAGE_SIZE), { page: t.page, prev: t.prev, next: t.next })}</nav>
<noscript><style>.post-row.is-off{display:grid!important}.pager,.post-tools{display:none!important}</style></noscript>` : `<p class="lead">${t.empty}</p>`}
</div>
</section>`
  return layout({ lang, title: t.indexTitle, description: t.indexDesc, canonical: base, ogImage: DEFAULT_OG, ld, body,
    preview: previewFor(posts),
    switchTo: { href: blogPath(other), aria: T[other].switchIndexAria },
    extraHead: alternates(LANGS.map((l) => ({ lang: l, url: `${SITE}${blogPath(l)}` }))) })
}

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function rssFeed(posts, lang) {
  const t = T[lang]
  const items = posts.map((p) => `<item><title>${xml(p.title)}</title><link>${SITE}${postPath(lang, p.slug)}</link><guid isPermaLink="true">${SITE}${postPath(lang, p.slug)}</guid><pubDate>${new Date(p.published).toUTCString()}</pubDate><description>${xml(p.description)}</description>${p.category ? `<category>${xml(p.category)}</category>` : ''}</item>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Blog ${AUTHOR}</title><link>${SITE}${blogPath(lang)}</link><description>${xml(t.indexDesc)}</description><language>${lang}</language>
<atom:link href="${SITE}${rssPath(lang)}" rel="self" type="application/rss+xml"/>
${items}
</channel></rss>
`
}

/** posts: all published posts (both languages). Each with .alt (translation) when linked. */
export function sitemapUrls(posts) {
  const entry = (loc, lastmod, freq, prio, alts = []) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n${alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[a.lang]}" href="${a.url}"/>\n`).join('')}  </url>\n`
  const newest = (list) => (list.length ? list.map((p) => p.updated).sort().at(-1) : new Date().toISOString())
  const idx = LANGS.map((l) => entry(`${SITE}${blogPath(l)}`, newest(posts.filter((p) => p.lang === l)), 'weekly', '0.8',
    LANGS.map((x) => ({ lang: x, url: `${SITE}${blogPath(x)}` })))).join('')
  const arts = posts.map((p) => entry(`${SITE}${postPath(p.lang, p.slug)}`, p.updated, 'monthly', '0.7',
    p.alt ? [p, p.alt].map((x) => ({ lang: x.lang, url: `${SITE}${postPath(x.lang, x.slug)}` })) : [])).join('')
  return idx + arts
}
