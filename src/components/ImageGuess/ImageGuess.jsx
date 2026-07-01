import { useEffect, useState } from 'react';
import { FeedbackBadge } from '../shared/FeedbackBadge.jsx';
import { ModeHeader } from '../shared/ModeHeader.jsx';

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

function filterLabel(filter) {
  if (!filter || filter.type === 'all') {
    return 'All Series';
  }

  return `${filter.type === 'genre' ? 'Genre' : 'Studio'}: ${filter.value}`;
}

export function ImageGuess({ filter, imageGuessData, onBack }) {
  const scopedData = filterImageData(imageGuessData, filter);
  const [rounds, setRounds] = useState(() => makeRounds(scopedData));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const current = rounds[index % rounds.length];
  const isCorrect = selected === current.answer;

  useEffect(() => {
    setRounds(makeRounds(scopedData));
    setIndex(0);
    setSelected(null);
  }, [filter, imageGuessData]);

  function choose(choice) {
    if (selected) return;
    const correct = choice === current.answer;
    setSelected(choice);
    setScore((value) => ({
      correct: value.correct + (correct ? 1 : 0),
      total: value.total + 1,
      streak: correct ? value.streak + 1 : 0,
    }));
  }

  function nextImage() {
    if (index + 1 >= rounds.length) {
      setRounds(makeRounds(scopedData));
      setIndex(0);
    } else {
      setIndex((value) => value + 1);
    }

    setSelected(null);
  }

  return (
    <section className="mode-view" aria-labelledby="image-title">
      <ModeHeader eyebrow="Curated image trivia" title="Screenshot Snap" onBack={onBack}>
        A small starter set scoped to {filterLabel(filter)}.
      </ModeHeader>

      <div className="game-panel image-panel">
        <div className="score-strip">
          <span>Score {score.correct}/{score.total}</span>
          <strong>Streak {score.streak} - {scopedData.length} images</strong>
        </div>

        <figure className="image-clue">
          <img alt={`${current.type} clue`} src={current.image_path} />
          <figcaption>{current.type}</figcaption>
        </figure>

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
          {isCorrect ? 'Correct.' : `Not quite. Answer: ${current.answer}.`}
        </FeedbackBadge>
        <button className="primary-button" disabled={!selected} onClick={nextImage} type="button">
          Next image
        </button>
      </div>
    </section>
  );
}
