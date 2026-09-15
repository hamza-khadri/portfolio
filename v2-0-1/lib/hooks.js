import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/* Observe every [data-reveal] / .lines element once and flip it to `.in`.
   Re-runs when `dep` changes (language switch re-renders the copy).
   `ready` holds it back while the intro is still on screen, so the hero
   makes its entrance after the reveal rather than behind it. */
export function useReveal(dep, ready = true) {
  useEffect(() => {
    if (!ready) return;
    const els = Array.from(document.querySelectorAll('[data-reveal], .lines'));
    if (!els.length) return;
    if (prefersReducedMotion()) { els.forEach(el => el.classList.add('in')); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(el => {
      const r = el.getBoundingClientRect();
      /* Already on screen at mount → reveal without waiting for a scroll */
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        requestAnimationFrame(() => el.classList.add('in'));
      } else {
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, [dep, ready]);
}

/* Feed --mx / --my (in %) to every .glass surface so the specular follows the pointer. */
export function useGlassPointer() {
  useEffect(() => {
    if (!isFinePointer()) return;
    let raf = 0, last = null;
    const onMove = (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = last.target.closest?.('.glass');
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((last.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty('--my', `${((last.clientY - r.top) / r.height) * 100}%`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => { document.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);
}

/* Count from 0 to `target` once the element enters the viewport. */
export function useCountUp(target, { duration = 1400, start = true } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(prefersReducedMotion() ? target : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !start) return;
    if (prefersReducedMotion()) { setVal(target); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration, start]);

  return [ref, val];
}

/* Pull an element a few px towards the pointer.

   The displacement is capped in pixels, and small: a magnet strong enough to
   carry the element out from under the pointer makes it flee as you approach
   and snap back the moment you leave, so the button becomes hard to click. */
export function useMagnetic(max = 9, pad = 36) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;

    const clamp = (v) => Math.max(-1, Math.min(1, v));

    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      const settled = Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05;
      if (settled) { cx = tx; cy = ty; raf = 0; } else { raf = requestAnimationFrame(loop); }
      el.style.transform = cx || cy ? `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)` : '';
    };

    const onMove = (e) => {
      /* Measure where the element sits at rest. Reading the moved box would
         feed the offset back into itself and let it drift away. */
      const r = el.getBoundingClientRect();
      const left = r.left - cx, top = r.top - cy;
      const inside = e.clientX > left - pad && e.clientX < left + r.width + pad
                  && e.clientY > top - pad && e.clientY < top + r.height + pad;
      if (inside) {
        tx = clamp((e.clientX - (left + r.width / 2)) / (r.width / 2 + pad)) * max;
        ty = clamp((e.clientY - (top + r.height / 2)) / (r.height / 2 + pad)) * max;
      } else {
        tx = 0; ty = 0;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [max, pad]);
  return ref;
}

/* Which section id is currently "active" (crosses 40% of the viewport). */
export function useActiveSection(ids, dep) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.4;
      let cur = ids[0];
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) cur = el.id;
      }
      setActive(cur);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ids.join(','), dep]);
  return active;
}

/* Ticking clock in a given IANA zone. */
export function useClock(timeZone = 'Europe/Brussels') {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

/* Safe analytics: never let a missing key break an interaction. */
export function track(posthog, event, props) {
  try { posthog?.capture?.(event, props); } catch (_) { /* no-op */ }
}
