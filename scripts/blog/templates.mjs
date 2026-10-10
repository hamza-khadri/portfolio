// HTML templates for /blog and /blog/<slug>. Standalone pages (no React),
// styled with the same tokens as the homepage (v2/styles.css).

import { esc } from './render.mjs'

export const SITE = (process.env.SITE_URL || 'https://hamzakhadri.com').replace(/\/$/, '')
export const AUTHOR = 'Hamza Khadri'
export const DEFAULT_OG = `${SITE}/assets/og-image.png`

const T = {
  fr: {
    home: 'Accueil', blog: 'Blog', contact: 'Contact', read: 'min de lecture', back: '← Tous les articles',
    empty: 'Les premiers articles arrivent bientôt.', updated: 'Mis à jour le',
    indexTitle: 'Blog | Hamza Khadri',
    indexDesc: "Articles sur l'IA, l'automatisation, le no-code et le product, par Hamza Khadri.",
    indexH1: 'Blog', indexLead: "IA, automatisation, no-code et product : ce que je construis et ce que j'en apprends.",
    cta: 'Un process à automatiser ?', ctaText: "Parlons-en : je repère les opportunités IA dans vos process et je les concrétise.", ctaBtn: 'Me contacter',
    rss: 'Flux RSS', rights: 'Tous droits réservés', switchLabel: 'English version', switchIndex: 'English', switchAria: 'Read this article in English', otherLang: 'en',
  },
  en: {
    home: 'Home', blog: 'Blog', contact: 'Contact', read: 'min read', back: '← All articles',
    empty: 'First articles coming soon.', updated: 'Updated',
    indexTitle: 'Blog | Hamza Khadri',
    indexDesc: 'Articles on AI, automation, no-code and product, by Hamza Khadri.',
    indexH1: 'Blog', indexLead: 'AI, automation, no-code and product: what I build and what I learn from it.',
    cta: 'A process to automate?', ctaText: 'Let’s talk: I spot AI opportunities in your processes and make them real.', ctaBtn: 'Get in touch',
    rss: 'RSS feed', rights: 'All rights reserved', switchLabel: 'Version française', switchIndex: 'Français', switchAria: 'Lire cet article en français', otherLang: 'fr',
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

const CSS = `
:root{--bg:#07080A;--ink:#ECEEF1;--ink-2:#B4B8C0;--ink-3:#7E838D;--line:rgba(255,255,255,.075);--accent:#8B7BFF;--surface:#0E1014;
--font-display:'Cabinet Grotesk','Satoshi',system-ui,sans-serif;--font-body:'Satoshi',system-ui,-apple-system,sans-serif;--gutter:clamp(1.25rem,4vw,3.5rem)}
*{box-sizing:border-box}html{background:var(--bg);color-scheme:dark;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:1.0625rem;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-underline-offset:.2em}a:hover{color:#fff}
.skip{position:absolute;left:-999px}.skip:focus{left:1rem;top:1rem;background:var(--accent);color:#000;padding:.5rem 1rem;border-radius:6px;z-index:9}
header.site{display:flex;align-items:center;justify-content:space-between;padding:1.4rem var(--gutter);border-bottom:1px solid var(--line)}
header.site nav{display:flex;gap:1.6rem;font-size:.92rem}header.site nav a{color:var(--ink-2);text-decoration:none}header.site nav a:hover,header.site nav a[aria-current]{color:#fff}
main{max-width:46rem;margin:0 auto;padding:3.5rem var(--gutter) 5rem}
.wide{max-width:64rem}
h1,h2,h3,h4{font-family:var(--font-display);line-height:1.15;letter-spacing:-.01em;color:#fff}
h1{font-size:clamp(2.1rem,5vw,3.2rem);font-weight:800;margin:0 0 1rem}
h2{font-size:1.75rem;margin:3rem 0 1rem}h3{font-size:1.3rem;margin:2.2rem 0 .8rem}h4{font-size:1.1rem;margin:1.8rem 0 .6rem}
.meta{display:flex;flex-wrap:wrap;gap:.4rem 1rem;color:var(--ink-3);font-size:.9rem;margin-bottom:2rem}
.tags{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 2rem;padding:0;list-style:none}
.tags li{border:1px solid var(--line);border-radius:999px;padding:.15rem .8rem;font-size:.8rem;color:var(--ink-2)}
.lead{font-size:1.2rem;color:var(--ink-2)}
article p,article li{color:#D5D8DE}article ul,article ol{padding-left:1.4rem}article li{margin:.3rem 0}
article img{max-width:100%;height:auto;border-radius:14px;display:block}
figure{margin:2rem 0}figcaption{color:var(--ink-3);font-size:.88rem;margin-top:.6rem}
blockquote{margin:1.8rem 0;padding:.2rem 0 .2rem 1.2rem;border-left:3px solid var(--accent);color:var(--ink)}
hr{border:0;border-top:1px solid var(--line);margin:2.5rem 0}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em;background:var(--surface);border:1px solid var(--line);padding:.1em .35em;border-radius:5px}
pre{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1rem 1.2rem;overflow-x:auto;line-height:1.5}pre code{background:none;border:0;padding:0}
.callout{display:flex;gap:.8rem;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1rem 1.2rem;margin:1.8rem 0}.callout p{margin:0}
details{margin:1rem 0;border:1px solid var(--line);border-radius:12px;padding:.8rem 1.2rem}summary{cursor:pointer;font-weight:600}
.table-wrap{overflow-x:auto;margin:1.8rem 0}table{border-collapse:collapse;width:100%;font-size:.95rem}th,td{border:1px solid var(--line);padding:.55rem .8rem;text-align:left}th{background:var(--surface);color:#fff}
.todos{list-style:none;padding-left:0}.todo.done{color:var(--ink-3)}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:1.5rem}
.link-card a{word-break:break-all}
.cover{margin:0 0 2.5rem}.cover img{width:100%;aspect-ratio:1200/630;object-fit:cover}
.cards{display:grid;gap:1.2rem;margin-top:2.5rem;padding:0;list-style:none}
.card a{display:block;text-decoration:none;color:inherit;border:1px solid var(--line);border-radius:18px;padding:1.5rem;background:var(--surface);transition:border-color .2s,transform .2s}
.card a:hover{border-color:var(--accent);transform:translateY(-2px)}.card h2{margin:.2rem 0 .6rem;font-size:1.45rem}.card p{margin:0;color:var(--ink-2)}
.card .meta{margin:0}.card img{width:100%;aspect-ratio:1200/630;object-fit:cover;margin-bottom:1rem}
.cta{margin-top:4rem;border:1px solid var(--line);border-radius:18px;padding:1.8rem;background:var(--surface)}
.cta h2{margin:0 0 .5rem;font-size:1.4rem}.cta p{margin:0 0 1.2rem;color:var(--ink-2)}
.btn{display:inline-block;background:var(--accent);color:#07080A;font-weight:700;text-decoration:none;border-radius:999px;padding:.7rem 1.4rem}.btn:hover{color:#000;filter:brightness(1.1)}
.back{display:inline-block;margin-bottom:2rem;color:var(--ink-2);text-decoration:none;font-size:.92rem}
footer.site{border-top:1px solid var(--line);padding:1.8rem var(--gutter);color:var(--ink-3);font-size:.88rem;display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;justify-content:space-between}
footer.site a{color:var(--ink-3)}
header.site .lang{border:1px solid var(--line);border-radius:999px;padding:.1rem .8rem;font-size:.82rem;color:var(--ink-2);text-decoration:none}header.site .lang:hover{border-color:var(--accent);color:#fff}
@media (max-width:560px){header.site nav{gap:1rem}}
`

const LOGO = `<svg width="46" height="30" viewBox="0 0 77 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 0H15.4V24.9691H0V0Z" fill="white"/><path d="M30.8 0H46.2V50H30.8V0Z" fill="white"/><path d="M15.4 25H30.8L15.4 49.9691H0L15.4 25Z" fill="white"/><path d="M61.6 0H77L61.6 24.9691H46.2L61.6 0Z" fill="white"/><path d="M61.6 25H77V49.9691H61.6V25Z" fill="white"/></svg>`

const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`

const absolute = (u) => (u.startsWith('http') ? u : `${SITE}${u}`)

const fmtDate = (iso, lang) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-BE', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso))

function layout({ lang, title, description, canonical, ogImage, ogType = 'website', ld = [], body, current, extraHead = '', switchTo = null }) {
  const t = T[lang]
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
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'fr_BE'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
${extraHead}${ld.map(jsonLd).join('\n')}
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800&f[]=satoshi@400,500,600,700&display=swap" rel="stylesheet">
<script>try{localStorage.setItem("hk_lang","${lang}")}catch(e){}</script>
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#main">${lang === 'en' ? 'Skip to content' : 'Aller au contenu'}</a>
<header class="site">
<a href="/" aria-label="${AUTHOR}">${LOGO}</a>
<nav aria-label="Navigation"><a href="/">${t.home}</a><a href="${blogPath(lang)}"${current === 'blog' ? ' aria-current="page"' : ''}>${t.blog}</a><a href="/#contact">${t.contact}</a>${switchTo ? `<a class="lang" href="${esc(switchTo.href)}" hreflang="${t.otherLang}" lang="${t.otherLang}" aria-label="${esc(switchTo.aria)}">${esc(switchTo.label)}</a>` : ''}</nav>
</header>
${body}
<footer class="site"><span>© ${new Date().getUTCFullYear()} ${AUTHOR}. ${t.rights}.</span><a href="${rssPath(lang)}">${t.rss}</a></footer>
</body>
</html>
`
}

export function articlePage(post, bodyHtml) {
  const t = T[post.lang]
  const url = `${SITE}${postPath(post.lang, post.slug)}`
  const alt = post.alt || null
  const image = post.cover ? absolute(post.cover) : DEFAULT_OG
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
  const body = `<main id="main">
<a class="back" href="${blogPath(post.lang)}">${t.back}</a>
<article>
<h1>${esc(post.title)}</h1>
<div class="meta"><time datetime="${post.published}">${fmtDate(post.published, post.lang)}</time>${showUpdated ? `<span>${t.updated} <time datetime="${post.updated}">${fmtDate(post.updated, post.lang)}</time></span>` : ''}<span>${post.readingMinutes} ${t.read}</span>${post.category ? `<span>${esc(post.category)}</span>` : ''}</div>
${post.cover ? `<figure class="cover"><img src="${esc(post.cover)}" alt="${esc(post.coverAlt)}" width="1200" height="630" decoding="async"></figure>` : ''}
${bodyHtml}
</article>
${post.tags.length ? `<ul class="tags" aria-label="Tags">${post.tags.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
<section class="cta"><h2>${t.cta}</h2><p>${t.ctaText}</p><a class="btn" href="/#contact">${t.ctaBtn}</a></section>
</main>`
  return layout({ lang: post.lang, title: `${post.title} | ${AUTHOR}`, description: post.description, canonical: url, ogImage: image, ogType: 'article', ld, body, current: 'blog',
    switchTo: alt
      ? { href: postPath(alt.lang, alt.slug), label: t.switchLabel, aria: t.switchAria }
      : { href: blogPath(t.otherLang), label: t.switchIndex, aria: t.switchIndex },
    extraHead: alternates(alt ? [post, alt].map((x) => ({ lang: x.lang, url: `${SITE}${postPath(x.lang, x.slug)}` })) : []) +
      `<meta property="article:published_time" content="${post.published}">\n<meta property="article:modified_time" content="${modified}">\n` })
}

export function indexPage(posts, lang) {
  const t = T[lang]
  const base = `${SITE}${blogPath(lang)}`
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog Hamza Khadri', url: base, inLanguage: lang,
      author: { '@type': 'Person', name: AUTHOR, url: SITE },
      blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}${postPath(lang, p.slug)}`, datePublished: p.published })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: SITE },
      { '@type': 'ListItem', position: 2, name: t.blog, item: base } ] },
  ]
  const cards = posts.map((p) => `<li class="card"><a href="${postPath(lang, esc(p.slug))}">
${p.cover ? `<img src="${esc(p.cover)}" alt="" width="1200" height="630" loading="lazy" decoding="async">` : ''}
<div class="meta"><time datetime="${p.published}">${fmtDate(p.published, lang)}</time><span>${p.readingMinutes} ${t.read}</span>${p.category ? `<span>${esc(p.category)}</span>` : ''}</div>
<h2>${esc(p.title)}</h2><p>${esc(p.description)}</p></a></li>`).join('\n')
  const body = `<main id="main" class="wide">
<h1>${t.indexH1}</h1><p class="lead">${t.indexLead}</p>
${posts.length ? `<ul class="cards">\n${cards}\n</ul>` : `<p>${t.empty}</p>`}
</main>`
  return layout({ lang, title: t.indexTitle, description: t.indexDesc, canonical: base, ogImage: DEFAULT_OG, ld, body, current: 'blog',
    switchTo: { href: blogPath(t.otherLang), label: t.switchIndex, aria: t.switchIndex },
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
