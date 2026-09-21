/* Left-hand section index: a vertical instrument rail with ticks. */
export default function Rail({ sections, active, labels }) {
  return (
    <nav className="rail" aria-label="Sections">
      {sections.map((id, i) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>
          <span className="tick" />
          <span className="lbl">{String(i).padStart(2, '0')} {labels[id]}</span>
        </a>
      ))}
    </nav>
  );
}
