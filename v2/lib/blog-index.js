/* Blog index: search, category filters and pages, client-side.

   Every post is in the static HTML (crawlers and no-JS readers see them
   all, see the <noscript> in the template); this only decides which rows
   show. The state lives in the URL (?q=&cat=&page=) so a filtered view can
   be shared and survives a reload or a back navigation.

   `pagerHtml` is also imported by scripts/blog/templates.mjs, so the first
   page is rendered at build time exactly as the script would render it. */

const pad = (n) => String(n).padStart(2, '0');
const ico = (d) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ARROW_L = '<path d="M19 12H5M11 6l-6 6 6 6"/>';
const ARROW_R = '<path d="M5 12h14M13 6l6 6-6 6"/>';

/** Lowercase, no accents. The template folds the rows' search text the same way. */
export const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Prev / numbers / count / next. `t` = { page, prev, next }. */
export function pagerHtml(page, pages, t) {
  if (pages < 2) return '';
  /* First, last, and the pages around the current one; gaps become an ellipsis. */
  const keep = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const nums = keep
    .flatMap((n, i) => (i && n - keep[i - 1] > 1 ? ['…', n] : [n]))
    .map((n) => n === '…' ? '<span class="pager-gap" aria-hidden="true">…</span>' : `<button type="button" class="pager-num${n === page ? ' on' : ''}" data-page="${n}" aria-label="${t.page} ${n}"${n === page ? ' aria-current="page"' : ''}>${pad(n)}</button>`).join('');
  return `<button type="button" class="btn btn-icon glass pager-step" data-page="${page - 1}" aria-label="${t.prev}"${page === 1 ? ' disabled' : ''}>${ico(ARROW_L)}</button>`
    + `<div class="pager-nums">${nums}</div>`
    + `<span class="pager-count label tnum" aria-hidden="true">${pad(page)} / ${pad(pages)}</span>`
    + `<button type="button" class="btn btn-icon glass pager-step" data-page="${page + 1}" aria-label="${t.next}"${page === pages ? ' disabled' : ''}>${ico(ARROW_R)}</button>`;
}

const STATUS = {
  fr: { count: (n) => `${n} article${n > 1 ? 's' : ''}`, found: (n, q) => `${n} résultat${n > 1 ? 's' : ''}${q ? ` pour « ${q} »` : ''}` },
  en: { count: (n) => `${n} article${n > 1 ? 's' : ''}`, found: (n, q) => `${n} result${n > 1 ? 's' : ''}${q ? ` for “${q}”` : ''}` },
};

/* Category dropdown: a button and a listbox (ARIA listbox pattern), so the
   open list can wear the site's glass, which a native <select> cannot.
   Mouse, touch and keyboard: arrows, Home/End, Enter/Space, Escape, Tab. */
