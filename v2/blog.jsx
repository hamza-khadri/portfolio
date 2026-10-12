import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { isFinePointer, prefersReducedMotion, useGlassPointer, useReveal } from './lib/hooks.js';
import { installPageTransitions, revealPage } from './lib/page-transition.js';
import { initPostIndex } from './lib/blog-index.js';
import Background from './components/background.jsx';
import Cursor from './components/cursor.jsx';

/* Blog pages are static HTML (scripts/blog/templates.mjs) for SEO: the
   content and the nav are in the markup, and the stylesheets are linked
   from it (styles.css + blog.css) so nothing waits on this script. This entry adds what the home has
   on top: the ground of light, the cursor, the reveals, the glass sheen,
   and the behaviours of the nav, the article rail and the post previews. */

/* Nav: compact past the top, scroll progress, mobile sheet. Same as nav.jsx. */
function useNav() {
  useEffect(() => {
    const nav = document.querySelector('.nav');
    const bar = document.querySelector('.nav-progress');
    const burger = document.querySelector('.nav-burger');
    const sheet = document.querySelector('.menu-sheet');
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      nav?.classList.toggle('compact', y > 80);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar?.style.setProperty('--p', max > 0 ? y / max : 0);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    const setOpen = (open) => {
      sheet.classList.toggle('open', open);
      sheet.setAttribute('aria-hidden', String(!open));
      sheet.querySelectorAll('a').forEach((a) => { a.tabIndex = open ? 0 : -1; });
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? burger.dataset.close : burger.dataset.menu);
      burger.querySelector('.ico-burger').style.display = open ? 'none' : '';
      burger.querySelector('.ico-close').style.display = open ? '' : 'none';
      document.body.classList.toggle('no-scroll', open);
    };
    const onBurger = () => setOpen(!sheet.classList.contains('open'));
    const onKey = (e) => { if (e.key === 'Escape' && sheet.classList.contains('open')) setOpen(false); };
    burger?.addEventListener('click', onBurger);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      burger?.removeEventListener('click', onBurger);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
}

/* Article rail: the section headings, the one being read lit. Same as useActiveSection. */
function useRail() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('.rail a[href^="#"]'));
    const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
    if (!links.length) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.4;
      let cur = -1;
      heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top <= line) cur = i; });
      links.forEach((a, i) => {
        a.classList.toggle('on', i === cur);
        if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
}

/* Post rows: the cover floats next to the pointer, as the work previews do. */
function usePreview() {
  useEffect(() => {
    const el = document.querySelector('.work-preview');
    const rows = Array.from(document.querySelectorAll('.post-row[data-preview]'));
    if (!el || !rows.length || !isFinePointer()) return;
    const imgs = Array.from(el.querySelectorAll('img'));
    const lbl = el.querySelector('.lbl');
    const enter = (row) => () => {
      const i = Number(row.dataset.preview);
      imgs.forEach((img) => img.classList.toggle('on', Number(img.dataset.i) === i));
      lbl.textContent = row.dataset.label || '';
      el.classList.add('on');
    };
    const leave = () => el.classList.remove('on');
    const offs = rows.map((row) => {
      const on = enter(row);
      row.addEventListener('mouseenter', on);
      row.addEventListener('mouseleave', leave);
      return () => { row.removeEventListener('mouseenter', on); row.removeEventListener('mouseleave', leave); };
    });

    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const reduce = prefersReducedMotion();
    const onMove = (e) => {
      const w = el.offsetWidth || 340;
      const right = e.clientX + 36 + w / 2;
      x = right + w / 2 + 24 > window.innerWidth ? e.clientX - 36 - w / 2 : right;
      y = e.clientY;
    };
    const loop = () => {
      const nx = cx + (x - cx) * 0.12, ny = cy + (y - cy) * 0.12;
      const rot = reduce ? 0 : Math.max(-8, Math.min(8, (nx - cx) * 0.6));
      cx = nx; cy = ny;
      el.style.left = `${cx}px`; el.style.top = `${cy}px`;
      el.style.transform = `translate3d(-50%, -50%, 0) rotate(${rot}deg) scale(${el.classList.contains('on') ? 1 : 0.9})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { offs.forEach((off) => off()); window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);
}

/* Footer clock, as on the home. */
function useClock() {
  useEffect(() => {
    const el = document.querySelector('[data-clock]');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => { el.textContent = fmt.format(new Date()); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
}

/* The article's blocks rise in as they come into view, like the home's
   content. Only those below the fold: what is already read stays put. */
function useProseReveal() {
  useEffect(() => {
    document.querySelectorAll('.prose > *').forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) el.setAttribute('data-reveal', 'up');
    });
  }, []);
}

function BlogChrome() {
  useEffect(initPostIndex, []);
  useProseReveal();
  useNav();
  useRail();
  usePreview();
  useClock();
  useReveal(true);
  useGlassPointer();
  useEffect(() => {
    revealPage();
    return installPageTransitions();
  }, []);
  return (
    <>
      <Background />
      <Cursor />
    </>
  );
}

createRoot(document.getElementById('chrome')).render(<BlogChrome />);
