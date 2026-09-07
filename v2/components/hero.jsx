import { useEffect, useRef, useState } from 'react';
import hamzaPhoto from '../../assets/hamza-photo.png';
import { prefersReducedMotion, useMagnetic } from '../lib/hooks.js';
import { ArrowDown, ArrowUpRight } from '../lib/icons.jsx';

export default function Hero({ t }) {
  const words = t.heroWords;
  const [idx, setIdx] = useState(0);
  const portrait = useRef(null);
  const magPrimary = useMagnetic(0.3);
  const magGhost = useMagnetic(0.3);

  useEffect(() => { setIdx(0); }, [t]);

  /* Rolling verb: a vertical slot, one word at a time. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setIdx(i => (i + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words]);

  /* Parallax: the portrait drifts slower than the page and eases out. */
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
        <span className="scan" />
        <div className="specimen">
          {t.specimen.map((s, i) => <span className="label" key={i} data-reveal="fade" style={{ '--i': 6 + i }}>{s}</span>)}
        </div>
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
                <span className="roll">
                  <span className="roll-sizer">{words.map(w => <span key={w}>{w}</span>)}</span>
                  <span className="roll-track" style={{ transform: `translateY(calc(${idx} * var(--cell) * -1))` }}>
                    {words.map(w => <span className="roll-word" key={w}>{w}</span>)}
                  </span>
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
            <div className="hero-meta-card glass brackets">
              <span className="bk" aria-hidden="true" />
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
