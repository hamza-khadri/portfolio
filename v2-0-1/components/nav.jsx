import { useEffect, useState } from 'react';
import posthog from '../../posthog.js';
import { track } from '../lib/hooks.js';
import { Burger, Close, ArrowUpRight } from '../lib/icons.jsx';

const ITEMS = [
  { key: 'work',     href: '#work' },
  { key: 'about',    href: '#about' },
  { key: 'services', href: '#services' },
  { key: 'contact',  href: '#contact' },
];

export default function Nav({ t, lang, setLang, active }) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setCompact(y > 80);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const navActive = (key) => {
    if (key === 'about') return active === 'about' || active === 'approach';
    if (key === 'services') return active === 'services' || active === 'stack' || active === 'testimonials';
    return active === key;
  };

  const onNav = (key) => { track(posthog, 'nav item clicked', { item: key, version: 'v2' }); setOpen(false); };

  return (
    <>
      <div className="nav-progress" style={{ '--p': progress }} aria-hidden="true" />
      <div className="nav-wrap">
        <nav className={`nav glass${compact ? ' compact' : ''}`} aria-label="Primary">
          <a href="#hero" className="nav-logo" aria-label="Hamza Khadri — top" onClick={() => onNav('home')}>
            <svg viewBox="0 0 77 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M0 0H15.4V24.9691H0V0Z" fill="currentColor"/>
              <path d="M30.8 0H46.2V50H30.8V0Z" fill="currentColor"/>
              <path d="M15.4 25H30.8L15.4 49.9691H0L15.4 25Z" fill="currentColor"/>
              <path d="M61.6 0H77L61.6 24.9691H46.2L61.6 0Z" fill="currentColor"/>
              <path d="M61.6 25H77V49.9691H61.6V25Z" fill="currentColor"/>
            </svg>
            <span className="nav-name">Hamza Khadri</span>
          </a>

          <div className="nav-links">
            {ITEMS.map(item => (
              <a key={item.key} href={item.href} className={`nav-link${navActive(item.key) ? ' active' : ''}`} onClick={() => onNav(item.key)}>
                {t.nav[item.key]}
                <span className="dot" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="nav-right">
            <div className={`lang ${lang}`} role="group" aria-label="Language">
              <span className="lang-thumb" aria-hidden="true" />
              {['en', 'fr'].map(l => (
                <button key={l} className={lang === l ? 'on' : ''} aria-pressed={lang === l}
                  onClick={() => { track(posthog, 'language changed', { from_language: lang, to_language: l, version: 'v2' }); setLang(l); }}>
                  {l}
                </button>
              ))}
            </div>
            <button className="btn btn-icon glass nav-burger" aria-label={open ? t.close : t.menu} aria-expanded={open} onClick={() => setOpen(o => !o)}>
              {open ? <Close className="ico" /> : <Burger className="ico" />}
            </button>
          </div>
        </nav>
      </div>

      <div className={`menu-sheet${open ? ' open' : ''}`} aria-hidden={!open}>
        {ITEMS.map((item, i) => (
          <a key={item.key} href={item.href} onClick={() => onNav(item.key)} tabIndex={open ? 0 : -1}>
            <span className="label">{String(i + 1).padStart(2, '0')}</span>
            {t.nav[item.key]}
            <ArrowUpRight style={{ width: 22, height: 22, marginLeft: 'auto', color: 'var(--ink-3)' }} />
          </a>
        ))}
      </div>
    </>
  );
}
