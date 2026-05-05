function Approach({ t }) {
  const pillars = [
    { title: t.approach1Title, body: t.approach1Body, icon: 'lni-cog' },
    { title: t.approach2Title, body: t.approach2Body, icon: 'lni-rocket' },
    { title: t.approach3Title, body: t.approach3Body, icon: 'lni-code-alt' },
  ];

  return (
    <section
      id="approach"
      style={{ padding: '9rem 3rem' }}
      className="mobile-pad mobile-section section-fade"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '5rem' }}>
          <div className="section-label" style={{ marginBottom: '1.5rem' }}>{t.s03}</div>
          <h2 className="big-title" style={{ maxWidth: '680px', whiteSpace: 'pre-line' }}>
            {t.approachTitle.join('\n')}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3rem',
            borderTop: '1px solid #1F1F1F',
            paddingTop: '3.5rem',
          }}
          className="approach-grid mobile-single"
        >
          {pillars.map((p, i) => (
            <div key={i} className={`reveal delay-${i + 1}`}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(var(--accent-rgb,255,140,66),0.1)',
                border: '1px solid rgba(var(--accent-rgb,255,140,66),0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <i className={`lni ${p.icon}`} style={{ fontSize: '1.1rem', color: 'var(--accent)' }} aria-hidden="true"></i>
              </div>
              <div style={{
                color: 'var(--accent)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem', letterSpacing: '0.18em',
                marginBottom: '0.75rem',
              }}>
                0{i + 1}
              </div>
              <h3 style={{
                fontSize: '1.2rem', fontWeight: 700,
                letterSpacing: '-0.02em', marginBottom: '0.9rem', lineHeight: 1.25,
              }}>{p.title}</h3>
              <p style={{ color: '#888880', lineHeight: 1.75, fontSize: '0.92rem' }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Approach });
