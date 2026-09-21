/* Shared header: small label with a lit square, split-line title, ghost index. */
export default function SectionHead({ label, title, index, max = '18ch' }) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <header className="sec-head">
      <div>
        <div className="sec-label label" data-reveal="fade">{label}</div>
        <h2 className="display h-1 lines" style={{ maxWidth: max }}>
          {lines.map((l, i) => (
            <span className="ln" key={i}><span className="ln-in" style={{ '--li': i }}>{l}</span></span>
          ))}
        </h2>
      </div>
      {index && <div className="sec-index" aria-hidden="true" data-reveal="fade">{index}</div>}
    </header>
  );
}
