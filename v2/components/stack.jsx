import CONTENT from '../../content.js';
import SectionHead from './section-head.jsx';

export default function Stack({ t }) {
  const items = CONTENT.marqueeItems;
  const cats = CONTENT.stackCategories;
  const doubled = [...items, ...items];
  const total = new Set(cats.flatMap(c => c.items)).size;

  return (
    <section id="stack" className="section" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <SectionHead label={t.s04} title={t.stackTitle} index="04" />
      </div>

      <div className="marquee" data-reveal="fade" aria-hidden="true">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span className="marquee-item" key={i}>{item}<span className="sep" /></span>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 'clamp(6rem, 12vw, 11rem)' }}>
        <div className="stack-cats">
          {cats.map((cat, i) => (
            <div className="stack-cat" key={cat.label} data-reveal="up" style={{ '--i': i }}>
              <div className="mono"><span>{cat.label}</span><span style={{ color: 'var(--ink-4)' }}>{String(cat.items.length).padStart(2, '0')}</span></div>
              <div className="chips">
                {cat.items.map(item => <span className="chip glass" key={item}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mono" data-reveal="fade" style={{ marginTop: '2.5rem', display: 'flex', gap: '1.4rem', color: 'var(--ink-3)' }}>
          <span>{t.stackCount(total)}</span>
          <span>·</span>
          <span>{t.toolkitMeta[1]}</span>
        </div>
      </div>
    </section>
  );
}
