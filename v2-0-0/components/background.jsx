import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/hooks.js';

/* Ground: light only. A horizon band at the top, a soft floor at the bottom
   and two slow glows. No tiled pattern — at small scale it reads as texture
   for texture's sake. Everything sits under #root, nothing is interactive. */
export default function Background() {
  const glowA = useRef(null);
  const glowB = useRef(null);

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
      <div className="bg-floor" />
      <div className="bg-vignette" />
    </div>
  );
}
