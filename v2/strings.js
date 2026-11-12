import TRANSLATIONS from '../translations.js';

/* v2-only strings, merged on top of the shared translations so content.js /
   translations.js stay the single source of truth for the copy. */
const EXTRA = {
  en: {
    ctaWork: 'See the work',
    ctaContact: 'Get in touch',
    metaRole: 'Role',
    metaBase: 'Based in',
    metaStatus: 'Status',
    metaStack: 'Stack',
    metaYear: 'Year',
    roleLine: 'Product Designer & Builder',
    baseLine: 'Charleroi, Belgium',
    statusLine: 'Available now',
    coordsLabel: 'Charleroi, Belgium',
    localTime: 'Brussels',
    copyEmail: 'Copy email',
    copied: 'Copied',
    openTo: 'Looking for',
    caseLabel: 'Case',
    viewLabel: 'View',
    menu: 'Menu',
    close: 'Close',
    toolkitMeta: ['tools', 'daily drivers'],
    stackCount: n => `${n} tools`,
    railLabels: { hero: 'Top', about: 'About', work: 'Work', approach: 'Approach', stack: 'Stack', services: 'What I do', testimonials: 'Words', contact: 'Talk' },
    v1Link: 'Current site',
    rss: 'RSS feed',
  },
  fr: {
    ctaWork: 'Voir les projets',
    ctaContact: 'Me contacter',
    metaRole: 'Rôle',
    metaBase: 'Basé à',
    metaStatus: 'Statut',
    metaStack: 'Stack',
    metaYear: 'Année',
    roleLine: 'Product Designer & Builder',
    baseLine: 'Charleroi, Belgique',
    statusLine: 'Disponible immédiatement',
    coordsLabel: 'Charleroi, Belgique',
    localTime: 'Bruxelles',
    copyEmail: "Copier l'email",
    copied: 'Copié',
    openTo: 'Je cherche',
    caseLabel: 'Cas',
    viewLabel: 'Voir',
    menu: 'Menu',
    close: 'Fermer',
    toolkitMeta: ['outils', 'au quotidien'],
    stackCount: n => `${n} outils`,
    railLabels: { hero: 'Haut', about: 'À propos', work: 'Projets', approach: 'Approche', stack: 'Outils', services: 'Ce que je fais', testimonials: 'Avis', contact: 'Contact' },
    v1Link: 'Site actuel',
    rss: 'Flux RSS',
  },
};

const STRINGS = {
  en: { ...TRANSLATIONS.en, ...EXTRA.en },
  fr: { ...TRANSLATIONS.fr, ...EXTRA.fr },
};

export default STRINGS;
