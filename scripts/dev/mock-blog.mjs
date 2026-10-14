// Realistic fake articles for working on the blog UI without Notion (BLOG_MOCK=1, see `npm run dev:blog`).
// Same shapes as the Notion API, served in-process: no token, no network. Covers are generated SVGs (data: URLs).
// Unlike scripts/dev/mock-notion.mjs (edge cases for the sync), this is meant to look like a real blog.

const t = (s, a = {}) => ({ plain_text: s, annotations: a, href: null })
const b = (s) => t(s, { bold: true })
const i = (s) => t(s, { italic: true })
const c = (s) => t(s, { code: true })
const a = (s, href) => ({ plain_text: s, annotations: {}, href })

/** Gradient SVG cover, as a Notion "file" object (data: URL, downloaded like a real one). */
function cover(from, to, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#g)"/>
<circle cx="1250" cy="220" r="260" fill="#fff" opacity=".08"/><circle cx="300" cy="760" r="340" fill="#000" opacity=".08"/>
<text x="120" y="780" font-family="system-ui, sans-serif" font-size="96" font-weight="700" fill="#fff" opacity=".9">${label}</text></svg>`
  return { type: 'file', file: { url: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` } }
}

let seq = 0
const blk = (type, data, children) => ({ id: `mb${++seq}`, type, [type]: data, has_children: !!children, children })
const p = (...rt) => blk('paragraph', { rich_text: rt })
const h1 = (s) => blk('heading_1', { rich_text: [t(s)] })
const h2 = (s) => blk('heading_2', { rich_text: [t(s)] })
const h3 = (s) => blk('heading_3', { rich_text: [t(s)] })
const rich = (x) => [].concat(x).map((v) => (typeof v === 'string' ? t(v) : v))
const li = (rt, children) => blk('bulleted_list_item', { rich_text: rich(rt) }, children)
const ol = (rt) => blk('numbered_list_item', { rich_text: rich(rt) })
const todo = (s, checked) => blk('to_do', { rich_text: [t(s)], checked })
const quote = (s) => blk('quote', { rich_text: [t(s)] })
const callout = (emoji, ...rt) => blk('callout', { icon: { type: 'emoji', emoji }, rich_text: rt })
const code = (language, s) => blk('code', { language, rich_text: [t(s)] })
const img = (f, caption) => blk('image', { ...f, caption: [t(caption)] })
const hr = () => blk('divider', {})
const toggle = (s, children) => blk('toggle', { rich_text: [t(s)] }, children)
const table = (rows) => blk('table', { has_column_header: true }, rows.map((cells) => blk('table_row', { cells: cells.map((x) => [t(x)]) })))
const bookmark = (url) => blk('bookmark', { url, caption: [] })
const columns = (...cols) => blk('column_list', {}, cols.map((col) => blk('column', col.ratio ? { width_ratio: col.ratio } : {}, col)))

function page(id, { title, slug, lang = 'FR', date, edited, desc = '', tags = [], category = '', cover: cv, alt, en, fr, related = [] }) {
  return {
    id,
    created_time: `${date}T08:00:00.000Z`,
    last_edited_time: `${edited || date}T08:00:00.000Z`,
    properties: {
      Titre: { title: [t(title)] },
      Slug: { rich_text: [t(slug)] },
      Publié: { checkbox: true },
      'Description SEO': { rich_text: desc ? [t(desc)] : [] },
      'Mots-clés': { multi_select: tags.map((name) => ({ name })) },
      Catégorie: { select: category ? { name: category } : null },
      Langue: { select: { name: lang } },
      'Version anglaise': { relation: en ? [{ id: en }] : [] },
      'Version française': { relation: fr ? [{ id: fr }] : [] },
      'Articles liés': { relation: related.map((rid) => ({ id: rid })) },
      'Date de publication': { date: { start: date } },
      'Dernière publication': { date: edited ? { start: edited } : null },
      'Image de couverture': { files: cv ? [cv] : [] },
      'Texte alternatif couverture': { rich_text: alt ? [t(alt)] : [] },
    },
  }
}

const lorem = [
  "Quand on lance un produit en solo, la tentation est de tout construire avant de montrer quoi que ce soit. J'ai fait cette erreur trois fois avant de comprendre que le vrai travail commence quand quelqu'un d'autre clique.",
  "Le no-code n'est pas un raccourci, c'est un autre rapport au temps : on échange de la flexibilité contre de la vitesse, et la question devient de savoir à quel moment cet échange cesse d'être rentable.",
  "Dans les faits, la plupart des projets clients que je vois ne meurent pas d'un problème technique. Ils meurent d'un problème de clarté : personne n'a écrit, noir sur blanc, ce que l'outil doit faire le lundi matin.",
]

