import CONTENT from '../../content.js';
import SectionHead from './section-head.jsx';
import { Compass, Pen, Spark, ArrowUpRight } from '../lib/icons.jsx';

export default function Services({ t, lang }) {
  const cards = CONTENT.services;
  const icons = [Compass, Pen, Spark];
  return (
    <section id="services" className="section">
      <div className="wrap">
        <SectionHead label={t.s05} title={t.servicesTitle} index="05" max="16ch" />
        <div className="services">
          {cards.map((card, i) => {
            const Icon = icons[i] || Spark;
            const price = card.price[lang] || card.price.en;
            return (
              <a href="#contact" className="svc glass glass-deep" key={i} data-reveal="up" style={{ '--i': i + 1 }}>
                <div className="top">
                  <span className="glyph glass"><Icon /></span>
                  <span className="idx">{card.num} / 03</span>
                </div>
                <h3>{card.title[lang] || card.title.en}</h3>
                <p>{card.body[lang] || card.body.en}</p>
                <div className="foot">
                  <span className="label">{price || t.ctaContact}</span>
                  <span className="go" aria-hidden="true"><ArrowUpRight /></span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
