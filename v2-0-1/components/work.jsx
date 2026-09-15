import { useEffect, useRef, useState } from 'react';
import CONTENT from '../../content.js';
import posthog from '../../posthog.js';
import SectionHead from './section-head.jsx';
import { isFinePointer, prefersReducedMotion, track } from '../lib/hooks.js';
import { ArrowUpRight } from '../lib/icons.jsx';

export default function Work({ t, lang, openProject }) {
  const projects = CONTENT.projects.filter(p => p.is_visible !== false);
  const [hovered, setHovered] = useState(null);
  const preview = useRef(null);

  /* Floating preview follows the pointer with a lag and a velocity tilt. */
  useEffect(() => {
    const el = preview.current;
    if (!el || !isFinePointer()) return;
    let x = 0, y = 0, cx = 0, cy = 0, vx = 0, raf = 0;
    const reduce = prefersReducedMotion();
    /* Sit to the right of the pointer, flip to the left near the edge. */
    const onMove = (e) => {
      const w = el.offsetWidth || 340;
      const right = e.clientX + 36 + w / 2;
      x = right + w / 2 + 24 > window.innerWidth ? e.clientX - 36 - w / 2 : right;
      y = e.clientY;
    };
    const loop = () => {
      const nx = cx + (x - cx) * 0.12, ny = cy + (y - cy) * 0.12;
      vx = nx - cx; cx = nx; cy = ny;
      const rot = reduce ? 0 : Math.max(-8, Math.min(8, vx * 0.6));
      el.style.left = `${cx}px`; el.style.top = `${cy}px`;
      el.style.setProperty('--tilt', `${rot}deg`);
      el.style.transform = `translate3d(-50%, -50%, 0) rotate(${rot}deg) scale(${el.classList.contains('on') ? 1 : 0.9})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const open = (proj) => {
    track(posthog, 'project opened', { project_name: proj.name, project_num: proj.num, project_category: proj.category, language: lang, version: 'v2' });
    openProject(proj);
  };

  return (
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead label={t.s02} title={t.workTitle} index="02" max="14ch" />

        <div className="work-list" data-reveal="line" />
        <div className="work-list" role="list">
          {projects.map((proj, i) => (
            <article
              key={proj.num}
              role="listitem"
              className="work-row"
              data-reveal="up"
              style={{ '--i': Math.min(i, 5) }}
              data-cursor={`label:${t.viewLabel}`}
              tabIndex={0}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => open(proj)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(proj); } }}
              aria-label={`${proj.name} — ${t.viewCase}`}
            >
              <span className="num">{proj.num}</span>
              <div className="main">
                <div className="title-line">
                  <h3 className="name">{proj.name}</h3>
                  <span className="cat">{proj.category}</span>
                </div>
                <p className="desc">{proj.desc[lang] || proj.desc.en}</p>
                <div className="tags">
                  {proj.productOwner && <span className="tag po">{t.poTag}</span>}
                  {proj.stack.map(s => <span className="tag" key={s}>{s}</span>)}
                </div>
              </div>
              <div className="side">
                <span className="year tnum">{proj.year}</span>
                <span className="arrow" aria-hidden="true"><ArrowUpRight /></span>
              </div>
              {proj.heroImage && (
                <div className="thumb glass"><img src={proj.heroImage} alt="" loading="lazy" /></div>
              )}
            </article>
          ))}
        </div>
      </div>

      <div ref={preview} className={`work-preview glass${hovered !== null ? ' on' : ''}`} aria-hidden="true">
        {projects.map((p, i) => p.heroImage && (
          <img key={p.num} src={p.heroImage} alt="" loading="lazy" className={hovered === i ? 'on' : ''} />
        ))}
        <span className="lbl">{hovered !== null ? `${t.caseLabel} ${projects[hovered].num}` : ''}</span>
      </div>
    </section>
  );
}
