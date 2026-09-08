import TRANSLATIONS from '../translations.js';

/* v2-only strings, merged on top of the shared translations so content.js /
   translations.js stay the single source of truth for the copy. */
const EXTRA = {
  en: {
    ctaWork: 'See the work',
    ctaContact: 'Start a conversation',
    metaRole: 'Role',
    metaBase: 'Based in',
    metaStatus: 'Status',
    metaStack: 'Stack',
    metaYear: 'Year',
    roleLine: 'Product Owner · Designer · Builder',
    baseLine: 'Charleroi, Belgium',
    statusLine: 'Open for Q3 2026',
    coordsLabel: 'Charleroi, Belgium',
    localTime: 'Brussels',
    copyEmail: 'Copy email',
    copied: 'Copied',
    openTo: 'Currently open to',
    caseLabel: 'Case',
    viewLabel: 'View',
    menu: 'Menu',
    close: 'Close',
    toolkitMeta: ['tools', 'daily drivers'],
    stackCount: n => `${n} tools`,
    railLabels: { hero: 'Top', about: 'About', work: 'Work', approach: 'Approach', stack: 'Stack', services: 'Expertise', testimonials: 'Words', contact: 'Talk' },
    v1Link: 'Current site',
  },
  fr: {
    ctaWork: 'Voir les projets',
    ctaContact: 'Lancer la discussion',
    metaRole: 'Rôle',
    metaBase: 'Basé à',
    metaStatus: 'Statut',
    metaStack: 'Stack',
    metaYear: 'Année',
    roleLine: 'Product Owner · Designer · Builder',
    baseLine: 'Charleroi, Belgique',
    statusLine: 'Disponible Q3 2026',
    coordsLabel: 'Charleroi, Belgique',
    localTime: 'Bruxelles',
    copyEmail: "Copier l'email",
    copied: 'Copié',
    openTo: 'Ouvert à',
    caseLabel: 'Cas',
    viewLabel: 'Voir',
    menu: 'Menu',
    close: 'Fermer',
    toolkitMeta: ['outils', 'au quotidien'],
    stackCount: n => `${n} outils`,
    railLabels: { hero: 'Haut', about: 'À propos', work: 'Projets', approach: 'Approche', stack: 'Outils', services: 'Expertises', testimonials: 'Avis', contact: 'Contact' },
    v1Link: 'Site actuel',
  },
};

const STRINGS = {
  en: { ...TRANSLATIONS.en, ...EXTRA.en },
  fr: { ...TRANSLATIONS.fr, ...EXTRA.fr },
};

export default STRINGS;
