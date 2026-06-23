const CONTENT = {

  projects: [
    {
      name: 'Partenamut Prevention',
      category: 'Health Tech / Mutual Insurance',
      stack: ['Lovable', 'Supabase', 'UX Research', 'User Test Monitoring', 'AI Integrations'],
      productOwner: true,
      role: { en: 'Product Owner, Lead Designer & Builder', fr: 'Product Owner, Designer Lead & Builder' },
      year: '2026',
      liveUrl: 'https://prevention-mvp.partenamut.be',
      desc: {
        en: "Owned, designed and built a preventive health space for one of Belgium's largest health insurers.",
        fr: "Pilotage produit, conception et production d'un espace de santé préventive de premier degré pour l'une des plus grandes mutuelles belges.",
      },
      overview: {
        en: "Partenamut wanted to move beyond reimbursements and become a real health companion for their members. As Product Owner, I led the discovery, scoped the product, prioritised the roadmap, designed the UX and built the prototype — from strategic framing to moderated user testing.",
        fr: "Partenamut souhaitait dépasser le rôle de rembourseur pour devenir un véritable accompagnateur santé. En tant que Product Owner, j'ai piloté la discovery, cadré le produit, priorisé la roadmap, conçu l'UX et builté le prototype — du cadrage stratégique jusqu'aux tests utilisateurs modérés.",
      },
      challenge: {
        en: "The core challenge was making prevention feel personal and actionable — not like a content catalogue. Members needed to feel guided, not just informed.",
        fr: "Le défi central était de rendre la prévention personnelle et actionnable — pas comme un catalogue de contenus. Les membres devaient se sentir guidés, pas seulement informés.",
      },
      approach: {
        en: "I scoped 5 key journeys and ran 17 moderated user testing sessions across 4 user profiles using Maze for scenario-based flows. Results were synthesized into 4 UX insights and 5 prioritised product opportunities.",
        fr: "J'ai cadré 5 parcours clés et mené 17 sessions de tests utilisateurs modérés sur 4 profils distincts avec des scénarios Maze. Les résultats ont été synthétisés en 4 insights UX et 5 opportunités produit priorisées.",
      },
      results: {
        en: "Delivered a full UX research report, a prioritised product roadmap and a working prototype. 17/17 participants completed onboarding, validating product credibility. The project has since been taken over internally by Partenamut.",
        fr: "Livraison d'un rapport UX complet, d'une roadmap produit priorisée et d'un prototype fonctionnel. 17/17 participants ont complété l'onboarding, validant la crédibilité du produit. Le projet a ensuite été repris en interne par Partenamut.",
      },
      heroImage:   'assets/projects/partena-detail.png',
      detailImage: '',
    },
    {
      name: 'Veleo',
      category: 'FamilyTech / Silver Economy',
      stack: ['Lovable', 'Supabase', 'Claude ecosystem', 'User searching', 'AI Integrations'],
      productOwner: true,
      role: { en: 'Founder, Product Owner, Designer & Builder', fr: 'Fondateur, Product Owner, Designer & Builder' },
      year: '2026',
      liveUrl: 'https://veleo.be',
      desc: {
        en: 'Owning, designing and building a shared family dashboard to coordinate elderly parent care in Belgium.',
        fr: "Pilotage produit, conception et production d'un tableau de bord familial partagé pour coordonner le suivi des parents âgés en Belgique.",
      },
      overview: {
        en: "Veleo is a Belgian startup I'm founding and running as solo Product Owner. It's a shared family dashboard that helps families coordinate the care of an elderly parent — centralizing information, tasks, appointments, and communication in one place, with native FR/NL bilingual support and Belgian administrative localization (AVIQ, Iriscare, mutualities).",
        fr: "Veleo est une startup belge que je fonde et que je pilote en solo Product Owner. C'est un tableau de bord familial partagé qui aide les familles à coordonner le suivi d'un parent âgé — centralisant informations, tâches, rendez-vous et communication en un seul endroit, avec un support bilingue FR/NL natif et une localisation administrative belge (AVIQ, Iriscare, mutuelles).",
      },
      challenge: {
        en: "Caring for an elderly parent in Belgium involves fragmented information, multiple family members with different levels of involvement, and a complex administrative landscape that varies by region. No existing tool addresses all three at once.",
        fr: "S'occuper d'un parent âgé en Belgique implique des informations fragmentées, plusieurs membres de la famille avec des niveaux d'implication différents, et un paysage administratif complexe qui varie selon la région. Aucun outil existant n'adresse les trois à la fois.",
      },
      approach: {
        en: "I own the full product lifecycle — discovery, strategic positioning, roadmap prioritisation, UX design, and no-code build. The Belgian administrative localization (AVIQ, Iriscare, mutualities) is the core product moat, prioritised in from day one.",
        fr: "Je pilote l'ensemble du cycle produit — discovery, positionnement stratégique, priorisation de la roadmap, conception UX et build no-code. La localisation administrative belge (AVIQ, Iriscare, mutuelles) est le différenciateur central du produit, priorisée dès le départ.",
      },
      results: {
        en: "Product currently in active discovery and development. User research and roadmap iteration ongoing.",
        fr: "Produit actuellement en discovery et développement actif. Recherche utilisateur et itération de roadmap en cours.",
      },
      heroImage:   'assets/projects/veleo-details.png',
      detailImage: '',
    },
    {
      name: 'Gravaubel',
      category: 'ConstructionTech / Sales Automation',
      stack: ['Lovable', 'Supabase', 'AI extraction', 'AI Integrations'],
      productOwner: true,
      role: { en: 'Product Owner & No-code Builder', fr: 'Product Owner & Builder no-code' },
      year: '2026',
      liveUrl: 'https://gravaubel-offer-craft.lovable.app/demo',
      desc: {
        en: 'Designing and building an AI-powered platform that automates commercial offer generation for a road works company.',
        fr: "Conception et production d'une plateforme propulsée par IA qui automatise la génération d'offres commerciales pour une entreprise de travaux routiers.",
      },
      overview: {
        en: "Gravaubel (Groupe Joly) is a Belgian road works company. I designed and built a platform that turns incoming client requests into structured commercial offers. An AI layer reads the request (often an email), extracts the relevant information, and pre-fills the offer form, while Excel bordereaux handle the pricing logic.",
        fr: "Gravaubel (Groupe Joly) est une entreprise belge de travaux routiers. J'ai conçu et construit une plateforme qui transforme les demandes clients entrantes en offres commerciales structurées. Une couche IA lit la demande (souvent un email), en extrait les informations pertinentes et pré-remplit le formulaire d'offre, tandis que des bordereaux Excel gèrent la logique de chiffrage.",
      },
      challenge: {
        en: "Producing commercial offers was slow and manual. Each request meant re-reading emails, copying details by hand into the offer, and rebuilding the pricing from scratch, which created delays and inconsistencies.",
        fr: "La production des offres commerciales était lente et manuelle. Chaque demande impliquait de relire les emails, de recopier les détails à la main dans l'offre et de reconstruire le chiffrage à partir de zéro, ce qui générait des délais et des incohérences.",
      },
      approach: {
        en: "I owned the design and the no-code build end to end. The key move was the email-to-form-field automation: an AI pipeline that parses an incoming request and maps it onto the offer structure, with a human validation step before anything is sent, keeping the salesperson in control.",
        fr: "J'ai piloté la conception et le build no-code de bout en bout. Le point clé était l'automatisation email-vers-champs-de-formulaire : un pipeline IA qui analyse une demande entrante et la mappe sur la structure de l'offre, avec une étape de validation humaine avant tout envoi, gardant le commercial aux commandes.",
      },
      results: {
        en: "Offer creation time significantly reduced, with a consistent, repeatable structure across requests. Platform delivered and in use.",
        fr: "Temps de création des offres fortement réduit, avec une structure cohérente et reproductible d'une demande à l'autre. Plateforme livrée et en usage.",
      },
      heroImage:   'assets/projects/gravaubel-details.png',
      detailImage: '',
    },
    {
      name: 'Greasily.be',
      category: 'Restaurant Tech / Web as a Service',
      stack: ['Lovable', 'Supabase'],
      productOwner: true,
      role: { en: 'Product Owner, Information Architect & Builder', fr: 'Product Owner, Architecte d\'information & Builder' },
      year: '2025',
      liveUrl: 'https://greasily.be',
      desc: {
        en: 'Co-owned and built a white-label web platform allowing Belgian restaurateurs to get a professional site in minutes.',
        fr: "Co-pilotage produit et build d'une plateforme web clé-en-main permettant aux restaurateurs belges d'avoir un site pro en quelques minutes.",
      },
      overview: {
        en: "Greasily is a The Maul product built for restaurateurs who need a web presence but have no time, budget, or technical skills to manage one. The platform generates a ready-to-use site from content provided by the restaurant owner, who then manages only what matters: opening hours, menu, and reservations.",
        fr: "Greasily est un produit The Maul pensé pour les restaurateurs qui ont besoin d'une présence web mais n'ont ni le temps, ni le budget, ni les compétences pour la gérer. La plateforme génère un site prêt à l'emploi à partir des contenus fournis par le restaurateur, qui ne gère ensuite que l'essentiel : horaires, carte et réservations.",
      },
      challenge: {
        en: "Restaurateurs don't need a website builder — they need a website. The challenge was scoping a system simple enough to generate a professional result in minutes, while giving owners just enough control without overwhelming them.",
        fr: "Les restaurateurs n'ont pas besoin d'un outil pour créer un site — ils ont besoin d'un site. Le défi était de cadrer un système suffisamment simple pour générer un résultat professionnel en quelques minutes, tout en donnant aux propriétaires juste assez de contrôle sans les noyer.",
      },
      approach: {
        en: "I co-owned the product alongside the team — structuring the data model, defining the UX logic, prioritising the feature scope — then took on the build in Lovable and became the go-to PO for maintenance and ongoing iterations.",
        fr: "J'ai co-piloté le produit avec l'équipe — structurant le modèle de données, définissant la logique UX, priorisant le scope fonctionnel — avant de prendre en charge le build sur Lovable et de devenir le PO de référence pour la maintenance et les itérations.",
      },
      results: {
        en: "Live product serving Belgian restaurateurs. Ongoing maintenance and iteration handled internally at The Maul.",
        fr: "Produit live au service des restaurateurs belges. Maintenance et itérations gérées en interne chez The Maul.",
      },
      heroImage:   '/assets/projects/greasily-detail.png',
      detailImage: '',
    },
    {
      name: 'LAM-MotionLabs',
      category: 'Sports Science / Research Tool',
      stack: ['Lovable', 'Supabase'],
      productOwner: false,
      role: { en: 'Data Architect & Builder', fr: 'Architecte de données & Builder' },
      year: '2026',
      liveUrl: 'https://uliege-caps.lovable.app/demo',
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
      name: 'Réseau Entreprendre Bruxelles',
      category: 'Community Platform',
      stack: ['Bubble.io', 'Notion', 'APIs'],
      productOwner: false,
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
      results: { en: '', fr: '' },
      heroImage:   '/assets/projects/reb-detail.png',
      detailImage: '',
    },
    {
      name: 'AI For Brokers',
      category: 'InsurTech / AI Tooling',
      stack: ['Lovable', 'Supabase', 'AI Integrations'],
      productOwner: false,
      role: { en: 'Lead Builder', fr: 'Builder Principal' },
      year: '2026',
      liveUrl: 'https://ai-for-brokers.themaul.be/',
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
      results: { en: '', fr: '' },
      heroImage:   '/assets/projects/ai4b-detail.png',
      detailImage: '',
    },
    {
      name: 'Velox',
      category: 'Logistics Tech / Transport Marketplace',
      stack: ['Lovable', 'Supabase', 'AI Integrations'],
      productOwner: false,
      role: { en: 'Data Architect & Builder', fr: 'Architecte de données & Builder' },
      year: '2025',
      liveUrl: 'https://myvelox.eu',
      desc: {
        en: 'Built a PWA marketplace connecting shippers and carriers for end-to-end freight management.',
        fr: "Production d'une PWA marketplace connectant expéditeurs et transporteurs pour une gestion de fret de bout en bout.",
      },
      overview: {
        en: "Velox is a Progressive Web App designed for both desktop and mobile, built for a Belgian logistics client. It connects shippers and carriers on a single platform: publish freight, access a verified carrier network, assign drivers, validate deliveries via QR code, and manage invoicing and payments — all in one place.",
        fr: "Velox est une Progressive Web App pensée pour desktop et mobile, produite pour un client belge dans la logistique. Elle connecte expéditeurs et transporteurs sur une seule plateforme : publier du fret, accéder à un réseau de transporteurs vérifiés, assigner des chauffeurs, valider les livraisons via QR code, et gérer la facturation et les paiements — en un seul endroit.",
      },
      challenge: {
        en: "Freight management involves multiple actors (shippers, carriers, drivers, admins) with very different needs and workflows. The challenge was designing a data model and UX logic that serves all four roles without fragmenting the experience.",
        fr: "La gestion de fret implique plusieurs acteurs (expéditeurs, transporteurs, chauffeurs, admins) avec des besoins et workflows très différents. Le défi était de concevoir un modèle de données et une logique UX qui serve les quatre rôles sans fragmenter l'expérience.",
      },
      approach: {
        en: "I designed the full data architecture to support a 6-step workflow — from freight publication and carrier booking, through driver assignment and QR-based delivery validation, to automatic invoice generation and payment closure. I then built the entire platform in Lovable with Supabase as the data layer.",
        fr: "J'ai conçu l'architecture de données complète pour supporter un workflow en 6 étapes — de la publication du fret et la réservation transporteur, jusqu'à l'assignation des chauffeurs, la validation de livraison par QR code, la génération automatique de factures et la clôture des paiements. J'ai ensuite builté l'intégralité de la plateforme sur Lovable avec Supabase comme couche de données.",
      },
      results: {
        en: "Full PWA delivered and live. Client is currently in prospecting phase to onboard their first customers.",
        fr: "PWA complète livrée et en ligne. Le client est actuellement en phase de prospection pour onboarder ses premiers clients.",
      },
      heroImage:   'assets/projects/myvelox-details.png',
      detailImage: '',
    },
  ],

  testimonials: [
    {
      quote: {
        en: '"Working with Hamza is a pleasure! Always in good spirits and with a great work ethic, Hamza successfully brings his creativity and ability to view problems from multiple angles to the table."',
        fr: '"Bosser avec Hamza est un plaisir ! Toujours de bonne humeur et avec une bonne attitude de travail, Hamza amène avec réussite sa créativité et sa capacité à voir les problèmes sous des angles multiples."',
      },
      name: 'Nicolas Streel',
      role: 'CMO & Co-founder @TheMaul',
    },
    {
      quote: {
        en: '"Hamza is the magician of the story. Or the rocket. Take your pick. Once he takes on a project, he understands the user\'s needs and turns an idea into a beautiful product."',
        fr: `"Hamza c'est le magicien de l'histoire. Ou la fusée. Au choix. Une fois qu'il prend un projet en main, il comprend les besoins de l'utilisateur et il transforme une idée en un beau produit."`,
      },
      name: 'Simon Moreau',
      role: 'PM @Line-out',
    },
  ],

  marqueeItems: [
    'Figma', 'Bubble', 'Lovable', 'Supabase', 'OpenAI',
    'Airtable', 'Notion', 'Framer', 'Webflow', 'Maze', 'Claude',
    'Make', 'N8N', 'Jitter', 'Spline', 'Wordpress'
  ],

  stackCategories: [
    {
      label: 'Design & UX',
      items: ['Figma', 'Adobe Suite', 'Maze', 'Jitter', 'Spline'],
    },
    {
      label: 'No-Code & Vibe-Code',
      items: ['Lovable', 'Bubble.io', 'Webflow', 'Framer', 'Notion', 'Airtable', 'Wordpress'],
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

  services: [
    {
      num: '01',
      title: { en: 'Product Ownership', fr: 'Product Ownership' },
      body: {
        en: "Discovery, user research, roadmap prioritisation, stakeholder alignment. I own the why and the what before the how.",
        fr: "Discovery, recherche utilisateur, priorisation de roadmap, alignement stakeholders. Je pilote le pourquoi et le quoi avant le comment.",
      },
      price: { en: '', fr: '' },
    },
    {
      num: '02',
      title: { en: 'Product Design', fr: 'Product Design' },
      body: {
        en: "UX/UI, design systems, prototyping. End-to-end design that's built to ship.",
        fr: "UX/UI, design systems, prototypage. Du design de bout en bout conçu pour être livré.",
      },
      price: { en: '', fr: '' },
    },
    {
      num: '03',
      title: { en: 'Build & AI', fr: 'Build & IA' },
      body: {
        en: 'Full product build with Bubble, Lovable, Supabase. OpenAI Assistants, automation, AI-first features. From architecture to launch.',
        fr: "Build produit complet avec Bubble, Lovable, Supabase. OpenAI Assistants, automatisation, features IA-first. De l'architecture au lancement.",
      },
      price: { en: '', fr: '' },
    },
  ],

  socials: [
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/hamzakhadri',  icon: 'lni-linkedin-original' },
    { label: 'GitHub',    href: 'https://github.com/hamza-k',               icon: 'lni-github-original'   },
    { label: 'Dribbble',  href: 'https://dribbble.com/hamza-k',             icon: 'lni-dribbble'          },
    { label: 'Uxcel',     href: 'https://app.uxcel.com/ux/FGXWC3Z7OP22',    icon: 'lni-link'              },
  ],

  sections: {
    about:        { isDisplay: true  },
    work:         { isDisplay: true  },
    approach:     { isDisplay: true  },
    stack:        { isDisplay: true  },
    services:     { isDisplay: true  },
    testimonials: { isDisplay: true  },
    contact:      { isDisplay: true  },
  },
};

CONTENT.projects.forEach((p, i) => {
  p.num = String(i + 1).padStart(2, '0');
});

export default CONTENT;
