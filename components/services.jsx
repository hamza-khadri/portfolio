function Services({ t, lang }) {
  const cards = window.CONTENT.services;
  const icons = ['lni-target-customer', 'lni-pencil-alt', 'lni-bolt'];

  return (
    <section id="services" style={{ padding: '9rem 3rem' }} className="mobile-pad mobile-section section-fade">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '1.2rem' }}>{t.s05}</div>
          <h2 className="big-title">{t.servicesTitle}</h2>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}
          className="mobile-single services-grid"
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className={`svc-card reveal delay-${i + 1}`}
              style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(var(--accent-rgb,255,140,66),0.1)',
                border: '1px solid rgba(var(--accent-rgb,255,140,66),0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <i className={`lni ${icons[i] || 'lni-grid-alt'}`} style={{ fontSize: '1.15rem', color: 'var(--accent)' }} aria-hidden="true"></i>
              </div>

              <div style={{
                color: 'var(--accent)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem', letterSpacing: '0.18em',
                marginBottom: '0.75rem',
              }}>{card.num}</div>

              <h3 style={{
                fontSize: '1.25rem', fontWeight: 700,
                letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.2,
              }}>{card.title[lang] || card.title.en}</h3>

              <p style={{
                color: '#888880', lineHeight: 1.75, fontSize: '0.9rem',
                flex: 1, marginBottom: '2rem',
              }}>{card.body[lang] || card.body.en}</p>

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #1F1F1F' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.72rem', color: '#888880', letterSpacing: '0.08em',
                }}>{card.price[lang] || card.price.en}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Services });
