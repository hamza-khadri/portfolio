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
   and the behaviours of the nav, the article's table of contents and the post previews. */

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

/* Table of contents: the heading being read is lit (in the list next to the text and in the
   floating panel). On mobile, the button shows once the list is scrolled past and opens the panel. */
function useToc() {
  useEffect(() => {
    const toc = document.querySelector('.toc');
    const links = Array.from(document.querySelectorAll('.toc-list a[href^="#"]'));
    if (!toc || !links.length) return;
    const idOf = (a) => decodeURIComponent(a.hash.slice(1));
    const heads = Array.from(new Set(links.map(idOf))).map((id) => document.getElementById(id)).filter(Boolean);
    const article = document.getElementById('article');
    const float = document.querySelector('.toc-float');
    const sheet = float.querySelector('.toc-sheet');
    const fab = float.querySelector('.toc-fab');

    const setOpen = (open) => {
      sheet.hidden = !open;
      fab.setAttribute('aria-expanded', String(open));
      fab.setAttribute('aria-label', open ? fab.dataset.close : fab.dataset.open);
      fab.querySelector('.ico-list').style.display = open ? 'none' : '';
      fab.querySelector('.ico-close').style.display = open ? '' : 'none';
      if (open) sheet.querySelector('a.on')?.scrollIntoView({ block: 'center' });
    };

    let ticking = false, current;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.4;
      let cur = null;
      heads.forEach((h) => { if (h.getBoundingClientRect().top <= line) cur = h.id; });
      if (cur !== current) {
        current = cur;
        links.forEach((a) => {
          const on = idOf(a) === cur;
          a.classList.toggle('on', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
        // A long list scrolls inside its sticky column: keep the lit entry in view.
        const lit = toc.querySelector('a.on');
        if (lit && toc.scrollHeight > toc.clientHeight) toc.scrollTo({ top: lit.offsetTop - toc.clientHeight / 2, behavior: 'smooth' });
      }
      const show = toc.getBoundingClientRect().bottom < 0 && article.getBoundingClientRect().bottom > window.innerHeight * 0.5;
      float.classList.toggle('show', show);
      if (!show && !sheet.hidden) setOpen(false);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const onFab = () => setOpen(sheet.hidden);
    const onPick = (e) => { if (e.target.closest('a')) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape' && !sheet.hidden) { setOpen(false); fab.focus(); } };
    const onOutside = (e) => { if (!sheet.hidden && !float.contains(e.target)) setOpen(false); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    fab.addEventListener('click', onFab);
    sheet.addEventListener('click', onPick);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      fab.removeEventListener('click', onFab);
      sheet.removeEventListener('click', onPick);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
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
      if (row.closest('.is-grid')) return; // cards already show their cover
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
  useToc();
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
