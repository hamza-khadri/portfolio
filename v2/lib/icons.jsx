/* Hand-drawn 24-grid line icons, 1.5px stroke. Kept tiny and consistent so the
   page has one graphic voice instead of a mixed icon font. */
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true };

export const ArrowUpRight = (p) => (
  <svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowDown = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
);
export const Close = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Copy = (p) => (
  <svg {...base} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
);
export const Check = (p) => (
  <svg {...base} {...p}><path d="m5 12 4.5 4.5L19 7" /></svg>
);
export const Mail = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
);
export const Burger = (p) => (
  <svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>
);
/* Discovery: a target with an offset scope */
export const Scope = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
);
/* Ship: a vector arrow leaving a frame */
export const Ship = (p) => (
  <svg {...base} {...p}><path d="M4 20V9a2 2 0 0 1 2-2h5" /><path d="M20 4 9 15" /><path d="M13 4h7v7" /><path d="M4 20h11" /></svg>
);
/* Full chain: three linked nodes */
export const Chain = (p) => (
  <svg {...base} {...p}><circle cx="5" cy="12" r="2.2" /><circle cx="12" cy="6" r="2.2" /><circle cx="19" cy="12" r="2.2" /><circle cx="12" cy="18" r="2.2" /><path d="M7 11l3-3.5M14 7.5l3 3.5M7 13l3 3.5M14 16.5l3-3.5" /></svg>
);
/* Product ownership: a compass */
export const Compass = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 5.3-4.8 1.7 2.2-5.3z" /></svg>
);
/* Product design: a pen over a grid */
export const Pen = (p) => (
  <svg {...base} {...p}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17z" /><path d="m13 8 3 3" /><path d="M4 4h4M4 8h2" /></svg>
);
/* Build & AI: a circuit spark */
export const Spark = (p) => (
  <svg {...base} {...p}><path d="M13 3 5 14h6l-1 7 9-12h-6z" /></svg>
);
