import { useEffect, useState } from 'react';

export default function ProjectModal({ project, lang, onClose, t }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (project) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      const onKey = e => { if (e.key === 'Escape') handleClose(); };
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
      };
    }
  }, [project]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => { setMounted(false); onClose(); }, 320);
  };

  if (!project && !mounted) return null;
  const p = project || {};

  const tr = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
  };

  const has = v => {
    const s = tr(v);
    return s && !s.toLowerCase().includes('placeholder');
  };

  const labelStyle = {
    fontFamily: 'Satoshi, sans-serif',
    fontSize: '0.62rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: '#888880',
  };
  const sectionTitleStyle = {
    fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--accent)', fontFamily: 'Satoshi, sans-serif',
    marginBottom: '0.9rem',
  };
  const bodyStyle = { color: '#888880', lineHeight: 1.8, fontSize: '1rem' };

  const metaParts = [];
  if (p.stack && p.stack.length) metaParts.push(p.stack.join(', '));
  if (has(p.role)) metaParts.push(tr(p.role));
  if (p.year) metaParts.push(p.year);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(5,5,5,0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        overflowY: 'auto',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '2rem 1.5rem 2rem 1.5rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.32s ease',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '900px',
        position: 'relative',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.985)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.32s ease, transform 0.32s ease',
        paddingBottom: '1.5rem',
      }}>

        <button
          onClick={handleClose}
          aria-label={t.modalClose}
          style={{
            position: 'absolute', top: '1rem', right: 0, zIndex: 10,
            background: '#1A1A1A', border: '1px solid #2A2A2A',
            color: '#F5F5F0', width: 40, height: 40,
            borderRadius: '50%', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >✕</button>

        <div style={{ paddingTop: '1rem', marginBottom: '1.5rem', maxWidth: 'calc(100% - 70px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={labelStyle}>{p.num}</span>
            <span style={{ ...labelStyle, color: '#444' }}>—</span>
            <span style={labelStyle}>{p.category}</span>
            {p.productOwner && (
              <span style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--accent)',
                padding: '0.25rem 0.6rem',
                border: '1px solid var(--accent)',
                borderRadius: '2px',
                background: 'rgba(var(--accent-rgb,255,140,66),0.08)',
              }}>{t.poTag}</span>
            )}
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95,
            color: '#F5F5F0', marginBottom: '1.2rem',
          }}>{p.name}</h2>

          {metaParts.length > 0 && (
            <div style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.72rem', letterSpacing: '0.06em',
              color: '#888880', lineHeight: 1.7,
            }}>
              {metaParts.join(' • ')}
            </div>
          )}
        </div>

        {p.heroImage ? (
          <div style={{ marginBottom: '3rem' }}>
            <img src={p.heroImage} alt={p.name}
              style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: '3px', display: 'block' }} />
          </div>
        ) : (
          <div style={{ marginBottom: '3rem' }}>
            <div className="stripe-bg" style={{
              width: '100%', aspectRatio: '16/10', borderRadius: '3px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: '0.65rem', color: '#333', textAlign: 'center', lineHeight: 1.8 }}>
                {p.name}<br />hero image — 16 × 10<br />
                <span style={{ color: '#2a2a2a' }}>set heroImage in content.js</span>
              </span>
            </div>
          </div>
        )}

        {has(p.overview) && (
          <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #1F1F1F' }}>
            <div style={sectionTitleStyle}>{t.modalOverview}</div>
            <p style={bodyStyle}>{tr(p.overview)}</p>
          </div>
        )}

        {(has(p.challenge) || has(p.approach)) && (
          <div className="modal-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem',
            marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #1F1F1F',
          }}>
            {has(p.challenge) && (
              <div>
                <div style={sectionTitleStyle}>{t.modalChallenge}</div>
                <p style={bodyStyle}>{tr(p.challenge)}</p>
              </div>
            )}
            {has(p.approach) && (
              <div>
                <div style={sectionTitleStyle}>{t.modalApproach}</div>
                <p style={bodyStyle}>{tr(p.approach)}</p>
              </div>
            )}
          </div>
        )}

        {p.detailImage && (
          <div style={{ marginBottom: '3rem' }}>
            <img src={p.detailImage} alt={`${p.name} detail`}
              style={{ width: '100%', borderRadius: '3px', display: 'block' }} />
          </div>
        )}

        {has(p.results) && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={sectionTitleStyle}>{t.modalResults}</div>
            <p style={bodyStyle}>{tr(p.results)}</p>
          </div>
        )}

        {p.liveUrl && (
          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              color: 'var(--accent)', textDecoration: 'none',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              borderBottom: '1px solid currentColor', paddingBottom: '2px',
            }}>{t.modalLive}</a>
        )}
      </div>
    </div>
  );
}
