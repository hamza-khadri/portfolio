function Stack({ t }) {
  const items   = window.CONTENT.marqueeItems;
  const doubled = [...items, ...items];
  const cats    = window.CONTENT.stackCategories;

  return (
    <section id="stack" style={{ padding: '9rem 0', background: '#0D0D0D' }} className="mobile-section section-fade">
      <div style={{ padding: '0 3rem', maxWidth: 'calc(1400px + 6rem)', margin: '0 auto 4rem' }} className="mobile-pad">
        <div className="reveal">
          <div className="section-label" style={{ marginBottom: '1.2rem' }}>{t.s04}</div>
          <h2 className="big-title">{t.stackTitle}</h2>
        </div>
      </div>

      <div style={{
        overflow: 'hidden',
        borderTop: '1px solid #1F1F1F', borderBottom: '1px solid #1F1F1F',
        padding: '1.4rem 0', marginBottom: '4rem',
      }}>
        <div className="marquee-track" style={{ gap: '3.5rem' }}>
          {doubled.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3.5rem', flexShrink: 0 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem', letterSpacing: '0.2em',
                color: '#888880', textTransform: 'uppercase', flexShrink: 0,
              }}>{item}</span>
              <span style={{ color: 'var(--accent)', fontSize: '0.35rem', flexShrink: 0 }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 3rem', maxWidth: 'calc(1400px + 6rem)', margin: '0 auto' }} className="mobile-pad">
        <div
          className="reveal stack-cat-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cats.length}, 1fr)`,
            gap: '3rem', borderTop: '1px solid #1F1F1F', paddingTop: '3rem',
          }}
        >
          {cats.map((cat, i) => (
            <div key={i} className={`delay-${i + 1}`}>
              <div className="section-label" style={{ marginBottom: '1.5rem' }}>{cat.label}</div>
              {cat.items.map(item => (
                <div key={item} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 0', borderBottom: '1px solid #1F1F1F',
                }}>
                  <i className="lni lni-checkmark-circle" style={{ fontSize: '0.85rem', color: 'var(--accent)', flexShrink: 0 }} aria-hidden="true"></i>
                  <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Stack });
