import posthog from 'posthog-js';

/* Started only once the visitor accepts analytics (public/consent.js sets `window.hkConsent`
   and fires `hk:consent`). Until then `capture` is a no-op, so call sites don't need to check. */
let started = false;

function setConsent(analytics) {
  if (analytics && !started) {
    started = true;
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      enableExceptionAutocapture: true,
    });
  } else if (analytics) {
    posthog.opt_in_capturing();
  } else if (started) {
    posthog.opt_out_capturing();
    posthog.reset();
  }
}

if (typeof window !== 'undefined') {
  if (window.hkConsent?.analytics) setConsent(true);
  window.addEventListener('hk:consent', (e) => setConsent(e.detail.analytics));
}

export default posthog;
