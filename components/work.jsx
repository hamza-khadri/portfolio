const { useState: useStateWork } = React;

function Work({ t, lang, openProject }) {
  const [hovered, setHovered] = useStateWork(null);
  const projects = window.CONTENT.projects;

  return (
    <section
      id="work"
      style={{ padding: '9rem 3rem', background: '#0D0D0D' }}
      className="mobile-pad mobile-section section-fade"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '1.2rem' }}>{t.s02}</div>
          <h2 className="big-title">{t.workTitle}</h2>
        </div>

        <div style={{ marginTop: '3rem' }}>
          {projects.map((proj, i) => (
            <div
              key={proj.num}
              className={`project-row reveal delay-${Math.min(i + 1, 4)}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => openProject(proj)}
              style={{ padding: '2.2rem 0', cursor: 'pointer' }}
            >
              <div
                className="work-row-inner"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', paddingRight: '300px' }}
              >
                <span
                  className="proj-num"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.7rem', color: '#888880',
                    paddingTop: '0.35rem', minWidth: '2rem', flexShrink: 0,
                  }}
                >{proj.num}</span>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
                    <span
                      className="proj-name"
                      style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}
                    >{proj.name}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.6rem', color: '#888880',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>{proj.category}</span>
                    {proj.productOwner && (
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.55rem', letterSpacing: '0.14em',
                        textTransform: 'uppercase', color: 'var(--accent)',
                        padding: '0.2rem 0.5rem',
                        border: '1px solid var(--accent)',
                        borderRadius: '2px',
                        background: 'rgba(var(--accent-rgb,255,140,66),0.08)',
                      }}>{t.poTag}</span>
                    )}
                  </div>
                  <p style={{ color: '#888880', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '0.9rem' }}>
                    {proj.desc[lang] || proj.desc.en}
                  </p>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {proj.stack.map(s => (
                      <span key={s} style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.6rem', letterSpacing: '0.08em',
                        padding: '0.18rem 0.55rem',
                        border: '1px solid #1F1F1F', color: '#888880',
                        borderRadius: '2px',
                      }}>{s}</span>
                    ))}
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
                      color: '#444', marginLeft: 'auto', letterSpacing: '0.1em',
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      <i className="lni lni-arrow-right" aria-hidden="true"></i>
                      {t.viewCase}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover thumbnail */}
              <div
                className="hide-mobile"
                style={{
                  position: 'absolute', right: '0', top: '50%',
                  width: 260,
                  opacity: hovered === i ? 1 : 0,
                  transform: hovered === i ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.93)',
                  transition: 'opacity 0.32s ease, transform 0.32s ease',
                  pointerEvents: 'none',
                }}
              >
                {proj.heroImage ? (
                  <img src={proj.heroImage} alt={proj.name}
                    style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: '3px', display: 'block' }} />
                ) : (
                  <div className="stripe-bg" style={{
                    width: '100%', aspectRatio: '16/10', borderRadius: '3px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#3a3a3a', textAlign: 'center', lineHeight: 1.8 }}>
                      {proj.name}<br />16 × 10 mockup
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Work });
