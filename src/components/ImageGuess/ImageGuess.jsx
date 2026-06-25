import { useState } from 'react';
import { FeedbackBadge } from '../shared/FeedbackBadge.jsx';
import { ModeHeader } from '../shared/ModeHeader.jsx';

export function ImageGuess({ imageGuessData, onBack }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const current = imageGuessData[index % imageGuessData.length];
  const isCorrect = selected === current.answer;

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
    setIndex((value) => value + 1);
    setSelected(null);
  }

  return (
    <section className="mode-view" aria-labelledby="image-title">
      <ModeHeader eyebrow="Curated image trivia" title="Screenshot Snap" onBack={onBack}>
        A small starter set that stays readable while the image library grows.
      </ModeHeader>

      <div className="game-panel image-panel">
        <div className="score-strip">
          <span>Score {score.correct}/{score.total}</span>
          <strong>Streak {score.streak}</strong>
        </div>

        <figure className="image-clue">
          <img alt={`${current.type} clue`} src={current.image_path} />
          <figcaption>{current.type}</figcaption>
        </figure>

        <h2 id="image-title">Which series is this from?</h2>
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
