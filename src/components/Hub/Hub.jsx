const modes = [
  {
    id: 'mal-trivia',
    title: 'MAL Matchups',
    description: 'Guess how a gathered watch list treats a title.',
    meta: 'Personal lists',
  },
  {
    id: 'comparator',
    title: 'Series Signals',
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
      <div className="hub-heading">
        <p className="eyebrow">Anime trivia cabinet</p>
        <h1 id="hub-title">AniMayhem</h1>
        <p>
          Three compact trivia modes built from static data: personal MAL list reads,
          series attribute deduction, and curated screenshot guessing.
        </p>
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
