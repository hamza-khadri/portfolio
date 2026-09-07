import SectionHead from './section-head.jsx';
import { Scope, Ship, Chain } from '../lib/icons.jsx';

export default function Approach({ t }) {
  const pillars = [
    { title: t.approach1Title, body: t.approach1Body, Icon: Scope },
    { title: t.approach2Title, body: t.approach2Body, Icon: Ship },
    { title: t.approach3Title, body: t.approach3Body, Icon: Chain },
  ];
  return (
    <section id="approach" className="section">
      <div className="wrap">
        <SectionHead label={t.s03} title={t.approachTitle} index="03" max="20ch" />
        <div className="approach">
          <span className="draw" data-reveal="line" aria-hidden="true" />
          {pillars.map(({ title, body, Icon }, i) => (
            <div className="pillar" key={i} data-reveal="up" style={{ '--i': i + 1 }}>
              <div className="node glass">
                <span className="ring" aria-hidden="true" />
                <Icon />
              </div>
              <div className="step">0{i + 1} / 03</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
