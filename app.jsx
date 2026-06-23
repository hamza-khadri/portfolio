import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import TRANSLATIONS from './translations.js';
import CONTENT from './content.js';

import Nav from './components/nav.jsx';
import Hero from './components/hero.jsx';
import About from './components/about.jsx';
import Work from './components/work.jsx';
import Approach from './components/approach.jsx';
import Stack from './components/stack.jsx';
import Services from './components/services.jsx';
import Testimonials from './components/testimonials.jsx';
import Contact from './components/contact.jsx';
import ProjectModal from './components/project-modal.jsx';

const ACCENT_COLOR = '#6552F4';
const GRAIN_ENABLED   = true;
const GRAIN_INTENSITY = 70;
const GRAIN_SIZE      = 120;
const GRAIN_CONTRAST  = 75;
const PORTRAIT_HOVER_SIZE = 260;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(v, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function App() {
  const [lang, setLang] = useState('en');
  const [activeProject, setActiveProject] = useState(null);
  const t = TRANSLATIONS[lang];

  /* ── P1: sync <html lang> with active language ── */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* ── Apply accent color globally ── */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', ACCENT_COLOR);
    root.style.setProperty('--accent-rgb', hexToRgb(ACCENT_COLOR));
  }, []);

  /* ── Grain texture ── */
  useEffect(() => {
    const root = document.documentElement;
    if (!GRAIN_ENABLED) {
      root.style.setProperty('--grain-opacity', '0');
      root.style.setProperty('--grain-image', 'none');
      return;
    }
    const c = Math.max(0, Math.min(100, GRAIN_CONTRAST)) / 100;
    const baseFreq = 0.85;
    const numOctaves = 2;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
        <feComponentTransfer>
          <feFuncR type='linear' slope='${1 + c * 2}' intercept='${-c}'/>
          <feFuncG type='linear' slope='${1 + c * 2}' intercept='${-c}'/>
          <feFuncB type='linear' slope='${1 + c * 2}' intercept='${-c}'/>
        </feComponentTransfer>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`;
    const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
    root.style.setProperty('--grain-image', url);
    root.style.setProperty('--grain-size', GRAIN_SIZE + 'px');
    root.style.setProperty('--grain-opacity', String(GRAIN_INTENSITY / 100));
  }, []);

  /* ── Custom cursor ── */
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    let cx = 0, cy = 0, tx = 0, ty = 0, raf;

    const onMove = e => { tx = e.clientX; ty = e.clientY; };

    const tick = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      raf = requestAnimationFrame(tick);
    };

    const half = PORTRAIT_HOVER_SIZE / 2;

    const grow    = () => { cursor.style.width = '58px';                      cursor.style.height = '58px';                      cursor.style.margin = '-29px 0 0 -29px'; };
    const growBig = () => { cursor.style.width = PORTRAIT_HOVER_SIZE + 'px';  cursor.style.height = PORTRAIT_HOVER_SIZE + 'px';  cursor.style.margin = `-${half}px 0 0 -${half}px`; };
    const shrink  = () => { cursor.style.width = '12px';                      cursor.style.height = '12px';                      cursor.style.margin = '-6px 0 0 -6px'; };

    const attachHovers = () => {
      document.querySelectorAll('a, button, .hoverable').forEach(el => {
        el.removeEventListener('mouseenter', grow);
        el.removeEventListener('mouseleave', shrink);
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
      document.querySelectorAll('.portrait-zone').forEach(el => {
        el.removeEventListener('mouseenter', growBig);
        el.removeEventListener('mouseleave', shrink);
        el.addEventListener('mouseenter', growBig);
        el.addEventListener('mouseleave', shrink);
      });
    };

    document.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    attachHovers();

    const mo = new MutationObserver(attachHovers);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal');

      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );

      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.style.transition = 'none';
          el.classList.add('visible');
          requestAnimationFrame(() => { el.style.transition = ''; });
        } else {
          io.observe(el);
        }
      });

      return () => io.disconnect();
    }, 60);

    return () => clearTimeout(timer);
  }, [lang]);

  /* ── Section fade ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      const sections = Array.from(document.querySelectorAll('.section-fade'));
      if (!sections.length) return;

      const update = () => {
        const mid = window.scrollY + window.innerHeight * 0.5;
        let activeIdx = 0;
        sections.forEach((s, i) => {
          const top = s.offsetTop;
          if (mid >= top) activeIdx = i;
        });
        sections.forEach((s, i) => {
          s.classList.toggle('section-dim', i !== activeIdx);
        });
      };

      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      };
    }, 200);

    return () => clearTimeout(timer);
  }, [lang]);

  const s = CONTENT.sections;

  return (
    <div>
      <Nav          t={t} lang={lang} setLang={setLang} />
      <Hero         t={t} />
      {s.about.isDisplay        && <About        t={t} />}
      {s.work.isDisplay         && <Work         t={t} lang={lang} openProject={setActiveProject} />}
      {s.approach.isDisplay     && <Approach     t={t} />}
      {s.stack.isDisplay        && <Stack        t={t} />}
      {s.services.isDisplay     && <Services     t={t} lang={lang} />}
      {s.testimonials.isDisplay && <Testimonials t={t} lang={lang} />}
      {s.contact.isDisplay      && <Contact      t={t} />}
      <ProjectModal project={activeProject} lang={lang} t={t} onClose={() => setActiveProject(null)} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
