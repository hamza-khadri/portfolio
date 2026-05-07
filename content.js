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
      stack: ['Lovable', 'Supabase', 'UX Research', 'User Test Monitoring'],
      role: { en: 'Lead Product Designer & Builder', fr: 'Designer Produit Lead & Builder' },
      year: '2026',
      liveUrl: '',
      desc: {
        en: "Designed and built a preventive health space for one of Belgium's largest health insurers.",
        fr: "Conception et production d'un espace de santé préventive de premier degré pour l'une des plus grandes mutuelles belges.",
      },
      overview: {
        en: "Partenamut wanted to move beyond reimbursements and become a real health companion for their members. I led the UX design and product build of a preventive health space — from strategic framing to moderated user testing.",
        fr: "Partenamut souhaitait dépasser le rôle de rembourseur pour devenir un véritable accompagnateur santé. J'ai piloté la conception UX et la production de l'espace prévention — du cadrage stratégique jusqu'aux tests utilisateurs modérés.",
      },
      challenge: {
        en: "The core challenge was making prevention feel personal and actionable — not like a content catalogue. Members needed to feel guided, not just informed.",
        fr: "Le défi central était de rendre la prévention personnelle et actionnable — pas comme un catalogue de contenus. Les membres devaient se sentir guidés, pas seulement informés.",
      },
      approach: {
        en: "I ran 17 moderated user testing sessions across 4 user profiles, using Maze for scenario-based flows. Tests covered 5 key journeys built around the app's core architecture: onboarding and goal selection, the Explorer (search by health state and life situation), the Goals and tools section, the Partenum AI chatbot, and women's health prevention. Results were synthesized into 4 UX insights and 5 product opportunities.",
        fr: "J'ai mené 17 sessions de tests utilisateurs modérés sur 4 profils distincts, avec des scénarios Maze sur 5 parcours clés articulés autour de l'architecture de l'app : onboarding et sélection d'objectif, l'Explorer (recherche par état de santé et situation de vie), la section Objectifs et outils, le chatbot IA Partenum, et la prévention féminine. Les résultats ont été synthétisés en 4 insights UX et 5 opportunités produit.",
      },
      results: {
        en: "Delivered a full UX research report and prototype. The product was validated as credible (17/17 completed onboarding) but revealed a clear gap between information and action — directly informing Partenamut's next product direction. The project has since been taken over internally by Partenamut.",
        fr: "Livraison d'un rapport UX complet et d'un prototype. Le produit a été validé comme crédible (17/17 ont complété l'onboarding) mais a révélé un écart clair entre information et passage à l'action — orientant directement la prochaine direction produit de Partenamut. Le projet a ensuite été repris en interne.",
      },
      heroImage:   'assets/projects/partena-detail.png',
      detailImage: '',
    },
    {
      num: '02',
      name: 'Greasily.be',
      category: 'Restaurant Tech / Web as a Service',
      stack: ['Lovable', 'Supabase'],
      role: { en: 'Information Architect & Builder', fr: 'Architecte d\'information & Builder' },
      year: '2025',
      liveUrl: 'https://greasily.be',
      desc: {
        en: 'Co-built a white-label web platform allowing Belgian restaurateurs to get a professional site in minutes.',
        fr: "Co-conception d'une plateforme web clé-en-main permettant aux restaurateurs belges d'avoir un site pro en quelques minutes.",
      },
      overview: {
        en: "Greasily is a The Maul product built for restaurateurs who need a web presence but have no time, budget, or technical skills to manage one. The platform generates a ready-to-use site from content provided by the restaurant owner, who then manages only what matters: opening hours, menu, and reservations.",
        fr: "Greasily est un produit The Maul pensé pour les restaurateurs qui ont besoin d'une présence web mais n'ont ni le temps, ni le budget, ni les compétences pour la gérer. La plateforme génère un site prêt à l'emploi à partir des contenus fournis par le restaurateur, qui ne gère ensuite que l'essentiel : horaires, carte et réservations.",
      },
      challenge: {
        en: "Restaurateurs don't need a website builder — they need a website. The challenge was designing a system simple enough to generate a professional result in minutes, while giving owners just enough control without overwhelming them.",
        fr: "Les restaurateurs n'ont pas besoin d'un outil pour créer un site — ils ont besoin d'un site. Le défi était de concevoir un système suffisamment simple pour générer un résultat professionnel en quelques minutes, tout en donnant aux propriétaires juste assez de contrôle sans les noyer.",
      },
      approach: {
        en: "I worked as one of the information architects on the project — structuring the data model and the overall UX logic — then took on the build in Lovable and became the go-to person for maintenance and ongoing iterations.",
        fr: "J'ai été l'un des architectes d'information du projet — structurant le modèle de données et la logique UX globale — avant de prendre en charge le build sur Lovable et de devenir la personne de référence pour la maintenance et les itérations.",
      },
      results: {
        en: "Live product serving Belgian restaurateurs. Ongoing maintenance and iteration handled internally at The Maul.",
        fr: "Produit live au service des restaurateurs belges. Maintenance et itérations gérées en interne chez The Maul.",
      },
      heroImage:   '/assets/projects/greasily-detail.png',
      detailImage: '',
    },
    {
      num: '03',
      name: 'LAM-MotionLabs',
      category: 'Sports Science / Research Tool',
      stack: ['Lovable', 'Supabase'],
      role: { en: 'Data Architect & Builder', fr: 'Architecte de données & Builder' },
      year: '2026',
      liveUrl: '',
      desc: {
        en: 'Designed and built a biomechanical data management platform for the sports performance research center at ULiège.',
        fr: "Conception et production d'une plateforme de gestion de données biomécaniques pour le centre de recherche en performance sportive de l'ULiège.",
      },
      overview: {
        en: "LAM-MotionLabs is a research platform built for the CAPS (Centre d'Aide à la Performance Sportive) at the University of Liège. The center previously relied on Excel files to collect and communicate biomechanical data — a system that quickly became unmanageable. The platform replaces that with a structured environment for formula creation, data entry, and report generation.",
        fr: "LAM-MotionLabs est une plateforme de recherche conçue pour le CAPS (Centre d'Aide à la Performance Sportive) de l'Université de Liège. Le centre s'appuyait jusqu'alors sur des fichiers Excel pour collecter et communiquer des données biomécaniques — un système rapidement ingérable. La plateforme remplace ça par un environnement structuré pour la création de formules, l'encodage de données et la génération de rapports.",
      },
      challenge: {
        en: "Biomechanical research data (forces, movement metrics) is complex and multi-layered. The challenge was designing a data model flexible enough to handle custom formulas with dynamic inputs and outputs, while serving three distinct user types with very different needs.",
        fr: "Les données de recherche biomécaniques (forces, métriques de mouvement) sont complexes et multi-niveaux. Le défi était de concevoir un modèle de données assez flexible pour gérer des formules personnalisées avec des inputs et outputs dynamiques, tout en servant trois types d'utilisateurs aux besoins très différents.",
      },
      approach: {
        en: "I designed the full data architecture and processing logic before building the platform in Lovable. The system supports three user levels: internal researchers who configure formulas and encode data, athletes who consult their own results, and staff members (coaches, etc.) who access results for their assigned athletes.",
        fr: "J'ai conçu l'architecture de données complète et la logique de traitement avant de builder la plateforme sur Lovable. Le système supporte trois niveaux d'utilisateurs : les chercheurs internes qui configurent les formules et encodent les données, les sportifs qui consultent leurs propres résultats, et les membres du staff (coaches, etc.) qui accèdent aux résultats de leurs sportifs assignés.",
      },
      results: {
        en: "Delivered a fully functional platform replacing a fragmented Excel-based workflow. Data and outcomes remain confidential to the CAPS.",
        fr: "Livraison d'une plateforme fonctionnelle remplaçant un workflow fragmenté basé sur Excel. Les données et résultats restent confidentiels au CAPS.",
      },
      heroImage:   '/assets/projects/lam-motionlabs-detail.png',
      detailImage: '',
    },
    {
      num: '04',
      name: 'Réseau Entreprendre Bruxelles',
      category: 'Community Platform',
      stack: ['Bubble.io', 'Notion', 'APIs'],
      role: { en: 'Lead Builder', fr: 'Builder Principal' },
      year: '2025',
      liveUrl: 'https://reseauentreprendrebruxelles.org/',
      desc: {
        en: 'Built a community platform for one of the leading entrepreneurship networks in Brussels.',
        fr: "Production d'une plateforme communautaire pour l'un des principaux réseaux d'entrepreneuriat bruxellois.",
      },
      overview: {
        en: "Réseau Entreprendre Bruxelles needed a private digital space for their member community. I built a mobile-accessible platform centralizing member profiles, company pages, event registrations, perks, and shared documents — all synced with their existing Notion workspace via API.",
        fr: "Réseau Entreprendre Bruxelles avait besoin d'un espace digital privé pour leur communauté de membres. J'ai produit une plateforme accessible sur mobile centralisant les profils membres, pages entreprises, inscriptions aux événements, perks et documents partagés — le tout synchronisé avec leur espace Notion existant via API.",
      },
      challenge: {
        en: "The platform had to feel like a professional community tool while staying tightly connected to an existing Notion-based back-office. Keeping data consistent across both systems without a dedicated technical team was the core constraint.",
        fr: "La plateforme devait avoir la qualité d'un outil communautaire professionnel tout en restant connectée à un back-office Notion existant. Maintenir la cohérence des données entre les deux systèmes sans équipe technique dédiée était la contrainte centrale.",
      },
      approach: {
        en: "I built the full platform in Bubble.io, integrating Notion APIs and automations to keep member and event data in sync. After the initial launch, I handled ongoing maintenance and iterative improvements over the course of a year, occasionally contributing UX suggestions alongside the build.",
        fr: "J'ai construit la plateforme complète sur Bubble.io, en intégrant les APIs Notion et des automations pour maintenir la synchronisation des données membres et événements. Après le lancement initial, j'ai assuré la maintenance et les itérations sur une durée d'un an, en apportant ponctuellement des suggestions UX.",
      },
      results: {
        en: "Platform shipped and available on App Store and Play Store. 218 members onboarded out of 768 active members. Data remains confidential to REB.",
        fr: "Plateforme livrée et disponible sur l'App Store et le Play Store. 218 membres inscrits sur 768 membres actifs. Données confidentielles à REB.",
      },
      results: { en: '', fr: '' },
      heroImage:   '/assets/projects/reb-detail.png',
      detailImage: '',
    },
    {
      num: '05',
      name: 'AI For Brokers',
      category: 'InsurTech / AI Tooling',
      stack: ['Lovable', 'Supabase', 'OpenAI'],
      role: { en: 'Lead Builder', fr: 'Builder Principal' },
      year: '2026',
      liveUrl: '',
      desc: {
        en: 'Migrated and rebuilt an AI-powered insurance broker platform from mobile to desktop.',
        fr: "Migration et refonte d'une plateforme IA pour courtiers en assurance, du mobile vers le desktop.",
      },
      overview: {
        en: "AI For Brokers is an internal web platform giving insurance brokers access to three AI-powered tools: contract analysis, coverage optimization, and partner evaluation. The app originally existed as a mobile build in Bubble and needed to be migrated and redesigned for desktop use.",
        fr: "AI For Brokers est une plateforme web interne donnant aux courtiers en assurance accès à trois outils IA : analyse de contrat, optimisation de couverture et évaluation de partenaires. L'app existait initialement en version mobile sur Bubble et devait être migrée et repensée pour un usage desktop.",
      },
      challenge: {
        en: "Migrating from Bubble to Lovable while simultaneously adapting a mobile-first interface into a desktop experience — without losing the existing logic and AI integrations.",
        fr: "Migrer de Bubble vers Lovable tout en adaptant simultanément une interface pensée mobile en une expérience desktop — sans perdre la logique existante et les intégrations IA.",
      },
      approach: {
        en: "I handled the full migration from Bubble to Lovable, rebuilding the platform for desktop and integrating the three AI tools via OpenAI Assistants API, with Supabase as the data layer.",
        fr: "J'ai pris en charge la migration complète de Bubble vers Lovable, en reconstruisant la plateforme pour desktop et en intégrant les trois outils IA via l'API OpenAI Assistants, avec Supabase comme couche de données.",
      },
      results: {
        en: "Full migration completed. Platform operational in French for internal broker use.",
        fr: "Migration complète effectuée. Plateforme opérationnelle en français pour un usage interne par les courtiers.",
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
    'Make', 'N8N', 'Jitter', 'Spline', 'Wordpress'
  ],

  /* ══════════════════════════════════════════════════════════
   *  STACK CATEGORIES
   * ══════════════════════════════════════════════════════════ */
  stackCategories: [
    {
      label: 'Design & UX',
      items: ['Figma', 'Adobe Suite', 'Maze', 'Jitter', 'Spline'],
    },
    {
      label: 'No-Code & Vibe-Code',
      items: ['Lovable', 'Bubble.io', 'Webflow', 'Framer', 'Notion', 'Airtable'],
    },
    {
      label: 'Backend & Data',
      items: ['Supabase', 'Notion', 'Airtable'],
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
      title: { en: 'Product Design', fr: 'Product Design' },
      body: {
        en: "UX/UI, design systems, prototyping. End-to-end design that's built to ship.",
        fr: "UX/UI, design systems, prototypage. Du design de bout en bout conçu pour être livré.",
      },
      price: { en: '', fr: '' },
    },
    {
      num: '02',
      title: { en: 'No-Code & Vibe-Code', fr: 'No-Code & Vibe-Code' },
      body: {
        en: 'Full product build with Bubble, Lovable, Supabase. From architecture to launch.',
        fr: "Build produit complet avec Bubble, Lovable, Supabase. De l'architecture au lancement.",
      },
      price: { en: '', fr: '' },
    },
    {
      num: '03',
      title: { en: 'AI Integration', fr: 'Intégration IA' },
      body: {
        en: "OpenAI Assistants, automation, AI-first products. I scope it, build it, ship it.",
        fr: "OpenAI Assistants, automatisation, produits IA-first. Je scope, je build, je livre.",
      },
      price: { en: '', fr: '' },
    },
  ],

  /* ══════════════════════════════════════════════════════════
   *  SOCIAL LINKS — replace '#' with real URLs
   * ══════════════════════════════════════════════════════════ */
  socials: [
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/hamzakhadri',  icon: 'lni-linkedin-original' },
    { label: 'GitHub',    href: 'https://github.com/hamza-k',               icon: 'lni-github-original'   },
    { label: 'Dribbble',  href: 'https://dribbble.com/hamza-k',             icon: 'lni-dribbble'          },
    { label: 'Uxcel',     href: 'https://app.uxcel.com/ux/FGXWC3Z7OP22',    icon: 'lni-link'              },
  ],
};
