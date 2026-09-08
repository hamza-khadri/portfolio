import { useEffect, useRef, useState } from 'react';
import posthog from '../../posthog.js';
import { track } from '../lib/hooks.js';
import { ArrowUpRight, Close } from '../lib/icons.jsx';

/* Case study as a right-hand glass sheet: the page stays visible behind it. */
export default function ProjectDrawer({ project, lang, t, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [on, setOn] = useState(false);
  const [current, setCurrent] = useState(null);
  const scroller = useRef(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    if (!project) return;
    setCurrent(project);
    setMounted(true);
    document.body.classList.add('no-scroll');
    const id = requestAnimationFrame(() => requestAnimationFrame(() => { setOn(true); closeBtn.current?.focus(); }));
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener('keydown', onKey); };
  }, [project]);

  const close = () => {
    setOn(false);
    document.body.classList.remove('no-scroll');
    setTimeout(() => { setMounted(false); onClose(); }, 650);
  };

  if (!mounted || !current) return null;
  const p = current;
  const tr = (f) => (!f ? '' : typeof f === 'string' ? f : f[lang] || f.en || '');
  const has = (f) => { const s = tr(f); return s && !s.toLowerCase().includes('placeholder'); };

  return (
    <>
      <div className={`drawer-veil${on ? ' on' : ''}`} onClick={close} aria-hidden="true" />
      <aside className={`drawer glass${on ? ' on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="head">
          <div className="crumbs">
            <span className="label">{t.caseLabel} {p.num}</span>
            <span className="label" style={{ color: 'var(--ink-4)' }}>/</span>
            <span className="label" style={{ color: 'var(--ink-3)' }}>{p.category}</span>
          </div>
          <button ref={closeBtn} className="btn btn-icon glass" onClick={close} aria-label={t.modalClose}><Close className="ico" /></button>
        </div>

        <div className="scroll" ref={scroller}>
          {p.productOwner && <span className="tag po">{t.poTag}</span>}
          <h2 id="drawer-title" className="display p-title">{p.name}</h2>

          <div className="meta">
            {has(p.role) && <div><div className="k">{t.modalRole}</div><div className="v">{tr(p.role)}</div></div>}
            {p.year && <div><div className="k">{t.metaYear}</div><div className="v tnum">{p.year}</div></div>}
            {p.stack?.length > 0 && <div><div className="k">{t.metaStack}</div><div className="v">{p.stack.join(' · ')}</div></div>}
          </div>

          {p.heroImage && (
            <div className="shot glass brackets"><span className="bk" aria-hidden="true" /><img src={p.heroImage} alt={p.name} /></div>
          )}

          <div className="blocks">
            {has(p.overview) && <div className="block"><h4>{t.modalOverview}</h4><p>{tr(p.overview)}</p></div>}
            {(has(p.challenge) || has(p.approach)) && (
              <div className="two">
                {has(p.challenge) && <div className="block"><h4>{t.modalChallenge}</h4><p>{tr(p.challenge)}</p></div>}
                {has(p.approach) && <div className="block"><h4>{t.modalApproach}</h4><p>{tr(p.approach)}</p></div>}
              </div>
            )}
            {p.detailImage && <div className="shot glass"><img src={p.detailImage} alt={`${p.name} detail`} /></div>}
            {has(p.results) && <div className="block"><h4>{t.modalResults}</h4><p>{tr(p.results)}</p></div>}
          </div>

          {p.liveUrl && (
            <div className="cta">
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary glass"
                onClick={() => track(posthog, 'project live url clicked', { project_name: p.name, project_url: p.liveUrl, version: 'v2' })}>
                <span className="btn-sheen" aria-hidden="true" />
                <span className="btn-txt"><span>{t.modalLive.replace(/\s*→$/, '')}</span><span aria-hidden="true">{t.modalLive.replace(/\s*→$/, '')}</span></span>
                <ArrowUpRight className="ico" />
              </a>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
