import { useState } from 'react';
import CONTENT from '../../content.js';
import posthog from '../../posthog.js';
import { track, useClock, useMagnetic } from '../lib/hooks.js';
import { ArrowUpRight, Check, Copy, Mail } from '../lib/icons.jsx';

export default function Contact({ t }) {
  const [copied, setCopied] = useState(false);
  const time = useClock('Europe/Brussels');
  const magCopy = useMagnetic(0.3);

  const copy = async () => {
    try { await navigator.clipboard.writeText(t.contactEmail); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (_) {}
    track(posthog, 'contact email copied', { version: 'v2' });
  };

  return (
    <>
      <section id="contact" className="section">
        <div className="wrap">
          <div className="sec-label label" data-reveal="fade">{t.s07}</div>
          <h2 className="display contact-title lines" style={{ marginTop: '1.4rem' }}>
            <span className="ln"><span className="ln-in">{t.contactTitle}</span></span>
          </h2>

          <div className="contact-email" data-reveal="up" style={{ '--i': 2 }}>
            <a href={`mailto:${t.contactEmail}`} className="mail" onClick={() => track(posthog, 'contact email clicked', { version: 'v2' })}>
              {t.contactEmail}
            </a>
            <button className="btn glass" onClick={copy} ref={magCopy} aria-live="polite">
              <span className="btn-sheen" aria-hidden="true" />
              <span className="btn-txt"><span>{copied ? t.copied : t.copyEmail}</span><span aria-hidden="true">{copied ? t.copied : t.copyEmail}</span></span>
              {copied ? <Check className="ico" style={{ color: 'var(--signal)' }} /> : <Copy className="ico" />}
            </button>
          </div>

          <div className="contact-grid">
            <div className="socials" data-reveal="up" style={{ '--i': 3 }}>
              {CONTENT.socials.map((s, i) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social"
                  onClick={() => track(posthog, 'social link clicked', { platform: s.label, version: 'v2' })}>
                  <span className="i">{String(i + 1).padStart(2, '0')}</span>
                  <span className="n">{s.label}</span>
                  <ArrowUpRight className="a" />
                </a>
              ))}
            </div>
            <div className="open-to glass" data-reveal="up" style={{ '--i': 4 }}>
              <div className="label"><Mail style={{ width: 14, height: 14, color: 'var(--accent)' }} />{t.openTo}</div>
              <p>{t.currentlyOpen.replace(/^Currently open to:\s*|^Ouvert à :\s*/i, '')}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap cols">
          <div>
            <span className="label">{t.footer}</span>
            <span className="note">{t.footerNote}</span>
          </div>
          <div className="clock glass">
            <span className="led" aria-hidden="true" />
            <span className="label tnum">{t.localTime} {time}</span>
          </div>
          <div>
            <span className="label">{t.roleLine}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
