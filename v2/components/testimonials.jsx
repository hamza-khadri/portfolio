import CONTENT from '../../content.js';

const initials = (name) => name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();

export default function Testimonials({ t, lang }) {
  const items = CONTENT.testimonials;
  return (
    <section id="testimonials" className="section">
      <div className="wrap">
        <div className="sec-label mono" data-reveal="fade" style={{ marginBottom: '2.6rem' }}>{t.s06}</div>
        <div className="quotes">
          {items.map((item, i) => (
            <figure className="quote glass" key={i} data-reveal="up" style={{ '--i': i + 1 }}>
              <span className="texture" aria-hidden="true" />
              <span className="mark" aria-hidden="true">”</span>
              <blockquote>{(item.quote[lang] || item.quote.en).replace(/^"|"$/g, '')}</blockquote>
              <figcaption className="who">
                <span className="avatar glass">{initials(item.name)}</span>
                <span><div className="name">{item.name}</div><div className="role">{item.role}</div></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
