import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/hooks.js';

/* Dot + lagging ring. The ring reads `data-cursor` on the hovered target:
   "hover" grows it, "label:View" fills it with a word. */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const txt = useRef(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    document.body.classList.add('has-cursor');
    const d = dot.current, r = ring.current;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const reduce = prefersReducedMotion();

    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (reduce) { rx = x; ry = y; r.style.transform = d.style.transform; }
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onOver = (e) => {
      const t = e.target.closest?.('[data-cursor], a, button');
      r.classList.remove('hover', 'label');
      if (!t) return;
      const mode = t.getAttribute('data-cursor') || 'hover';
      if (mode.startsWith('label:')) { txt.current.textContent = mode.slice(6); r.classList.add('label'); }
      else r.classList.add('hover');
    };
    const hide = () => { d.classList.add('hidden'); r.classList.add('hidden'); };
    const show = () => { d.classList.remove('hidden'); r.classList.remove('hidden'); };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', hide);
    document.addEventListener('pointerenter', show);
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => {
      document.body.classList.remove('has-cursor');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('pointerenter', show);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true"><span className="cursor-txt" ref={txt} /></div>
    </>
  );
}
