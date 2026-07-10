import { useEffect, useMemo, useState } from 'react';
import { FeedbackBadge } from '../shared/FeedbackBadge.jsx';
import { ModeHeader } from '../shared/ModeHeader.jsx';

const themeLabels = {
  all: 'All Images',
  characters: 'Characters',
  crowd: 'Crowd',
  objects: 'Objects',
  quotes: 'Quotes',
  scenes: 'Scenes',
  weapons: 'Weapons',
};

const themeDescriptions = {
  all: 'Mixed image clues from every playable pack.',
  characters: 'Character-focused clues only.',
  crowd: 'Find the anime from group or crowd shots.',
  objects: 'Recognizable objects and props.',
  quotes: 'Quote-card clues.',
  scenes: 'Scene and frame clues.',
  weapons: 'Weapon clues only.',
};

const BASE_ROUND_POINTS = 100;
const HINT_COST = 15;
const WRONG_COST = 10;

function shuffleItems(items) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ item }) => item);
}

function makeRounds(items) {
  return shuffleItems(items).map((entry) => ({
    ...entry,
    choices: shuffleItems(entry.choices),
  }));
}

function filterImageData(data, filter) {
  if (!filter || filter.type === 'all') {
    return data;
  }

  if (filter.type === 'genre') {
    return data.filter((entry) => entry.genre.includes(filter.value));
  }

  if (filter.type === 'studio') {
    return data.filter((entry) => entry.studio === filter.value);
  }

  return data;
}

function makeHints(entry) {
  if (entry.hints?.length) {
    return entry.hints;
  }

  return [
    `Genre: ${entry.genre.slice(0, 2).join(', ')}`,
    `Studio: ${entry.studio}`,
    `Answer starts with ${entry.answer[0]}`,
  ];
}

function getThemeCounts(entries) {
  return entries.reduce((counts, entry) => {
    const theme = entry.theme ?? entry.type;
    counts.set(theme, (counts.get(theme) ?? 0) + 1);
    return counts;
  }, new Map([['all', entries.length]]));
}

function getRoundScore(unlockedHintCount, wrongGuessCount) {
  return Math.max(10, BASE_ROUND_POINTS - unlockedHintCount * HINT_COST - wrongGuessCount * WRONG_COST);
}

export function ImageGuess({ filter, imageGuessData, onBack }) {
  const scopedData = useMemo(() => filterImageData(imageGuessData, filter), [filter, imageGuessData]);
  const themeCounts = useMemo(() => getThemeCounts(scopedData), [scopedData]);
  const themes = useMemo(() => ['all', ...Array.from(themeCounts.keys()).filter((theme) => theme !== 'all').sort()], [themeCounts]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const activeTheme = selectedTheme && themes.includes(selectedTheme) ? selectedTheme : null;
  const themedData = !activeTheme || activeTheme === 'all'
    ? scopedData
    : scopedData.filter((entry) => (entry.theme ?? entry.type) === activeTheme);
  const [rounds, setRounds] = useState(() => makeRounds(scopedData));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [unlockedHints, setUnlockedHints] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState({ points: 0, correct: 0, total: 0, streak: 0 });
  const current = rounds[index % rounds.length];
  const isCorrect = selected === current?.answer;
  const hints = current ? makeHints(current) : [];
  const roundScore = getRoundScore(unlockedHints, wrongGuesses);

  useEffect(() => {
    setSelectedTheme(null);
  }, [filter]);

  useEffect(() => {
    setRounds(makeRounds(themedData));
    setIndex(0);
    setSelected(null);
    setUnlockedHints(0);
    setWrongGuesses(0);
  }, [activeTheme, filter, imageGuessData]);

  function startPack(theme) {
    setSelectedTheme(theme);
    setScore({ points: 0, correct: 0, total: 0, streak: 0 });
  }

  function choose(choice) {
    if (selected || !current) return;
    const correct = choice === current.answer;
    setSelected(choice);
    setWrongGuesses((value) => value + (correct ? 0 : 1));
    setScore((value) => ({
      points: value.points + (correct ? roundScore : 0),
      correct: value.correct + (correct ? 1 : 0),
      total: value.total + 1,
      streak: correct ? value.streak + 1 : 0,
    }));
  }

  function unlockHint() {
    if (selected || unlockedHints >= hints.length) return;
    setUnlockedHints((value) => value + 1);
  }

  function nextImage() {
    if (index + 1 >= rounds.length) {
      setRounds(makeRounds(themedData));
      setIndex(0);
    } else {
      setIndex((value) => value + 1);
    }

    setSelected(null);
    setUnlockedHints(0);
    setWrongGuesses(0);
  }

  if (!activeTheme) {
    return (
      <section className="mode-view" aria-labelledby="image-pack-title">
        <ModeHeader eyebrow="Curated image trivia" title="Screenshot Snap" onBack={onBack} />

        <div className="pack-grid" aria-label="Image guess packs">
          {themes.map((theme) => (
            <button className="pack-card" key={theme} onClick={() => startPack(theme)} type="button">
              <span>{themeCounts.get(theme)} clues</span>
              <strong>{themeLabels[theme] ?? theme}</strong>
              <p>{themeDescriptions[theme] ?? 'A focused image quiz pack.'}</p>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mode-view" aria-labelledby="image-title">
      <ModeHeader eyebrow={themeLabels[activeTheme] ?? activeTheme} title="Screenshot Snap" onBack={() => setSelectedTheme(null)} />

      <div className="game-panel image-panel">
        <div className="score-strip">
          <span>Score {score.points} pts</span>
          <strong>{score.correct}/{score.total} - Streak {score.streak}</strong>
        </div>

        <figure className="image-clue">
          <img alt="Anime clue" src={current.image_path} />
        </figure>

        <div className="round-toolbar">
          <div>
            <span>Round value</span>
            <strong>{roundScore} pts</strong>
          </div>
          <button className="outline-button" disabled={selected || unlockedHints >= hints.length} onClick={unlockHint} type="button">
            Unlock hint -{HINT_COST}
          </button>
        </div>

        {unlockedHints > 0 ? (
          <div className="hint-list" aria-label="Unlocked hints">
            {hints.slice(0, unlockedHints).map((hint) => (
              <span key={hint}>{hint}</span>
            ))}
          </div>
        ) : null}

        <h2 id="image-title">{current.question}</h2>
        <div className="choice-grid">
          {current.choices.map((choice) => (
            <button
              className={`choice-button ${selected === choice ? 'choice-button--selected' : ''}`}
              disabled={Boolean(selected)}
              key={choice}
              onClick={() => choose(choice)}
              type="button"
            >
              {choice}
            </button>
          ))}
        </div>
        <FeedbackBadge state={selected ? (isCorrect ? 'correct' : 'incorrect') : null}>
          {isCorrect ? `Correct. +${roundScore} pts.` : `Not quite. Answer: ${current.answer}.`}
        </FeedbackBadge>
        <button className="primary-button" disabled={!selected} onClick={nextImage} type="button">
          Next image
        </button>
      </div>
    </section>
  );
}
