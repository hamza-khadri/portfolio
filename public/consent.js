/* Cookie consent: the only gate in front of Google Analytics and PostHog.

   Loaded as a plain blocking script right after <head> on every page (vite.config.js,
   public/404.html), so `window.hkConsent` is set before any module runs.

   - No valid choice stored (none, older than 6 months, or an older VERSION): nothing
     is loaded, the banner shows once the page is ready (after the home's intro).
   - Accepted: gtag.js is loaded; PostHog starts (posthog.js listens to `hk:consent`).
   - Refused (button or ✕): nothing is loaded, Google and PostHog are never contacted.
   - Any `[data-consent-open]` element (footer "Cookies") reopens the banner; refusing
     after accepting turns both tools off and deletes their cookies.

   The choice lives in localStorage (it never needs to reach a server). Bump VERSION
   when a new tool is added: every stored choice becomes stale and the banner asks again.
   Self-contained (own styles, own copy) so it looks the same on the home, the blog,
   the archived versions and the 404. */
(function () {
  var KEY = 'hk_consent';
  var VERSION = 1;
  var MAX_AGE = 182 * 24 * 3600 * 1000;
  var GA_ID = 'G-XMWVTDHZ47';
  /* Local dev never reports to Google. */
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.v === VERSION && Date.now() - c.t < MAX_AGE) return c.analytics === true;
    } catch (e) {}
    return null;
  }

  function store(analytics) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, t: Date.now(), analytics: analytics })); } catch (e) {}
  }

  var state = { analytics: read() };
  window.hkConsent = state;

  /* ── Google Analytics ─────────────────────────────────────────── */
  var gaLoaded = false;
  function startGA() {
    window['ga-disable-' + GA_ID] = false;
    if (gaLoaded || LOCAL) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    /* 13 months, the usual ceiling for audience-measurement cookies (GA's default is 2 years). */
    window.gtag('config', GA_ID, { cookie_expires: 13 * 30 * 24 * 3600 });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function stopGA() {
    window['ga-disable-' + GA_ID] = true;
    /* GA sets its cookies on the widest domain it can; try each level. */
    var parts = location.hostname.split('.');
    var domains = [''];
    for (var i = 0; i < parts.length - 1; i++) domains.push('; domain=.' + parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga(_|$)/.test(name)) return;
      domains.forEach(function (d) { document.cookie = name + '=; Max-Age=0; path=/' + d; });
    });
  }

  function apply(analytics, changed) {
    state.analytics = analytics;
    if (analytics) startGA();
    else if (changed) stopGA();
    try { window.dispatchEvent(new CustomEvent('hk:consent', { detail: { analytics: analytics } })); } catch (e) {}
  }

  if (state.analytics) startGA();

  /* ── Banner ───────────────────────────────────────────────────── */
  var COPY = {
    fr: {
      label: 'Cookies',
      text: "J'aimerais mesurer l'audience du site avec Google Analytics et PostHog. Rien n'est activé sans votre accord, modifiable à tout moment via «\u00a0Cookies\u00a0» en bas de page.",
      refuse: 'Refuser',
      close: 'Fermer (refuser les cookies)',
      accept: 'Accepter',
    },
    en: {
      label: 'Cookies',
      text: "I'd like to measure the site's audience with Google Analytics and PostHog. Nothing runs without your consent, and you can change it any time via “Cookies” in the footer.",
      refuse: 'Decline',
      close: 'Close (decline cookies)',
      accept: 'Accept',
    },
  };

  var CSS = '\
.hkc{--hkc-ink:#ECEEF1;--hkc-ink-2:#9AA1AA;--hkc-ink-3:#5B626B;--hkc-line:rgba(255,255,255,.14);--hkc-accent:139,123,255;--hkc-ease:cubic-bezier(.16,1,.3,1);\
position:fixed;z-index:97;right:calc(1.25rem + env(safe-area-inset-right));bottom:calc(1.25rem + env(safe-area-inset-bottom));\
width:min(23.5rem,calc(100vw - 2.5rem));padding:1.15rem 1.2rem 1.2rem;border-radius:22px;isolation:isolate;\
font-family:var(--font-body,"Satoshi",system-ui,-apple-system,sans-serif);color:var(--hkc-ink);text-align:left;\
background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.025) 38%,rgba(255,255,255,.015)),rgba(9,10,13,.72);\
-webkit-backdrop-filter:blur(22px) saturate(170%);backdrop-filter:blur(22px) saturate(170%);\
box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(0,0,0,.45),0 24px 60px -20px rgba(0,0,0,.8);\
opacity:0;transform:translate3d(0,14px,0);transition:opacity .6s var(--hkc-ease),transform .6s var(--hkc-ease)}\
.hkc::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;\
background:linear-gradient(140deg,rgba(255,255,255,.5),rgba(150,225,255,.25) 14%,rgba(255,255,255,.08) 36%,rgba(255,255,255,.03) 62%,rgba(var(--hkc-accent),.45));\
-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}\
.hkc.on{opacity:1;transform:none}\
.hkc *{box-sizing:border-box;margin:0;padding:0}\
.hkc-label{display:flex;align-items:center;gap:.6rem;font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--hkc-ink-2);margin-bottom:.7rem}\
.hkc-label::before{content:"";width:6px;height:6px;background:rgb(var(--hkc-accent));box-shadow:0 0 12px rgba(var(--hkc-accent),.9)}\
.hkc-label{padding-right:2rem}\
.hkc-text{font-size:.86rem;line-height:1.6;color:var(--hkc-ink-2)}\
.hkc-x{position:absolute;top:.7rem;right:.7rem;width:2rem;height:2rem;display:grid;place-items:center;border-radius:50%;border:0;background:none;color:var(--hkc-ink-2);cursor:pointer;transition:color .3s,background .3s}\
.hkc-x:hover{color:var(--hkc-ink);background:rgba(255,255,255,.08)}\
.hkc-x svg{width:.8rem;height:.8rem}\
.hkc-actions{display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-top:1rem}\
.hkc-btn{font:inherit;font-size:.84rem;font-weight:500;letter-spacing:.005em;color:var(--hkc-ink);cursor:pointer;\
padding:.7rem 1rem;border-radius:999px;border:1px solid var(--hkc-line);background:rgba(255,255,255,.05);\
box-shadow:inset 0 1px 0 rgba(255,255,255,.1);transition:background .3s,border-color .3s,transform .4s var(--hkc-ease)}\
.hkc-btn:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.26)}\
.hkc-btn:active{transform:scale(.97)}\
.hkc :focus-visible{outline:1.5px solid rgb(var(--hkc-accent));outline-offset:3px}\
@media (max-width:560px){.hkc{left:calc(1rem + env(safe-area-inset-left));right:calc(1rem + env(safe-area-inset-right));bottom:calc(1rem + env(safe-area-inset-bottom));width:auto}}\
@media (prefers-reduced-motion:reduce){.hkc{transition:none}}';

  var CROSS = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7"/></svg>';

  var el = null;
  var opener = null; /* footer link that reopened the banner, gets the focus back */

  function lang() { return /^fr/i.test(document.documentElement.lang) ? 'fr' : 'en'; }

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function render() {
    var t = COPY[lang()];
    el.setAttribute('aria-label', t.label);
    el.innerHTML =
      '<p class="hkc-label" aria-hidden="true">' + t.label + '</p>' +
      '<p class="hkc-text">' + esc(t.text) + '</p>' +
      /* Closing without choosing counts as declining. */
      '<button type="button" class="hkc-x" data-choice="0" aria-label="' + t.close + '">' + CROSS + '</button>' +
      '<div class="hkc-actions">' +
      '<button type="button" class="hkc-btn" data-choice="0">' + t.refuse + '</button>' +
      '<button type="button" class="hkc-btn" data-choice="1">' + t.accept + '</button>' +
      '</div>';
  }

  function show(focus) {
    if (!el) {
      var style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);
      el = document.createElement('section');
      el.className = 'hkc';
      el.setAttribute('role', 'region');
      render();
      el.addEventListener('click', onClick);
      document.body.appendChild(el);
      /* The home sets <html lang> from its language toggle: follow it. */
      new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
    el.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('on'); }); });
    if (focus) el.querySelector('.hkc-btn').focus();
  }

  function hide() {
    el.classList.remove('on');
    setTimeout(function () { if (!el.classList.contains('on')) el.hidden = true; }, 600);
  }

  function onClick(e) {
    var btn = e.target.closest('[data-choice]');
    if (!btn) return;
    var analytics = btn.getAttribute('data-choice') === '1';
    var changed = state.analytics !== null && state.analytics !== analytics;
    store(analytics);
    apply(analytics, changed);
    hide();
    if (opener) { opener.focus(); opener = null; }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-consent-open]');
    if (!link) return;
    e.preventDefault();
    opener = link;
    show(true);
  });

  /* First visit: wait for the page to settle, and for the home's intro to end
     (it locks the page with body.intro-lock once React has mounted). */
  function whenReady(fn) {
    var check = function () {
      if (!document.body.classList.contains('intro-lock')) { fn(); return; }
      var mo = new MutationObserver(function () {
        if (document.body.classList.contains('intro-lock')) return;
        mo.disconnect();
        setTimeout(fn, 700);
      });
      mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    };
    var go = function () { setTimeout(check, 900); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();
  }

  if (state.analytics === null) whenReady(function () { if (read() === null) show(false); });
})();
