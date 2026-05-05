function Contact({ t }) {
  const socials = window.CONTENT.socials;

  const iconFor = (label) => {
    const k = label.toLowerCase();
    if (k.includes('linkedin'))  return 'lni-linkedin-original';
    if (k.includes('github'))    return 'lni-github-original';
    if (k.includes('dribbble'))  return 'lni-dribbble';
    if (k.includes('twitter') || k.includes('x')) return 'lni-twitter-original';
    if (k.includes('instagram')) return 'lni-instagram-original';
    return 'lni-link';
  };

  return (
    <>
      <section id="contact" style={{ padding: '9rem 3rem' }} className="mobile-pad mobile-section section-fade">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '2rem' }}>
            <div className="section-label">{t.s07}</div>
          </div>

          <h2
            className="reveal"
            style={{
              fontSize: 'clamp(3rem, 7.5vw, 7.5rem)',
              fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93,
              marginBottom: '3.5rem',
            }}
          >{t.contactTitle}</h2>

          <a
            href={`mailto:${t.contactEmail}`}
            className="contact-email reveal"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.9rem',
              textDecoration: 'none', color: '#F5F5F0',
              fontSize: 'clamp(1.4rem, 3.2vw, 3.2rem)',
              fontWeight: 700, letterSpacing: '-0.03em',
              marginBottom: '3.5rem',
            }}
          >
            <i className="lni lni-envelope" style={{ fontSize: '0.85em', color: 'var(--accent)' }} aria-hidden="true"></i>
            {t.contactEmail}
          </a>

          <div className="reveal" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} className="social-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className={`lni ${s.icon || iconFor(s.label)}`} style={{ fontSize: '1rem' }} aria-hidden="true"></i>
                {s.label}
              </a>
            ))}
          </div>

          <p className="reveal" style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.72rem', color: '#888880',
            letterSpacing: '0.08em', lineHeight: 1.9, maxWidth: '480px',
          }}>
            {t.currentlyOpen}
          </p>
        </div>
      </section>

      <footer style={{
        padding: '2rem 3rem',
        borderTop: '1px solid #1F1F1F',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem', color: '#888880', letterSpacing: '0.08em',
        }}>{t.footer}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem', color: '#333', letterSpacing: '0.05em', fontStyle: 'italic',
        }}>{t.footerNote}</span>
      </footer>
    </>
  );
}

Object.assign(window, { Contact });