function initDropdown(root, onPick) {
  const btn = root.querySelector('.post-filter-btn');
  const list = root.querySelector('.post-filter-list');
  const opts = Array.from(list.querySelectorAll('[role="option"]'));
  const val = btn.querySelector('.v');
  const count = btn.querySelector('.n');
  let active = 0;

  const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
  const highlight = (i) => {
    active = (i + opts.length) % opts.length;
    opts.forEach((o, j) => o.classList.toggle('active', j === active));
    list.setAttribute('aria-activedescendant', opts[active].id);
    opts[active].scrollIntoView({ block: 'nearest' });
  };
  const open = () => {
    if (isOpen()) return;
    list.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    root.classList.add('open');
    highlight(Math.max(0, opts.findIndex((o) => o.getAttribute('aria-selected') === 'true')));
    list.focus({ preventScroll: true });
  };
  const close = (focusBtn = true) => {
    if (!isOpen()) return;
    btn.setAttribute('aria-expanded', 'false');
    root.classList.remove('open');
    list.hidden = true;
    if (focusBtn) btn.focus({ preventScroll: true });
  };
  /* Reflect the current category on the button and the options. */
  const set = (cat) => {
    const o = opts.find((x) => x.dataset.cat === cat) || opts[0];
    opts.forEach((x) => x.setAttribute('aria-selected', String(x === o)));
    val.textContent = o.dataset.label;
    count.textContent = o.querySelector('.n').textContent;
    root.classList.toggle('filtered', !!o.dataset.cat);
  };
  const pick = (o) => { close(); onPick(o.dataset.cat); };

  const onBtn = () => (isOpen() ? close() : open());
  const onBtnKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); }
  };
  const onListKey = (e) => {
    const keys = { ArrowDown: () => highlight(active + 1), ArrowUp: () => highlight(active - 1), Home: () => highlight(0), End: () => highlight(opts.length - 1) };
    if (keys[e.key]) { e.preventDefault(); keys[e.key](); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(opts[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'Tab') close(false);
  };
  const onListClick = (e) => { const o = e.target.closest('[role="option"]'); if (o) pick(o); };
  const onListMove = (e) => { const o = e.target.closest('[role="option"]'); if (o) highlight(opts.indexOf(o)); };
  const onOutside = (e) => { if (isOpen() && !root.contains(e.target)) close(false); };

  btn.addEventListener('click', onBtn);
  btn.addEventListener('keydown', onBtnKey);
  list.addEventListener('keydown', onListKey);
  list.addEventListener('click', onListClick);
  list.addEventListener('pointermove', onListMove);
  document.addEventListener('pointerdown', onOutside);

  return {
    cats: opts.map((o) => o.dataset.cat),
    set,
    destroy() {
      btn.removeEventListener('click', onBtn);
      btn.removeEventListener('keydown', onBtnKey);
      list.removeEventListener('keydown', onListKey);
      list.removeEventListener('click', onListClick);
      list.removeEventListener('pointermove', onListMove);
      document.removeEventListener('pointerdown', onOutside);
    },
  };
}

export function initPostIndex() {
  const list = document.querySelector('.post-list');
  const pager = document.querySelector('.pager');
  if (!list || !pager) return () => {};
  const rows = Array.from(list.querySelectorAll('.post-row'));
  const input = document.getElementById('post-q');
  const form = document.querySelector('.post-search');
  const status = document.querySelector('.post-status');
  const empty = document.querySelector('.post-empty');
  const size = Number(pager.dataset.size) || 6;
  const labels = JSON.parse(pager.dataset.labels || '{}');
  const s = STATUS[document.documentElement.lang] || STATUS.en;
  const filterEl = document.querySelector('.post-filter');
  const dropdown = filterEl ? initDropdown(filterEl, (cat) => { state.cat = cat; state.page = 1; render(); }) : null;
  const cats = new Set(dropdown?.cats || []);

  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    cat: cats.has(params.get('cat')) ? params.get('cat') : '',
    page: Math.max(1, parseInt(params.get('page'), 10) || 1),
  };
  input.value = state.q;

  const sync = () => {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.cat) p.set('cat', state.cat);
    if (state.page > 1) p.set('page', String(state.page));
    const qs = p.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}`);
  };

  /* Rows that come into view replay the home's rise, staggered. */
  const replay = (shown) => {
    shown.forEach((row, i) => {
      row.style.setProperty('--i', String(Math.min(i, 5)));
      row.classList.remove('in');
    });
    requestAnimationFrame(() => requestAnimationFrame(() => shown.forEach((row) => row.classList.add('in'))));
  };

  const render = ({ animate = true, scroll = false } = {}) => {
    const words = fold(state.q.trim()).split(/\s+/).filter(Boolean);
    const matches = rows.filter((row) =>
      (!state.cat || row.dataset.cat === state.cat) && words.every((w) => row.dataset.search.includes(w)));
    const pages = Math.max(1, Math.ceil(matches.length / size));
    state.page = Math.min(state.page, pages);
    const shown = matches.slice((state.page - 1) * size, state.page * size);

    rows.forEach((row) => row.classList.toggle('is-off', !shown.includes(row)));
    shown.forEach((row, i) => { row.querySelector('.num').textContent = pad((state.page - 1) * size + i + 1); });
    dropdown?.set(state.cat);
    empty.hidden = matches.length > 0;
    status.textContent = state.q || state.cat ? s.found(matches.length, state.q.trim()) : s.count(rows.length);
    pager.innerHTML = pagerHtml(state.page, pages, labels);
    sync();
    if (animate) replay(shown);
    if (scroll) {
      const top = document.querySelector('.post-tools').getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  let timer = 0;
  const onInput = () => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = input.value; state.page = 1; render(); }, 140);
  };
  const onSubmit = (e) => { e.preventDefault(); input.blur(); };
  const onPager = (e) => {
    const b = e.target.closest('button[data-page]');
    if (!b || b.disabled) return;
    state.page = Number(b.dataset.page);
    render({ scroll: true });
  };
  const onReset = (e) => {
    e.preventDefault();
    state.q = ''; state.cat = ''; state.page = 1; input.value = '';
    render();
    input.focus();
  };
  /* "/" focuses the search, Escape clears it. */
  const onKey = (e) => {
    if (e.key === '/' && document.activeElement !== input && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) {
      e.preventDefault();
      input.focus();
    } else if (e.key === 'Escape' && document.activeElement === input && input.value) {
      input.value = ''; onInput();
    }
  };

  input.addEventListener('input', onInput);
  form.addEventListener('submit', onSubmit);
  pager.addEventListener('click', onPager);
  empty.querySelector('.post-reset')?.addEventListener('click', onReset);
  document.addEventListener('keydown', onKey);

  render({ animate: false });

  return () => {
    clearTimeout(timer);
    input.removeEventListener('input', onInput);
    form.removeEventListener('submit', onSubmit);
    dropdown?.destroy();
    pager.removeEventListener('click', onPager);
    empty.querySelector('.post-reset')?.removeEventListener('click', onReset);
    document.removeEventListener('keydown', onKey);
  };
}
