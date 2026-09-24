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
   is via a `data-phase` attribute.

   The exit hands the stage over to the site instead of fading over it:
   the monogram flies into the nav and becomes its logo, the dark ground
   opens like an aperture from the centre, the hero comes into focus
   behind it and the background grid lights up. Skipping keeps the quick
   fade.

   Nothing in the exit repaints the page frame by frame, or it stutters
   on 120 Hz and large screens: the flight, the zoom and the fades are
   compositor-only transforms and opacities, the focus pull is a blur
   layer that fades out rather than a blur that animates, and the
   aperture is a small canvas that only redraws its own gradient. */

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

/* Exit timings, ms. */
const FLIGHT = 1600;
const APERTURE = 1300;
const EXIT_EASE = 'cubic-bezier(0.87, 0, 0.13, 1)'; // expo in-out: a held start, a fast middle, a long landing
const SETTLE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const APERTURE_DELAY = 80;
/* The aperture's soft edge, and how far it opens, in vmax. */
const APERTURE_EDGE = 40;
const APERTURE_END = 110;
/* A soft gradient loses nothing at half resolution. */
const GROUND_SCALE = 0.5;

/* Where the finished monogram sits on screen: the union of the painted
   shapes in the player's SVG. */
function monogramRect(svgHost) {
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
  svgHost.querySelectorAll('path').forEach((p) => {
    const fill = p.getAttribute('fill');
    if (!fill || fill === 'none' || p.getAttribute('fill-opacity') === '0') return;
    const q = p.getBoundingClientRect();
    if (q.width < 1 || q.height < 1) return;
    l = Math.min(l, q.left); t = Math.min(t, q.top);
    r = Math.max(r, q.right); b = Math.max(b, q.bottom);
  });
  return r > l ? { left: l, top: t, width: r - l, height: b - t } : null;
}

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
const APERTURE_EASE = cubic(0.65, 0, 0.35, 1);

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

