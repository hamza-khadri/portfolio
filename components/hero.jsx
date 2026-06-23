import { useState, useEffect, useRef } from 'react';

export default function Hero({ t }) {
  const [shown, setShown] = useState(t.heroWords[0]);
  const [phase, setPhase] = useState('idle');
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = 0;
    setShown(t.heroWords[0]);
    setPhase('idle');
  }, [t]);

  useEffect(() => {
    const HOLD = 1400;
    const ERASE_TOTAL = 250;
    const TYPE_TOTAL = 500;
    let timeouts = [];

    const eraseThenType = () => {
      const current = t.heroWords[idxRef.current];
      const next    = t.heroWords[(idxRef.current + 1) % t.heroWords.length];
      setPhase('erasing');

      const erasePerChar = ERASE_TOTAL / Math.max(current.length, 1);
      for (let i = 1; i <= current.length; i++) {
        timeouts.push(setTimeout(() => {
          setShown(current.slice(0, current.length - i));
        }, erasePerChar * i));
      }

      const typePerChar = TYPE_TOTAL / Math.max(next.length, 1);
      for (let i = 1; i <= next.length; i++) {
        timeouts.push(setTimeout(() => {
          setShown(next.slice(0, i));
          if (i === next.length) {
            setPhase('idle');
            idxRef.current = (idxRef.current + 1) % t.heroWords.length;
          } else {
            setPhase('typing');
          }
        }, ERASE_TOTAL + typePerChar * i));
      }
    };

    const interval = setInterval(eraseThenType, HOLD + ERASE_TOTAL + TYPE_TOTAL);
    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [t]);

  const staticLabel = `${t.heroPrefix} ${t.heroWords.join(', ')} ${t.heroSuffix}`;

  return (
    <section
      id="hero"
      className="hero-cols section-fade"
      style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
      }}
    >
      <div className="hero-photo-wrap" style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: '42%', overflow: 'hidden', zIndex: 1,
      }}>
        <img
          src="assets/hamza-photo.png"
          alt="Hamza Khadri — Product Owner, Designer & Builder based in Belgium"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.35) 35%, transparent 65%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #0A0A0A 0%, transparent 100%)', pointerEvents: 'none' }}></div>
        <div className="portrait-zone" style={{ position: 'absolute', left: '20%', right: '10%', top: '10%', bottom: '30%', borderRadius: '50%', pointerEvents: 'auto' }}></div>
      </div>

      <div
        className="hero-inner mobile-pad"
        style={{
          maxWidth: '1400px', margin: '0 auto',
          minHeight: '100vh', position: 'relative', zIndex: 2,
          display: 'flex', alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div className="hero-text" style={{
          flex: '0 0 60%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          pointerEvents: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem', marginTop: '6rem' }}>
            <div className="avail-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}></div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#888880' }}>
              {t.availability}
            </span>
          </div>

          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.72rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#888880',
            marginBottom: '1.2rem',
          }}>Hamza Khadri</div>

          <h1
            className="hero-title"
            aria-label={staticLabel}
            style={{ margin: 0, fontSize: 'clamp(2.8rem, 7vw, 7.5rem)' }}
          >
            <span aria-hidden="true" style={{ display: 'flex', alignItems: 'baseline', gap: '0.28em', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#F5F5F0' }}>{t.heroPrefix}</span>
              <span style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'baseline' }}>
                <span>{shown}</span>
                <span className="type-caret" aria-hidden="true">|</span>
              </span>
            </span>
            <span aria-hidden="true" style={{ display: 'block', color: '#F5F5F0', whiteSpace: 'nowrap' }}>{t.heroSuffix}</span>
          </h1>

          <p style={{ marginTop: '2.5rem', maxWidth: '460px', fontSize: '1.05rem', lineHeight: 1.7, color: '#888880' }}>
            {t.heroBio}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '4rem', paddingBottom: '2rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.63rem', letterSpacing: '0.2em', color: '#888880' }}>{t.scrollLabel}</span>
            <span className="scroll-bounce" style={{ color: '#888880', fontSize: '0.85rem' }}>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
