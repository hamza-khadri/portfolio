import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/hooks.js';

/* Ground: an engineering grid and a fine dot field that travel with the page,
   a low horizon band and two restrained glows. No grain: the depth comes from
   light and geometry. Everything sits under #root, nothing here is interactive. */
export default function Background() {
  const glowA = useRef(null);
  const glowB = useRef(null);
  const grid = useRef(null);
  const dots = useRef(null);

  /* Offset both tiled layers by the scroll position so they read as printed
     on the document rather than fixed to the viewport. Taken modulo the cell
     size, which is visually identical and keeps the numbers small. */
  useEffect(() => {
    let raf = 0;
    const shift = (el) => {
      if (!el) return;
      const cell = parseFloat(getComputedStyle(el).getPropertyValue('--cell')) || 1;
      el.style.backgroundPosition = `0 ${-(window.scrollY % cell)}px`;
    };
    const update = () => { raf = 0; shift(grid.current); shift(dots.current); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Glows drift very slowly with the pointer and the scroll: alive, not busy. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let px = 0, py = 0, tx = 0, ty = 0, raf = 0;
    const fine = isFinePointer();
    const onMove = (e) => { tx = (e.clientX / window.innerWidth - 0.5); ty = (e.clientY / window.innerHeight - 0.5); };
    const loop = () => {
      px += (tx - px) * 0.03; py += (ty - py) * 0.03;
      const sy = window.scrollY * 0.06;
      if (glowA.current) glowA.current.style.transform = `translate3d(${px * 60}px, ${py * 40 + sy}px, 0)`;
      if (glowB.current) glowB.current.style.transform = `translate3d(${px * -40}px, ${py * -30 - sy * 0.5}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-glow a" ref={glowA} />
      <div className="bg-glow b" ref={glowB} />
      <div className="bg-horizon" />
      <div className="bg-grid" ref={grid} />
      <div className="bg-dots" ref={dots} />
      <div className="bg-vignette" />
    </div>
  );
}
