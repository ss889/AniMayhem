const modes = [
  {
    id: 'comparator',
    title: 'Comparator',
    description: 'Find the hidden anime by comparing genres, years, studios, and episode counts.',
  },
  {
    id: 'image-guess',
    title: 'Screenshot Snap',
    description: 'Pick the right series from curated image clues.',
  },
];

export function Hub({ demoStates, onSelectMode, stats }) {
  return (
    <section className="hub-view" aria-labelledby="hub-title">
      <div className="hero-layout">
        <div className="hub-heading">
          <p className="eyebrow">Anime trivia cabinet</p>
          <h1 id="hub-title">AniMayhem</h1>
        </div>

        <div className="mechanic-demo" aria-hidden="true">
          {demoStates.map((state, index) => (
            <span className={`demo-tile demo-tile--${state}`} key={`${state}-${index}`} />
          ))}
        </div>
      </div>

      <div className="mode-grid" aria-label="Game modes">
        {modes.map((mode) => (
          <button
            className={`mode-card mode-card--${mode.id}`}
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            type="button"
          >
            <div className={`mode-card-preview mode-card-preview--${mode.id}`} aria-hidden="true">
              {mode.id === 'comparator' ? (
                <>
                  <span />
                  <span />
                  <span />
                </>
              ) : (
                <>
                  <span />
                  <span />
                </>
              )}
            </div>
            <strong>{mode.title}</strong>
            <small>{stats[mode.id]}</small>
            <p>{mode.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