const pages = [
  page('fr-design-system', {
    title: 'Construire un design system quand on est seul : ce qui marche vraiment',
    slug: 'design-system-solo',
    date: '2026-10-08', edited: '2026-10-10',
    desc: "Tokens, composants, documentation : ce que je garde et ce que je jette quand je monte un design system sans équipe derrière.",
    tags: ['Design system', 'Figma', 'Freelance'], category: 'Design',
    cover: cover('#1e3a8a', '#7c3aed', 'Design system'), alt: 'Dégradé bleu violet avec le titre Design system',
    en: 'en-design-system', related: ['fr-nocode-limites', 'fr-figma-code', 'fr-checklist-lancement'],
  }),
  page('fr-nocode-limites', {
    title: 'Les limites du no-code (et quand passer au code)',
    slug: 'limites-du-no-code',
    date: '2026-09-24',
    desc: "Bubble, Webflow, Make : trois signaux concrets qui disent qu'il est temps de sortir du no-code, et comment le faire sans tout réécrire.",
    tags: ['No-code', 'Make', 'Webflow'], category: 'Tutoriel',
    cover: cover('#065f46', '#0ea5e9', 'No-code'), alt: 'Dégradé vert et bleu avec le mot No-code',
    en: 'en-nocode-limits', related: ['fr-design-system', 'fr-vibe-coding'],
  }),
  page('fr-vibe-coding', {
    title: "Vibe coding : j'ai livré un SaaS en 10 jours, voici ce que j'ai appris",
    slug: 'vibe-coding-saas-10-jours',
    date: '2026-09-10',
    desc: "Retour d'expérience honnête : ce que l'IA fait très bien, là où elle m'a fait perdre deux jours, et la méthode que je garde.",
    tags: ['IA', 'Vibe coding', 'SaaS'], category: "Retour d'expérience",
    cover: cover('#9a3412', '#f59e0b', 'Vibe coding'), alt: 'Dégradé orange avec le titre Vibe coding',
    related: ['fr-nocode-limites', 'fr-checklist-lancement'],
  }),
  page('fr-figma-code', {
    title: 'De Figma au code sans perdre la moitié du design en route',
    slug: 'figma-vers-code',
    date: '2026-08-28',
    desc: 'Le handoff design/dev est souvent là où la qualité se perd. Ma méthode en cinq étapes pour que le produit final ressemble à la maquette.',
    tags: ['Figma', 'Handoff'], category: 'Design',
    // no cover: tests the card/article layout without image
  }),
  page('fr-checklist-lancement', {
    title: 'Checklist avant de lancer un site',
    slug: 'checklist-lancement-site',
    date: '2026-08-12',
    // no SEO description: tests the automatic excerpt
    tags: ['SEO', 'Lancement'], category: 'Checklist',
    cover: cover('#831843', '#f43f5e', 'Checklist'), alt: 'Dégradé rose avec le mot Checklist',
  }),
  page('fr-court', {
    title: 'Note rapide : pourquoi je facture au projet',
    slug: 'facturer-au-projet',
    date: '2026-07-30',
    desc: 'Trois paragraphes sur le forfait contre le taux horaire.',
    tags: ['Freelance'], category: 'Note',
  }),
  page('en-design-system', {
    title: 'Building a design system on your own: what actually works',
    slug: 'design-system-solo',
    lang: 'EN', date: '2026-10-08',
    desc: 'Tokens, components, documentation: what I keep and what I drop when building a design system without a team.',
    tags: ['Design system', 'Figma'], category: 'Design',
    cover: cover('#1e3a8a', '#7c3aed', 'Design system'), alt: 'Blue to purple gradient with the title Design system',
    fr: 'fr-design-system', related: ['en-nocode-limits'],
  }),
  page('en-nocode-limits', {
    title: 'The limits of no-code (and when to switch to code)',
    slug: 'limits-of-no-code',
    lang: 'EN', date: '2026-09-24',
    desc: 'Bubble, Webflow, Make: three concrete signals that it is time to leave no-code, and how to do it without rewriting everything.',
    tags: ['No-code'], category: 'Tutorial',
    cover: cover('#065f46', '#0ea5e9', 'No-code'), alt: 'Green and blue gradient with the word No-code',
    fr: 'fr-nocode-limites', related: ['en-design-system'],
  }),
  page('en-only', {
    title: 'Notes from a Brussels design meetup',
    slug: 'brussels-design-meetup',
    lang: 'EN', date: '2026-09-02',
    desc: 'An English-only post (no French version): the language switcher should fall back to the French index.',
    tags: ['Community'], category: 'Note',
  }),
]

