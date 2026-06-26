const modes = [
  {
    id: 'comparator',
    title: 'Comparator',
    description: 'Find the hidden anime by comparing genres, years, studios, and episode counts.',
    meta: 'Wordle-style',
  },
  {
    id: 'image-guess',
    title: 'Screenshot Snap',
    description: 'Pick the right series from curated image clues.',
    meta: 'Image round',
  },
];

export function Hub({ onSelectMode, stats }) {
  return (
    <section className="hub-view" aria-labelledby="hub-title">
      <div className="hero-layout">
        <div className="hub-heading">
          <p className="eyebrow">Anime trivia cabinet</p>
          <h1 id="hub-title">AniMayhem</h1>
          <p>
            Static-data anime trivia built around deduction grids, filtered datasets,
            and curated image prompts.
          </p>
        </div>

        <div className="mechanic-demo" aria-hidden="true">
          {['miss', 'partial', 'match', 'miss', 'match', 'partial', 'miss', 'partial', 'match'].map((state, index) => (
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
            <span>{mode.meta}</span>
            <strong>{mode.title}</strong>
            <small>{stats[mode.id]}</small>
            <p>{mode.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
