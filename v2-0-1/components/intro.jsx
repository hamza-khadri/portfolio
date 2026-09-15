import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/hooks.js';

/* ── The original intro, restored on the v2 surface ───────────────
   assets/logo-intro.json is the file the old site played: a pointer
   walks in from the bottom right, drags a marquee open, the marquee
   breaks into the five slabs of the HK monogram and they fill.

   Two things change on the way to v2, nothing else — the timing is
   the file's own:

   1. the arrow cursor baked into the animation (asset "17") is
      dropped and the site's own cursor takes its place — the dot,
      and the ring that lags behind it — driven along the very same
      keyframes, so the logo is drawn by the pointer you actually
      use here;
   2. every stroke is repainted in the accent, so the construction
      reads as drawing and only the finished monogram is white.

   Everything around the stage — the halo, the hairline frame, the
   texture, the sweep — is v2 material, keyed to where the animation
   is via a `data-phase` attribute. */

const SRC = '/assets/logo-intro.json';
const VISIT_KEY = 'hk_visited';
const CURSOR_ASSET = '17';
/* Lottie floors its 0..1 floats on the way to 8-bit, so aim half a step
   high or #8B7BFF comes out as rgb(138,122,255). */
const ACCENT = [139.5 / 255, 123.5 / 255, 1]; // #8B7BFF

/* The comp is 784×466. The pointer layer's anchor sits at the middle of
   its 30×39 box and the arrow's tip is that box's origin, so the point
   that actually draws is the layer position minus (15, 19.5). Frames at
   60 fps, lifted straight out of the file. */
const COMP_W = 784;
const TIP = [
  { f: 0, x: 394, y: 417 },
  { f: 48, x: 159, y: 81 },
  { f: 53.4, x: 159, y: 81 },
  { f: 101.4, x: 629, y: 385 },
];
const F_DRAG_IN = 53.4;   // marquee starts
const F_DRAG_OUT = 101.4; // marquee released
const F_BUILD = 187.8;    // slabs stop moving, fill begins
const F_FILL = 235.8;     // monogram is solid
const F_END = 272;

/* The file's own easing on both pointer moves. Solved by bisection:
   cheap, and precise well past what 60 fps can show. */
function cubic(x1, y1, x2, y2) {
  const at = (t, a, b) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  return (x) => {
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 18; i++) {
      t = (lo + hi) / 2;
      if (at(t, x1, x2) < x) lo = t; else hi = t;
    }
    return at(t, y1, y2);
  };
}
const EASE = cubic(0.5, 0, 0, 1);

function tipAt(f) {
  if (f <= TIP[0].f) return TIP[0];
  for (let i = 0; i < TIP.length - 1; i++) {
    const a = TIP[i], b = TIP[i + 1];
    if (f <= b.f) {
      const p = a.f === b.f ? 1 : EASE((f - a.f) / (b.f - a.f));
      return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
    }
  }
  return TIP[TIP.length - 1];
}

/* Same fade the arrow had: in over the first 18 frames, out once the
   marquee is released. */
function opacityAt(f) {
  if (f < 18) return f / 18;
  if (f < 99.6) return 1;
  if (f < 117.6) return 1 - (f - 99.6) / 18;
  return 0;
}

const phaseAt = (f) =>
  f < F_DRAG_IN ? 'travel'
  : f < F_DRAG_OUT ? 'draw'
  : f < F_BUILD ? 'build'
  : f < F_FILL ? 'fill'
  : 'settle';

/* Repaint every static stroke in the accent. Fills are left alone: the
   monogram lands white, which is the only moment it should. */
function paintStrokes(node) {
  if (Array.isArray(node)) { for (const v of node) paintStrokes(v); return; }
  if (!node || typeof node !== 'object') return;
  if (node.ty === 'st' && node.c && node.c.a === 0) node.c.k = ACCENT.slice();
  for (const k in node) paintStrokes(node[k]);
}

function prepare(data) {
  data.layers = data.layers.filter((l) => l.refId !== CURSOR_ASSET);
  data.assets = data.assets.filter((a) => a.id !== CURSOR_ASSET);
  paintStrokes(data);
  return data;
}

/* Decided once, before the first render, so the page never flashes its
   content behind an intro that is about to mount. */
export const introPending = (() => {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  try { return localStorage.getItem(VISIT_KEY) !== '1'; } catch (_) { return true; }
})();

