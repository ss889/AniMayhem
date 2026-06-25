export function ModeHeader({ eyebrow, title, children, onBack }) {
  return (
    <header className="mode-header">
      <button className="back-button" onClick={onBack} type="button">
        <span aria-hidden="true">←</span>
        Hub
      </button>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children ? <p>{children}</p> : null}
      </div>
    </header>
  );
}
