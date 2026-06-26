import { useEffect, useMemo, useState } from 'react';
import { ModeHeader } from '../shared/ModeHeader.jsx';
import { compareGuess, filterComparatorData } from './comparison.js';

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function filterLabel(filter) {
  if (!filter || filter.type === 'all') {
    return 'All Series';
  }

  return `${filter.type === 'genre' ? 'Genre' : 'Studio'}: ${filter.value}`;
}

export function Comparator({ comparatorData, filter, onBack }) {
  const scopedData = useMemo(
    () => filterComparatorData(comparatorData, filter),
    [comparatorData, filter],
  );
  const [target, setTarget] = useState(() => pickRandom(scopedData));
  const [guessTitle, setGuessTitle] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTarget(pickRandom(scopedData));
    setGuessTitle('');
    setGuesses([]);
    setMessage('');
  }, [scopedData]);

  const guessedIds = useMemo(() => new Set(guesses.map((guess) => guess.mal_id)), [guesses]);
  const solved = guesses.some((guess) => guess.mal_id === target.mal_id);

  function startNewSession() {
    setTarget(pickRandom(scopedData));
    setGuessTitle('');
    setGuesses([]);
    setMessage('');
  }

  function submitGuess(event) {
    event.preventDefault();
    const normalized = guessTitle.trim().toLowerCase();
    const anime = scopedData.find((item) => item.title.toLowerCase() === normalized);

    if (!anime) {
      setMessage('Choose a title from this filtered list.');
      return;
    }

    if (guessedIds.has(anime.mal_id)) {
      setMessage('Already guessed.');
      return;
    }

    setGuesses((current) => [anime, ...current]);
    setGuessTitle('');
    setMessage(anime.mal_id === target.mal_id ? 'Solved. Start a new session?' : 'Keep comparing.');
  }

  return (
    <section className="mode-view" aria-labelledby="comparator-title">
      <ModeHeader eyebrow="Series deduction" title="Comparator" onBack={onBack}>
        Session target, unlimited guesses, scoped to {filterLabel(filter)}.
      </ModeHeader>

      <div className="game-panel comparator-panel">
        <div className="score-strip">
          <span>{filterLabel(filter)}</span>
          <strong>{scopedData.length} titles</strong>
        </div>

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
              {scopedData.map((anime) => (
                <option key={anime.mal_id} value={anime.title} />
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
          <div className="section-heading">
            <h2 id="comparator-title">Guesses</h2>
            <button className="text-button" onClick={startNewSession} type="button">
              Play again
            </button>
          </div>
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