export default function Intro({ onDone }) {
  const root = useRef(null);
  /* Held in a ref: a new `onDone` identity on a parent re-render must not
     tear the player down and start the intro over. */
  const done = useRef(onDone);
  done.current = onDone;
  const stage = useRef(null);
  const holder = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const rootEl = root.current, stageEl = stage.current;
    const dotEl = dot.current, ringEl = ring.current;
    let anim = null, over = false, capId = 0, outId = 0, restId = 0, phase = '';
    let animDone = false, pageDone = document.readyState === 'complete';
    let ringX = TIP[0].x, ringY = TIP[0].y;
    let scale = 1;

    /* Its own lock: `no-scroll` is shared with the nav and the drawer, and
       their mount effects run after this one and would clear it. */
    document.body.classList.add('intro-lock');

    const measure = () => { scale = (stageEl.clientWidth || COMP_W) / COMP_W; };
    measure();

    const finish = (fast) => {
      if (over) return;
      over = true;
      clearTimeout(capId); clearTimeout(restId);
      try { localStorage.setItem(VISIT_KEY, '1'); } catch (_) {}
      if (fast) rootEl.classList.add('fast');
      rootEl.classList.add('out');
      outId = setTimeout(() => done.current(), fast ? 420 : 900);
    };

    /* Reveal once the animation has landed *and* the page behind it is
       loaded — same contract as the old splash, so nothing pops in. */
    const maybeFinish = () => {
      if (!animDone || !pageDone || over || restId) return;
      restId = setTimeout(() => finish(false), 500);
    };

    const onFrame = (e) => {
      const f = e.currentTime;
      const p = tipAt(f);
      ringX += (p.x - ringX) * 0.16;
      ringY += (p.y - ringY) * 0.16;
      const o = opacityAt(f);
      dotEl.style.opacity = o;
      ringEl.style.opacity = o;
      dotEl.style.transform = `translate3d(${p.x * scale}px, ${p.y * scale}px, 0)`;
      ringEl.style.transform = `translate3d(${ringX * scale}px, ${ringY * scale}px, 0)`;
      rootEl.style.setProperty('--p', Math.min(1, f / F_FILL).toFixed(4));
      const ph = phaseAt(f);
      if (ph !== phase) {
        phase = ph;
        rootEl.dataset.phase = ph;
        ringEl.classList.toggle('drawing', ph === 'draw');
      }
    };

    const onLoad = () => { pageDone = true; maybeFinish(); };
    const onSkip = () => finish(true);

    window.addEventListener('load', onLoad);
    window.addEventListener('resize', measure);
    window.addEventListener('keydown', onSkip);
    rootEl.addEventListener('pointerdown', onSkip);

    /* The player is only ever fetched by a first-time visitor. */
    (async () => {
      try {
        const [{ default: lottie }, data] = await Promise.all([
          import('lottie-web/build/player/esm/lottie_light.min.js'),
          fetch(SRC).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
        ]);
        if (over) return;
        measure();
        anim = lottie.loadAnimation({
          container: holder.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: prepare(data),
        });
        anim.addEventListener('enterFrame', onFrame);
        anim.addEventListener('complete', () => { animDone = true; maybeFinish(); });
      } catch (_) {
        /* No player, no file, no intro — never hold the site hostage. */
        finish(true);
      }
    })();

    /* Belt and braces: whatever happens, the site is on screen by then. */
    capId = setTimeout(() => finish(true), (F_END / 60) * 1000 + 4500);

    return () => {
      document.body.classList.remove('intro-lock');
      window.removeEventListener('load', onLoad);
      window.removeEventListener('resize', measure);
      window.removeEventListener('keydown', onSkip);
      rootEl.removeEventListener('pointerdown', onSkip);
      clearTimeout(capId); clearTimeout(outId); clearTimeout(restId);
      anim?.destroy();
    };
  }, []);

  return (
    <div className="intro" ref={root} data-phase="travel">
      <div className="intro-sky" aria-hidden="true" />
      <div className="intro-halo" aria-hidden="true" />
      <div className="intro-texture" aria-hidden="true" />

      <div className="intro-stage brackets" ref={stage}>
        <span className="bk" aria-hidden="true" />
        <div className="intro-lottie" ref={holder} aria-hidden="true" />
        <div className="intro-sheen" aria-hidden="true" />
        <div className="cursor-dot" ref={dot} aria-hidden="true" />
        <div className="cursor-ring" ref={ring} aria-hidden="true" />
      </div>

      <div className="intro-foot">
        <span className="intro-bar" aria-hidden="true"><i /></span>
        <button type="button" className="intro-skip label" data-cursor="hover">Skip intro</button>
      </div>

      <div className="intro-vignette" aria-hidden="true" />
    </div>
  );
}
