/* Page transition between the home (React) and the blog (static pages).

   Both are separate documents, so the hand-over is done in two halves:
   - leave: on a click to the other page, the content loses focus and a
     veil of the page's ground rises over it, a hairline of light sweeping
     across, then the browser navigates;
   - enter: an inline script in <head> (PT_HEAD_SCRIPT) sees the fresh
     flag before the first paint and starts the new page under the veil;
     `revealPage()` lifts it once the page is ready, the content coming
     back into focus.

   The veil is CSS only (body::after, body::before in styles.css), so it is
   there from the very first paint. The ground is identical on both sides,
   so the swap of documents happens out of sight. Works in every browser;
   skipped with reduced motion. */

const KEY = 'hk_pt';
const LEAVE_MS = 520;

/* Inline in <head> of every page that can receive the transition. */
export const PT_HEAD_SCRIPT = `try{var t=+sessionStorage.getItem('${KEY}');sessionStorage.removeItem('${KEY}');if(t&&Date.now()-t<4000&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('pt-enter')}catch(e){}`;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* A link to another page of the site (not an anchor on this one, not a file). */
function isPageLink(a, e) {
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download') || a.dataset.pt === 'off') return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  if (/\.\w+$/.test(url.pathname)) return false; // rss.xml, images…
  return url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '');
}

export function leaveTo(href) {
  if (reduced()) { location.href = href; return; }
  try { sessionStorage.setItem(KEY, String(Date.now())); } catch (_) {}
  document.documentElement.classList.remove('pt-enter', 'pt-in');
  document.documentElement.classList.add('pt-leave');
  setTimeout(() => { location.href = href; }, LEAVE_MS);
}

/* Intercept clicks on links to the other pages. Returns a cleanup. */
export function installPageTransitions() {
  const onClick = (e) => {
    const a = e.target.closest?.('a[href]');
    if (!isPageLink(a, e)) return;
    e.preventDefault();
    leaveTo(a.href);
  };
  /* Back/forward cache restores the page as it was left: under the veil. */
  const onShow = (e) => { if (e.persisted) document.documentElement.classList.remove('pt-leave', 'pt-enter'); };
  document.addEventListener('click', onClick);
  window.addEventListener('pageshow', onShow);
  return () => { document.removeEventListener('click', onClick); window.removeEventListener('pageshow', onShow); };
}

/* True when this page was opened by the transition (decided in <head>). */
export const arrivedByTransition = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('pt-enter');

/* Lift the veil. Call once the page has rendered. */
export function revealPage() {
  const root = document.documentElement;
  if (!root.classList.contains('pt-enter')) return;
  /* Two frames: the first paint happens under the veil, then it lifts. */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.classList.add('pt-in');
    root.classList.remove('pt-enter');
    setTimeout(() => root.classList.remove('pt-in'), 1200);
  }));
}
