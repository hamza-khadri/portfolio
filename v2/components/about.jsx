import SectionHead from './section-head.jsx';
import { useCountUp } from '../lib/hooks.js';

function Stat({ raw, label, i }) {
  const m = String(raw).match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : 0;
  const suffix = m ? m[2] : '';
  const [ref, val] = useCountUp(target);
  const pct = [82, 92, 70, 60][i] || 60;
  return (
    <div className="stat glass" data-reveal="up" style={{ '--i': i + 1 }} ref={ref}>
      <div className="n tnum">{val}{suffix && <sup>{suffix}</sup>}</div>
      <div>
        <div className="l"><span className="label">{label}</span><span className="label idx">{String(i + 1).padStart(2, '0')}</span></div>
        <div className="meter" style={{ marginTop: '0.6rem' }}><i style={{ '--w': `${pct}%` }} /></div>
      </div>
    </div>
  );
}

export default function About({ t }) {
  const stats = [t.stat1, t.stat2, t.stat3, t.stat4];
  return (
    <section id="about" className="section">
      <div className="wrap">
        <SectionHead label={t.s01} title={t.aboutTitle} index="01" max="16ch" />
        <div className="about-grid">
          <div className="about-text">
            <p className="lead" data-reveal="blur" style={{ '--i': 0 }}>{t.aboutP1}</p>
            <p className="lead" data-reveal="blur" style={{ '--i': 1 }}>{t.aboutP2}</p>
            <p className="lead hi" data-reveal="blur" style={{ '--i': 2 }}>{t.aboutP3}</p>
            <div className="kicker" data-reveal="fade" style={{ '--i': 3 }}>
              <span className="ln" aria-hidden="true" />
              <span className="label">{t.baseLine}</span>
            </div>
          </div>
          <div className="stats">
            {stats.map(([num, label], i) => <Stat key={i} raw={num} label={label} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
