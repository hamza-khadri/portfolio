import { useEffect, useRef } from 'react';
import hamzaPhoto from '../../assets/hamza-photo.png';
import { prefersReducedMotion, useMagnetic } from '../lib/hooks.js';
import { ArrowDown, ArrowUpRight } from '../lib/icons.jsx';

/* Glyphs the verb passes through while it resolves. Letters and digits only:
   symbols read as gibberish at display weight. */
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SCRAMBLE_MS = 520;
const HOLD_MS = 2200;
const STEP_MS = 40; // chunky on purpose — a decode, not a smooth fade

export default function Hero({ t }) {
  const words = t.heroWords;
  const portrait = useRef(null);
  const doneRef = useRef(null);
  const noiseRef = useRef(null);
  const magPrimary = useMagnetic(0.3);
  const magGhost = useMagnetic(0.3);

  /* The verb resolves letter by letter, written straight to the DOM so the
     hero does not re-render on every frame. */
  useEffect(() => {
    const done = doneRef.current, noise = noiseRef.current;
    if (!done || !noise) return;
    done.textContent = words[0];
    noise.textContent = '';
    if (prefersReducedMotion() || words.length < 2) return;

    let idx = 0, step = 0, hold = 0;

    const run = () => {
      idx = (idx + 1) % words.length;
      const word = words[idx];
      const started = performance.now();
      step = setInterval(() => {
        const p = Math.min(1, (performance.now() - started) / SCRAMBLE_MS);
        const solid = Math.round(word.length * p);
        let n = '';
        for (let i = solid; i < word.length; i++) n += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        done.textContent = word.slice(0, solid);
        noise.textContent = n;
        if (p === 1) { clearInterval(step); hold = setTimeout(run, HOLD_MS); }
      }, STEP_MS);
    };

    hold = setTimeout(run, HOLD_MS);
    return () => { clearInterval(step); clearTimeout(hold); };
  }, [words]);

  /* The portrait drifts slower than the page and eases out. */
  useEffect(() => {
    const el = portrait.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${1 + y / window.innerHeight * 0.04})`;
        el.style.opacity = String(1 - (y / window.innerHeight) * 0.6);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const staticLabel = `${t.heroPrefix} ${words.join(', ')} ${t.heroSuffix}`;

  return (
    <section id="hero" className="hero">
      <div className="hero-portrait" aria-hidden="true">
        <img ref={portrait} className="portrait-img" src={hamzaPhoto} alt="" fetchpriority="high" />
        <span className="grade" />
        <span className="hero-zone" data-cursor="hover" />
      </div>

      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-status glass" data-reveal="scale">
              <span className="pulse" aria-hidden="true" />
              <span>{t.availability}</span>
            </div>

            <div className="hero-name" data-reveal="fade" style={{ '--i': 1 }}>
              <span className="label">Hamza Khadri</span>
              <span className="rule" aria-hidden="true" />
              <span className="label" style={{ color: 'var(--ink-3)' }}>{t.roleLine}</span>
            </div>

            <h1 className="display h-hero lines" aria-label={staticLabel}>
              <span className="ln"><span className="ln-in h-line" aria-hidden="true">
                <span>{t.heroPrefix}</span>
                <span className="scramble">
                  <span className="scramble-sizer">{words.map(w => <span key={w}>{w}</span>)}</span>
                  <span><span ref={doneRef}>{words[0]}</span><span className="noise" ref={noiseRef} /></span>
                </span>
              </span></span>
              <span className="ln"><span className="ln-in" style={{ '--li': 1 }} aria-hidden="true">{t.heroSuffix}</span></span>
            </h1>

            <p className="lead hero-bio" data-reveal="blur" style={{ '--i': 3 }}>{t.heroBio}</p>

            <div className="hero-actions" data-reveal="up" style={{ '--i': 4 }}>
              <a href="#work" className="btn btn-primary glass" ref={magPrimary}>
                <span className="btn-sheen" aria-hidden="true" />
                <span className="btn-txt"><span>{t.ctaWork}</span><span aria-hidden="true">{t.ctaWork}</span></span>
                <ArrowDown className="ico" />
              </a>
              <a href="#contact" className="btn glass" ref={magGhost}>
                <span className="btn-sheen" aria-hidden="true" />
                <span className="btn-txt"><span>{t.ctaContact}</span><span aria-hidden="true">{t.ctaContact}</span></span>
                <ArrowUpRight className="ico" />
              </a>
            </div>
          </div>

          <aside className="hero-meta" data-reveal="up" style={{ '--i': 5 }}>
            <div className="hero-meta-card glass">
              <div className="row"><span className="k">{t.metaRole}</span><span className="v">{t.roleLine}</span></div>
              <div className="row"><span className="k">{t.metaBase}</span><span className="v dim">{t.baseLine}</span></div>
              <div className="row"><span className="k">{t.metaStatus}</span><span className="v" style={{ color: 'var(--signal)' }}>{t.statusLine}</span></div>
            </div>
          </aside>
        </div>

        <div className="hero-foot" data-reveal="fade" style={{ '--i': 6 }}>
          <div className="scroll-cue">
            <span className="bar" aria-hidden="true" />
            <span className="label">{t.scrollLabel}</span>
          </div>
          <div className="coords">
            <span className="label">{t.coordsLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