export default function Intro({ onReveal, onDone }) {
  const root = useRef(null);
  /* Held in a ref: a new `onDone` identity on a parent re-render must not
     tear the player down and start the intro over. */
  const done = useRef(onDone);
  done.current = onDone;
  const reveal = useRef(onReveal);
  reveal.current = onReveal;
  const stage = useRef(null);
  const holder = useRef(null);
  const ground = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const rootEl = root.current, stageEl = stage.current;
    const dotEl = dot.current, ringEl = ring.current;
    let anim = null, over = false, capId = 0, outId = 0, restId = 0, groundRaf = 0, phase = '';
    let animDone = false, pageDone = document.readyState === 'complete';
    let ringX = TIP[0].x, ringY = TIP[0].y;
    let scale = 1;

    /* Its own lock: `no-scroll` is shared with the nav and the drawer, and
       their mount effects run after this one and would clear it. */
    document.body.classList.add('intro-lock');

    const measure = () => { scale = (stageEl.clientWidth || COMP_W) / COMP_W; };
    measure();

    /* The ground opens from the centre: transparent up to the radius, a
       soft edge, then the page colour. Before the radius goes positive the
       centre is already thinning, so the opening starts as a glow. */
    const openGround = () => {
      const c = ground.current;
      const ctx = c?.getContext('2d');
      if (!ctx) return;
      const W = window.innerWidth, H = window.innerHeight;
      c.width = Math.ceil(W * GROUND_SCALE);
      c.height = Math.ceil(H * GROUND_SCALE);
      c.style.background = 'transparent';
      const hex = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#07080A';
      const n = parseInt(hex.replace('#', ''), 16);
      const rgb = `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
      const vmax = Math.max(W, H) / 100;
      const edge = APERTURE_EDGE * vmax, from = -edge, to = APERTURE_END * vmax;
      let t0 = 0;
      const frame = (t) => {
        if (!t0) t0 = t;
        const p = Math.min(1, Math.max(0, (t - t0 - APERTURE_DELAY) / APERTURE));
        const r = from + (to - from) * APERTURE_EASE(p);
        ctx.setTransform(GROUND_SCALE, 0, 0, GROUND_SCALE, 0, 0);
        ctx.clearRect(0, 0, W, H);
        if (r + edge > 0) {
          const g = ctx.createRadialGradient(W / 2, H / 2, Math.max(0, r), W / 2, H / 2, r + edge);
          g.addColorStop(0, `rgba(${rgb}, ${r < 0 ? -r / edge : 0})`);
          g.addColorStop(1, `rgb(${rgb})`);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
        if (p < 1) groundRaf = requestAnimationFrame(frame);
      };
      groundRaf = requestAnimationFrame(frame);
    };

    /* The crafted exit. Every target is measured before anything moves. */
    const handOver = () => {
      const logo = document.querySelector('.nav-logo svg');
      const mono = monogramRect(holder.current);
      const box = stageEl.getBoundingClientRect();

      reveal.current?.();
      window.dispatchEvent(new Event('hk:intro-exit'));
      rootEl.classList.add('exit');
      openGround();

      /* 1. The monogram flies into the nav's logo slot. */
      if (logo && mono) {
        const to = logo.getBoundingClientRect();
        const s = to.width / mono.width;
        const tx = to.left - box.left - (mono.left - box.left) * s;
        const ty = to.top - box.top - (mono.top - box.top) * s;
        stageEl.style.transformOrigin = '0 0';
        stageEl.animate(
          [{ transform: 'none' }, { transform: `translate(${tx}px, ${ty}px) scale(${s})` }],
          { duration: FLIGHT, easing: EXIT_EASE, fill: 'forwards' },
        );
        /* Its glow burns off on the way, so it lands as a plain logo. */
        holder.current.animate(
          [{ filter: getComputedStyle(holder.current).filter }, { filter: 'none' }],
          { duration: FLIGHT * 0.7, easing: SETTLE_EASE, fill: 'forwards' },
        );
      } else {
        stageEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
      }

      /* 2. The site comes into focus behind the opening ground: the blur
         is the .intro-focus layer fading out (CSS), the hero only settles
         its scale and opacity. */
      document.getElementById('hero')?.animate(
        [{ transform: 'scale(1.035)', opacity: 0.5 }, { transform: 'none', opacity: 1 }],
        { duration: APERTURE + 200, easing: SETTLE_EASE },
      );
      document.querySelector('.bg')?.animate(
        [{ transform: 'scale(1.1)', opacity: 0.2 }, { transform: 'none', opacity: 1 }],
        { duration: APERTURE + 500, easing: SETTLE_EASE },
      );
      document.querySelector('.nav-wrap')?.animate(
        [{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 900, delay: 250, easing: SETTLE_EASE, fill: 'backwards' },
      );

      outId = setTimeout(() => done.current(), Math.max(FLIGHT, APERTURE) + 60);
    };

    const finish = (fast) => {
      if (over) return;
      over = true;
      clearTimeout(capId); clearTimeout(restId);
      try { localStorage.setItem(VISIT_KEY, '1'); } catch (_) {}
      if (!fast) { handOver(); return; }
      reveal.current?.();
      rootEl.classList.add('fast', 'out');
      outId = setTimeout(() => done.current(), 420);
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
      cancelAnimationFrame(groundRaf);
      anim?.destroy();
    };
  }, []);

  return (
    <div className="intro" ref={root} data-phase="travel">
      {/* Blurs the site under the opening ground, then fades: the focus pull. */}
      <div className="intro-focus" aria-hidden="true" />
      {/* Everything behind the stage: the ground the exit opens, and its light. */}
      <div className="intro-backdrop" aria-hidden="true">
        <canvas className="intro-ground" ref={ground} />
        <div className="intro-light">
          <div className="intro-sky" />
          <div className="intro-halo" />
          <div className="intro-texture" />
          <div className="intro-vignette" />
        </div>
      </div>

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
    </div>
  );
}
