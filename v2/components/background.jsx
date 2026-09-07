import { useEffect, useMemo, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/hooks.js';

/* Ground: engineering grid + fine dot field + two restrained glows + film grain.
   Everything sits under #root, nothing here is interactive. */
export default function Background() {
  const glowA = useRef(null);
  const glowB = useRef(null);

  const noise = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
      <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer><feFuncR type='linear' slope='2.4' intercept='-0.7'/><feFuncG type='linear' slope='2.4' intercept='-0.7'/><feFuncB type='linear' slope='2.4' intercept='-0.7'/></feComponentTransfer></filter>
      <rect width='100%' height='100%' filter='url(#n)'/></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
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
      <div className="bg-grid" />
      <div className="bg-dots" />
      <div className="bg-noise" style={{ backgroundImage: noise }} />
      <div className="bg-vignette" />
    </div>
  );
}