/* Shorter FR posts so the index has several pages (search, filters, pagination). */
const EXTRA = [
  ['Automatiser ses factures avec Make et Notion', 'automatiser-factures-make-notion', 'Tutoriel', ['Make', 'Notion', 'Automatisation'], '#1e3a8a', '#0ea5e9'],
  ['Prompt engineering pour product owners', 'prompt-engineering-product-owners', 'IA', ['IA', 'Product'], '#4c1d95', '#a855f7'],
  ['Mon setup Figma en 2026', 'setup-figma-2026', 'Design', ['Figma', 'Outils'], null],
  ['Écrire un PRD que les devs lisent vraiment', 'prd-que-les-devs-lisent', 'Product', ['Product', 'Documentation'], '#0f766e', '#22d3ee'],
  ['Supabase ou Firebase pour un MVP ?', 'supabase-ou-firebase-mvp', 'Tutoriel', ['Supabase', 'MVP'], null],
  ['Agents IA : ce qui marche en production', 'agents-ia-production', 'IA', ['IA', 'Automatisation'], '#7c2d12', '#ef4444'],
  ['Trois erreurs de discovery que je ne fais plus', 'erreurs-de-discovery', "Retour d'expérience", ['Product', 'Discovery'], null],
  ['Lovable, Bolt, v0 : comparatif honnête', 'lovable-bolt-v0-comparatif', 'IA', ['IA', 'Vibe coding', 'No-code'], '#3730a3', '#f472b6'],
].map(([title, slug, category, tags, from, to], i) => page(`fr-extra-${i}`, {
  title, slug, category, tags,
  date: `2026-0${7 - Math.floor(i / 2)}-${String(20 - i * 2).padStart(2, '0')}`,
  desc: `${title} : notes concrètes, exemples et ce que j'en retiens après plusieurs projets clients.`,
  cover: from ? cover(from, to, category) : null, alt: from ? `Couverture ${category}` : '',
}))
pages.push(...EXTRA)

