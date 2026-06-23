import { useState, useEffect } from 'react';

export default function Nav({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { key: 'work',     href: '#work',     icon: 'lni-briefcase' },
    { key: 'about',    href: '#about',    icon: 'lni-user' },
    { key: 'services', href: '#services', icon: 'lni-grid-alt' },
    { key: 'contact',  href: '#contact',  icon: 'lni-envelope' },
  ];

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.6rem 3rem',
    background: scrolled ? 'rgba(10,10,10,0.88)' : 'transparent',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    borderBottom: scrolled ? '1px solid #1F1F1F' : '1px solid transparent',
    transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
  };

  return (
    <nav style={navStyle} className="nav-inner">
      <a href="#hero" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <svg width="46" height="30" viewBox="0 0 77 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H15.4V24.9691H0V0Z" fill="white"/>
          <path d="M30.8 0H46.2V50H30.8V0Z" fill="white"/>
          <path d="M15.4 25H30.8L15.4 49.9691H0L15.4 25Z" fill="white"/>
          <path d="M61.6 0H77L61.6 24.9691H46.2L61.6 0Z" fill="white"/>
          <path d="M61.6 25H77V49.9691H61.6V25Z" fill="white"/>
        </svg>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <div className="hide-mobile" style={{ display: 'flex', gap: '2rem' }}>
          {navItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              className="nav-link"
              style={{
                fontSize: '0.85rem', fontWeight: 500, color: '#F5F5F0',
                letterSpacing: '0.01em',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              <i className={`lni ${item.icon} li-icon`} style={{ fontSize: '0.9rem', color: 'var(--accent)' }} aria-hidden="true"></i>
              <span>{t.nav[item.key]}</span>
              <span className="ghost" aria-hidden="true">{t.nav[item.key]}</span>
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {['en', 'fr'].map((l, i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <span style={{ color: '#333', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem' }}>/</span>
              )}
              <button
                onClick={() => setLang(l)}
                style={{
                  background: 'none', border: 'none',
                  color: lang === l ? '#F5F5F0' : '#333',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  padding: '0.25rem 0.4rem',
                  transition: 'color 0.2s',
                }}
              >
                {l}
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
