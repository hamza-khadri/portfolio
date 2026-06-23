import CONTENT from '../content.js';

export default function Testimonials({ t, lang }) {
  const items = CONTENT.testimonials;

  return (
    <section style={{ padding: '9rem 3rem', background: '#0D0D0D' }} className="mobile-pad mobile-section section-fade">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '5rem' }}>
          <div className="section-label">{t.s06}</div>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem' }}
          className="mobile-single testi-grid"
        >
          {items.map((item, i) => (
            <div key={i} className={`reveal delay-${i + 1}`}>
              <i className="lni lni-quotation" style={{ fontSize: '1.6rem', color: 'var(--accent)', marginBottom: '1rem', display: 'inline-block' }} aria-hidden="true"></i>
              <p style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.45rem)',
                lineHeight: 1.55, fontWeight: 500,
                letterSpacing: '-0.01em', color: '#F5F5F0',
                marginBottom: '2rem',
              }}>{item.quote[lang] || item.quote.en}</p>
              <div style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--accent)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem', color: '#888880',
                  marginTop: '0.3rem', letterSpacing: '0.08em',
                }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
