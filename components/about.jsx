export default function About({ t }) {
  const stats = [t.stat1, t.stat2, t.stat3, t.stat4];
  const icons = ['lni-calendar', 'lni-rocket', 'lni-layers', 'lni-world'];

  return (
    <section
      id="about"
      style={{ padding: '9rem 3rem' }}
      className="mobile-pad mobile-section section-fade"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '4rem' }}>
          <div className="section-label">{t.s01}</div>
        </div>

        <h2 className="big-title reveal" style={{
          maxWidth: '820px', marginBottom: '4rem', whiteSpace: 'pre-line',
        }}>
          {t.aboutTitle.join('\n')}
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '5rem', borderTop: '1px solid #1F1F1F', paddingTop: '3.5rem',
        }} className="mobile-single">

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
            <p className="reveal delay-1" style={{ color: '#888880', lineHeight: 1.8, fontSize: '1.05rem' }}>{t.aboutP1}</p>
            <p className="reveal delay-2" style={{ color: '#888880', lineHeight: 1.8, fontSize: '1.05rem' }}>{t.aboutP2}</p>
            <p className="reveal delay-3" style={{ color: '#F5F5F0', lineHeight: 1.8, fontSize: '1.05rem' }}>{t.aboutP3}</p>
          </div>

          <div
            className="reveal delay-4"
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '2.5rem', alignContent: 'start',
            }}
          >
            {stats.map(([num, label], i) => (
              <div key={i} style={{ paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
                  <i className={`lni ${icons[i]}`} style={{ fontSize: '1.05rem', color: 'var(--accent)' }} aria-hidden="true"></i>
                  <span style={{
                    fontSize: '3rem', fontWeight: 900,
                    letterSpacing: '-0.05em', color: '#F5F5F0', lineHeight: 1,
                  }}>{num}</span>
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem', color: '#888880',
                  letterSpacing: '0.1em',
                }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