/** A long article that uses every block type the renderer supports. */
const full = (lang) => {
  const en = lang === 'en'
  return [
    p(t(en ? 'Most of the work happens ' : 'La plupart du travail se passe '), b(en ? 'before' : 'avant'), t(en ? ' the first component. ' : ' le premier composant. '), t(lorem[0])),
    p(t(lorem[1]), t(' '), a(en ? 'An external link' : 'Un lien externe', 'https://example.com'), t('.')),
    h1(en ? 'Start with tokens' : 'Commencer par les tokens'),
    p(t(lorem[2])),
    li([b('Couleurs'), t(' : primitives puis sémantiques')], [li('neutral-50 … neutral-900'), li('accent, danger, success')]),
    li([b('Typographie'), t(' : 4 tailles, pas plus')]),
    li([b('Espacements'), t(' : une échelle en 4px')]),
    code('css', ':root {\n  --color-accent: #7c3aed;\n  --space-2: 8px;\n  --radius-md: 12px;\n}\n\n.button {\n  padding: var(--space-2) calc(var(--space-2) * 2);\n  border-radius: var(--radius-md);\n}'),
    callout('💡', t(en ? 'Tip: ' : 'Astuce : '), t(en ? 'name tokens by intent, not by value.' : "nomme les tokens par intention, pas par valeur. "), c('--color-danger'), t(en ? ' beats ' : ' plutôt que '), c('--red-500'), t('.')),
    h2(en ? 'Components that earn their place' : 'Des composants qui méritent leur place'),
    p(t(lorem[0])),
    img(cover('#0f172a', '#334155', en ? 'Component map' : 'Carte des composants'), en ? 'Map of the components, grouped by usage frequency' : "Carte des composants, regroupés par fréquence d'usage"),
    // Layout tags in the caption (scripts/blog/render.mjs: imageLayout)
    img(cover('#3b0764', '#7c3aed', 'Tokens'), en ? '[medium right] Tokens, from primitives to semantic names' : '[moyenne droite] Les tokens, des primitives aux noms sémantiques'),
    p(t(lorem[1])), p(t(lorem[2])),
    img(cover('#064e3b', '#10b981', 'Figma'), en ? '[35% left] [no caption] Figma variables panel' : '[35% gauche] [sans légende] Panneau des variables Figma'),
    p(t(lorem[0])), p(t(lorem[1])),
    img(cover('#7c2d12', '#f97316', 'Grid'), en ? '[large] Centred image, 75% of the column' : '[grande] Image centrée, 75 % de la colonne'),
    ol(en ? 'Audit the existing screens' : "Faire l'inventaire des écrans existants"),
    ol(en ? 'Group what looks alike' : 'Regrouper ce qui se ressemble'),
    ol(en ? 'Build only what appears three times' : "Ne construire que ce qui apparaît trois fois"),
    quote(en ? 'A design system is a product whose users are your future self.' : "Un design system, c'est un produit dont l'utilisateur est toi dans six mois."),
    h3(en ? 'Comparison' : 'Comparatif'),
    table([
      [en ? 'Tool' : 'Outil', en ? 'Strength' : 'Point fort', en ? 'Limit' : 'Limite'],
      ['Figma', en ? 'Variables, modes' : 'Variables, modes', en ? 'No logic' : 'Pas de logique'],
      ['Storybook', en ? 'Living docs' : 'Doc vivante', en ? 'Setup cost' : "Coût d'installation"],
      ['Notion', en ? 'Fast to write' : 'Rapide à écrire', en ? 'Drifts from code' : 'Se désynchronise du code'],
    ]),
    columns(
      [h3(en ? 'Keep' : 'Je garde'), li('Tokens'), li('Boutons, champs'), li('Grille')],
      [h3(en ? 'Drop' : 'Je jette'), li(en ? 'Illustrations' : 'Illustrations'), li(en ? '12 button variants' : '12 variantes de bouton')],
    ),
    columns(
      Object.assign([img(cover('#1e3a8a', '#3b82f6', '1/3'), en ? 'Column at 1/3 (width_ratio)' : 'Colonne à 1/3 (width_ratio)')], { ratio: 1 / 3 }),
      Object.assign([p(t(lorem[2]))], { ratio: 2 / 3 }),
    ),
    hr(),
    h2('Checklist'),
    todo(en ? 'Tokens exported to code' : 'Tokens exportés vers le code', true),
    todo(en ? 'Components documented' : 'Composants documentés', true),
    todo(en ? 'Dark mode tested' : 'Mode sombre testé', false),
    toggle(en ? 'Why not a UI kit?' : 'Pourquoi pas un UI kit tout fait ?', [p(t(lorem[1]))]),
    bookmark('https://www.figma.com/blog/'),
    p(i(en ? 'Thanks for reading.' : "Merci d'avoir lu jusqu'ici.")),
  ]
}
const medium = () => [
  p(t(lorem[1])),
  h1('Le contexte'),
  p(t(lorem[0])),
  p(t(lorem[2])),
  h1('Ce que je ferais différemment'),
  li('Écrire le brief avant la première ligne'),
  li('Montrer une version moche au jour 2'),
  li('Mesurer une seule chose'),
  callout('⚠️', t('Le piège : '), t("confondre vitesse d'exécution et vitesse d'apprentissage.")),
  p(t(lorem[1])),
  code('javascript', "// Make -> webhook -> GitHub\nawait fetch(url, {\n  method: 'POST',\n  body: JSON.stringify({ ref: 'main' }),\n})"),
  p(t(lorem[2])),
]
const short = () => [p(t(lorem[0])), p(t(lorem[1])), p(t(lorem[2]))]

const blocks = {
  'fr-design-system': full('fr'),
  'en-design-system': full('en'),
  'fr-nocode-limites': medium(),
  'en-nocode-limits': [p(t('The English version of the no-code article.')), h1('Three signals'), li('Costs grow faster than usage'), li('Workarounds pile up'), li('You need tests'), p(t('Shorter than the French one on purpose.'))],
  'fr-vibe-coding': medium(),
  'fr-figma-code': [...medium(), ...short()],
  'fr-checklist-lancement': [
    p(t("Ce que je vérifie, dans l'ordre, avant de mettre un site en ligne. Cet article n'a pas de description SEO : l'extrait automatique est utilisé dans les cartes et les métas.")),
    h1('Technique'), todo('HTTPS et redirections', true), todo('404 personnalisée', true), todo('Sitemap et robots.txt', false),
    h1('Contenu'), todo('Titres uniques par page', false), todo('Textes alternatifs des images', false),
  ],
  'fr-court': short(),
  'en-only': short(),
  ...Object.fromEntries(EXTRA.map((p) => [p.id, short()])),
}

export function createMockClient() {
  return {
    async queryPublished() { return pages },
    async getBlocksDeep(id) { return blocks[id] || [] },
  }
}
