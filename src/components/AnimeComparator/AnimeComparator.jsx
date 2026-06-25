import { useMemo, useState } from 'react';
import { ModeHeader } from '../shared/ModeHeader.jsx';
import { compareGuess } from './comparison.js';

export function AnimeComparator({ comparatorData, onBack }) {
  const target = comparatorData[0];
  const [guessTitle, setGuessTitle] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState('');

  const guessedIds = useMemo(() => new Set(guesses.map((guess) => guess.mal_id)), [guesses]);
  const availableTitles = comparatorData.map((anime) => anime.title);
  const solved = guesses.some((guess) => guess.mal_id === target.mal_id);

  function submitGuess(event) {
    event.preventDefault();
    const normalized = guessTitle.trim().toLowerCase();
    const anime = comparatorData.find((item) => item.title.toLowerCase() === normalized);

    if (!anime) {
      setMessage('Choose a title from the list.');
      return;
    }

    if (guessedIds.has(anime.mal_id)) {
      setMessage('Already guessed.');
      return;
    }

    setGuesses((current) => [anime, ...current]);
    setGuessTitle('');
    setMessage(anime.mal_id === target.mal_id ? 'Solved.' : 'Keep comparing.');
  }

  return (
    <section className="mode-view" aria-labelledby="comparator-title">
      <ModeHeader eyebrow="Series deduction" title="Series Signals" onBack={onBack}>
        Session target, unlimited guesses, autocomplete from the static dataset.
      </ModeHeader>

      <div className="game-panel comparator-panel">
        <form className="guess-form" onSubmit={submitGuess}>
          <label htmlFor="anime-guess">Anime title</label>
          <div>
            <input
              autoComplete="off"
              disabled={solved}
              id="anime-guess"
              list="anime-title-options"
              onChange={(event) => setGuessTitle(event.target.value)}
              placeholder="Start typing a series"
              value={guessTitle}
            />
            <datalist id="anime-title-options">
              {availableTitles.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
            <button className="primary-button" disabled={solved} type="submit">
              Guess
            </button>
          </div>
        </form>

        {message ? <p className="status-line" role="status">{message}</p> : null}

        <div className="comparison-key" aria-label="Comparison key">
          <span><b className="key-dot key-dot--match" /> Match</span>
          <span><b className="key-dot key-dot--partial" /> Partial</span>
          <span><b className="key-dot key-dot--miss" /> No match</span>
        </div>

        <div className="comparison-list" aria-labelledby="comparator-title">
          <h2 id="comparator-title">Guesses</h2>
          {guesses.length === 0 ? <p className="empty-state">No guesses yet.</p> : null}
          {guesses.map((guess) => (
            <div className="comparison-row" key={guess.mal_id}>
              {compareGuess(guess, target).map((tile) => (
                <div className={`compare-tile compare-tile--${tile.state}`} key={tile.label}>
                  <span>{tile.label}</span>
                  <strong>{tile.value}</strong>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
