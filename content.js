/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENT.JS — Hamza Khadri Portfolio
 *  Edit everything here. No component code to touch.
 * ─────────────────────────────────────────────────────────────
 *
 *  HOW TO ADD IMAGES
 *  ─────────────────
 *  1. Drop your image files into the `assets/projects/` folder.
 *  2. Set the `heroImage` and `detailImage` fields in each project below.
 *     Example:
 *       heroImage:   'assets/projects/partenamut-hero.png',   // 16:10 ratio
 *       detailImage: 'assets/projects/partenamut-detail.png', // optional
 *  3. Leave the field as '' (empty string) to keep the striped placeholder.
 *
 *  YOUR PROFILE PHOTO
 *  ──────────────────
 *  Current file: assets/hamza-photo.png
 *  To replace: drop a new file in assets/ and update the src in
 *  components/hero.jsx → <img src="assets/your-new-photo.png" />
 *
 *  LOGO
 *  ────
 *  SVG logo is inlined in components/nav.jsx.
 *  To replace: swap the <path> elements in the <svg> block.
 * ─────────────────────────────────────────────────────────────
 */

window.CONTENT = {

  /* ══════════════════════════════════════════════════════════
   *  PROJECTS
   * ══════════════════════════════════════════════════════════ */
  projects: [
    {
      num: '01',
      name: 'Partenamut Prevention',
      category: 'Health Tech / Mutual Insurance',
      stack: ['Lovable','Supabase','UX Research'],
      role:  { en: 'Lead Product Designer', fr: 'Designer Produit Lead' },
      year:  '2026',
      liveUrl: '',
      desc: {
        en: "Designed a preventive health app for one of Belgium's largest health insurance providers.",
        fr: "Conception d'une application de santé préventive pour l'une des plus grandes mutuelles belges.",
      },
      overview: {
        en: "Partenamut wanted to shift from reactive to preventive care. I led the UX and UI design of a companion app encouraging members to take proactive steps toward their health goals.",
        fr: "Partenamut souhaitait passer d'une approche curative à une approche préventive. J'ai dirigé la conception UX et UI d'une application accompagnant les membres vers leurs objectifs de santé.",
      },
      challenge: {
        en: "Health insurance apps are notoriously hard to engage with. The challenge was making prevention feel personal and motivating — not clinical and generic — for a diverse member base.",
        fr: "Les applications de mutuelles sont notoirement difficiles à engager. Le défi était de rendre la prévention personnelle et motivante — pas clinique et générique — pour une base de membres diverse.",
      },
      approach: {
        en: "I ran discovery interviews with 8 members and 3 internal stakeholders. From there I built a design system from scratch, ran multiple usability tests, and iterated rapidly on the core flows: onboarding, goal-setting, and weekly check-ins.",
        fr: "J'ai mené des interviews de découverte avec 8 membres et 3 parties prenantes internes. J'ai ensuite construit un design system from scratch, effectué plusieurs tests d'utilisabilité et itéré rapidement sur les flux clés : onboarding, définition d'objectifs et check-ins hebdomadaires.",
      },
      results: {
        en: "Delivered a full prototype and design system. Handed off to dev with 0 open design questions. Internal NPS of the concept: 8.2/10 in internal testing.",
        fr: "Livraison d'un prototype complet et d'un design system. Handoff aux développeurs sans question de design ouverte. NPS interne du concept : 8,2/10 en test interne.",
      },
      heroImage:   'assets/projects/partena-detail.png',
      detailImage: '',
    },
    {
      num: '02',
      name: 'Greasily.be',
      category: 'Local Service Platform',
      stack: ['Figma', 'No-code'],
      role:  { en: 'Designer & Builder', fr: 'Designer & Builder' },
      year:  '2025',
      liveUrl: 'https://greasily.be',
      desc: {
        en: 'Designed and built a complete platform for a Belgian service business.',
        fr: "Conception et développement d'une plateforme complète pour une entreprise de service belge.",
      },
      overview: {
        en: "Full design-to-build project for a local Belgian service business. I handled everything from brand identity and UX to the final no-code build.",
        fr: "Projet complet de la conception au build pour une entreprise de service belge locale. J'ai tout géré : identité de marque, UX, jusqu'au build no-code final.",
      },
      challenge: {
        en: "A small local business with no digital presence needed a professional platform fast, with a tight budget and no technical team.",
        fr: "Une petite entreprise locale sans présence digitale avait besoin d'une plateforme professionnelle rapidement, avec un budget serré et aucune équipe technique.",
      },
      approach: {
        en: "I compressed the usual design-dev cycle by designing and building in parallel using no-code tools. The client got a live product in 3 weeks instead of 3 months.",
        fr: "J'ai compressé le cycle design-dev habituel en concevant et en construisant en parallèle avec des outils no-code. Le client a obtenu un produit live en 3 semaines au lieu de 3 mois.",
      },
      results: {
        en: "Live platform shipped in 3 weeks. Client onboarded their first digital bookings within days of launch.",
        fr: "Plateforme live livrée en 3 semaines. Le client a enregistré ses premières réservations digitales quelques jours après le lancement.",
      },
      heroImage:   '/assets/projects/greasily-detail.png',
      detailImage: '',
    },
    {
      num: '03',
      name: 'LAM-MotionLabs (ULiège)',
      category: 'Academic Research Tool',
      stack: ['Bubble', 'Supabase'],
      role:  { en: 'Full-stack Builder', fr: 'Builder Full-stack' },
      year:  '2026',
      liveUrl: '',
      desc: {
        en: 'Built a research tool for the University of Liège motion analysis lab.',
        fr: "Développement d'un outil de recherche pour le laboratoire d'analyse du mouvement de l'ULiège.",
      },
      overview: {
        en: "The motion analysis lab at ULiège needed a custom tool to collect, store, and visualise movement data from their research subjects — without a dev budget.",
        fr: "Le laboratoire d'analyse du mouvement de l'ULiège avait besoin d'un outil sur-mesure pour collecter, stocker et visualiser les données de mouvement de leurs sujets de recherche — sans budget de développement.",
      },
      challenge: {
        en: "Academic tools are typically built by developers who don't understand researchers' workflows. The researchers needed something they could actually use during sessions, not after.",
        fr: "Les outils académiques sont typiquement construits par des développeurs qui ne comprennent pas les workflows des chercheurs. Ces derniers avaient besoin de quelque chose qu'ils pouvaient utiliser pendant les sessions, pas après.",
      },
      approach: {
        en: "I embedded myself in a lab session to understand the real workflow, then built a Bubble + Supabase app that fit into their process naturally. Real-time data entry, instant visualisation, exportable reports.",
        fr: "Je me suis immergé dans une session de laboratoire pour comprendre le vrai workflow, puis j'ai construit une app Bubble + Supabase qui s'intègre naturellement dans leur processus. Saisie de données en temps réel, visualisation instantanée, rapports exportables.",
      },
      results: {
        en: "Tool adopted by the full lab team. Replaced a spreadsheet-based workflow that had been in use for 6+ years.",
        fr: "Outil adopté par toute l'équipe du labo. Remplacement d'un workflow basé sur des tableurs utilisé depuis plus de 6 ans.",
      },
      heroImage:   '/assets/projects/lam-motionlabs-detail.png',
      detailImage: '',
    },
    {
      num: '04',
      name: 'Réseau Entreprendre Bruxelles',
      category: 'Non-profit Network',
      stack: ['Figma', 'Webflow'],
      role:  { en: 'UX/UI Designer', fr: 'Designer UX/UI' },
      year:  '2025',
      liveUrl: '',
      desc: {
        en: "Redesigned the digital experience for Brussels' leading entrepreneur network.",
        fr: "Refonte de l'expérience digitale du principal réseau d'entrepreneurs bruxellois.",
      },
      overview: {
        en: "Réseau Entreprendre Bruxelles connects aspiring entrepreneurs with mentors and funding. Their existing site was outdated and failing to convert visitors into applicants.",
        fr: "Réseau Entreprendre Bruxelles connecte les entrepreneurs en devenir avec des mentors et des financements. Leur site existant était obsolète et ne parvenait pas à convertir les visiteurs en candidats.",
      },
      challenge: {
        en: "The organisation had a strong offline reputation but a weak digital presence. The site was losing potential applicants who couldn't quickly understand the value proposition.",
        fr: "L'organisation avait une solide réputation offline mais une présence digitale faible. Le site perdait des candidats potentiels qui ne comprenaient pas rapidement la proposition de valeur.",
      },
      approach: {
        en: "Full UX audit, competitive analysis, and redesign focused on clarity and conversion. Rebuilt in Webflow with a clear hierarchy: what it is → who it's for → how to apply.",
        fr: "Audit UX complet, analyse concurrentielle et refonte axée sur la clarté et la conversion. Reconstruction dans Webflow avec une hiérarchie claire : c'est quoi → pour qui → comment candidater.",
      },
      results: { en: '', fr: '' },
      heroImage:   '/assets/projects/reb-detail.png',
      detailImage: '',
    },
    {
      num: '05',
      name: 'AI For Brokers',
      category: 'AI for Insurance',
      stack: ['Lovable', 'Supabase', 'OpenAI', 'i18n'],
      role:  { en: 'Product Designer & Builder', fr: 'Designer Produit & Builder' },
      year:  '2026',
      liveUrl: '',
      desc: {
        en: 'A mobile webapp for insurance brokers, powered by OpenAI Assistants. Migrated from Bubble to Lovable.',
        fr: "Une webapp mobile pour courtiers en assurance, propulsée par OpenAI Assistants. Migré de Bubble vers Lovable.",
      },
      overview: {
        en: "Insurance brokers spend hours answering repetitive client questions. This mobile webapp puts an AI assistant in their pocket — trained on product knowledge, multilingual, and always available.",
        fr: "Les courtiers en assurance passent des heures à répondre à des questions répétitives. Cette webapp mobile met un assistant IA dans leur poche — formé sur la connaissance produit, multilingue et toujours disponible.",
      },
      challenge: {
        en: "The insurance sector is highly regulated and terminology-heavy. The AI had to be accurate, scoped, and trusted by professionals who are legally responsible for their advice.",
        fr: "Le secteur de l'assurance est très réglementé et terminologique. L'IA devait être précise, délimitée et fiable pour des professionnels légalement responsables de leurs conseils.",
      },
      approach: {
        en: "Built v1 in Bubble, then migrated to Lovable when we hit scale limitations. OpenAI Assistants with custom system prompts per product line. Full i18n in FR/EN/NL. Designed for low-distraction, quick-answer UX.",
        fr: "Construit en v1 sur Bubble, puis migré vers Lovable face aux limitations de scalabilité. OpenAI Assistants avec des system prompts personnalisés par ligne de produit. i18n complète en FR/EN/NL. Design orienté UX rapide et sans distraction.",
      },
      results: { en: '', fr: '' },
      heroImage:   '/assets/projects/ai4b-detail.png',
      detailImage: '',
    },
  ],

  /* ══════════════════════════════════════════════════════════
   *  TESTIMONIALS
   * ══════════════════════════════════════════════════════════ */
  testimonials: [
    {
      quote: {
        en: '"Replace this with a real testimonial from a recruiter or collaborator. Specific and genuine."',
        fr: '"Remplacez ceci par un vrai témoignage d\'un recruteur ou collaborateur. Précis et authentique."',
      },
      name: 'First Last',
      role: 'Role — Company',
    },
    {
      quote: {
        en: '"Replace this with a second real testimonial. Keep it grounded and honest."',
        fr: '"Remplacez ceci par un second témoignage. Gardez-le ancré dans les faits."',
      },
      name: 'First Last',
      role: 'Role — Company',
    },
  ],

  /* ══════════════════════════════════════════════════════════
   *  STACK MARQUEE
   * ══════════════════════════════════════════════════════════ */
  marqueeItems: [
    'Figma', 'Bubble', 'Lovable', 'Supabase', 'OpenAI',
    'Airtable', 'Notion', 'Framer', 'Webflow', 'Maze', 'Claude',
  ],

  /* ══════════════════════════════════════════════════════════
   *  STACK CATEGORIES
   * ══════════════════════════════════════════════════════════ */
  stackCategories: [
    {
      label: 'Design & UX',
      items: ['Figma', 'Adobe Suite', 'Claude Design'],
    },
    {
      label: 'No-Code & Vibe-Code',
      items: ['Lovable', 'Bubble.io', 'Webflow', 'Notion', 'Airtable', 'Framer'],
    },
    {
      label: 'Backend & Data',
      items: ['Supabase', 'Maze', 'Notion', 'Airtable'],
    },
    {
      label: 'IA & Intégrations',
      items: ['OpenAI API', 'Claude', 'Make', 'N8N'],
    },
  ],

  /* ══════════════════════════════════════════════════════════
   *  SERVICES
   * ══════════════════════════════════════════════════════════ */
  services: [
    {
      num: '01',
      title: { en: 'Product Design',    fr: 'Product Design' },
      body:  {
        en: "UX/UI, design systems, prototyping. End-to-end design that's built to ship.",
        fr: "UX/UI, design systems, prototypage. Du design de bout en bout conçu pour être livré.",
      },
      price: { en: 'From — €/day', fr: 'À partir de — €/jour' },
    },
    {
      num: '02',
      title: { en: 'No-code Build',    fr: 'Build No-code' },
      body:  {
        en: 'Full app development with Bubble, Lovable, Supabase. Project-based pricing.',
        fr: 'Développement complet avec Bubble, Lovable, Supabase. Tarification au projet.',
      },
      price: { en: 'Project-based', fr: 'Au projet' },
    },
    {
      num: '03',
      title: { en: 'AI Integration',  fr: 'Intégration IA' },
      body:  {
        en: "OpenAI Assistants, automation, AI-first products. I scope it, build it, ship it.",
        fr: "OpenAI Assistants, automatisation, produits IA-first. Je scope, je build, je livre.",
      },
      price: { en: 'Custom scope', fr: 'Devis sur mesure' },
    },
  ],

  /* ══════════════════════════════════════════════════════════
   *  SOCIAL LINKS — replace '#' with real URLs
   * ══════════════════════════════════════════════════════════ */
  socials: [
    { label: 'LinkedIn',  href: '#',                                        icon: 'lni-linkedin-original' },
    { label: 'GitHub',    href: 'https://github.com/hamza-k',               icon: 'lni-github-original'   },
    { label: 'Dribbble',  href: 'https://dribbble.com/hamza-k',             icon: 'lni-dribbble'          },
    { label: 'Uxcel',     href: 'https://app.uxcel.com/ux/FGXWC3Z7OP22',    icon: 'lni-link'              },
  ],
};
