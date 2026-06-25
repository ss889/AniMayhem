import { useMemo, useState } from 'react';
import { FeedbackBadge } from '../shared/FeedbackBadge.jsx';
import { ModeHeader } from '../shared/ModeHeader.jsx';
import { generateMalQuestion } from './questionGenerator.js';

export function MalTrivia({ malLists, onBack }) {
  const [question, setQuestion] = useState(() => generateMalQuestion(malLists));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const isCorrect = selected === question.answer;
  const feedback = useMemo(() => {
    if (!selected) return null;
    return isCorrect ? 'correct' : 'incorrect';
  }, [isCorrect, selected]);

  function answer(choice) {
    if (selected) return;
    setSelected(choice);
    setScore((current) => ({
      correct: current.correct + (choice === question.answer ? 1 : 0),
      total: current.total + 1,
    }));
  }

  function nextQuestion() {
    setQuestion(generateMalQuestion(malLists));
    setSelected(null);
  }

  return (
    <section className="mode-view" aria-labelledby="mal-title">
      <ModeHeader eyebrow="Personal list trivia" title="MAL Matchups" onBack={onBack}>
        Random questions from static, pre-gathered MAL-style lists.
      </ModeHeader>

      <div className="game-panel">
        <div className="score-strip">
          <span>Score</span>
          <strong>{score.correct}/{score.total}</strong>
        </div>
        <h2 id="mal-title">{question.prompt}</h2>
        <div className="choice-grid">
          {question.choices.map((choice) => (
            <button
              className={`choice-button ${selected === choice ? 'choice-button--selected' : ''}`}
              disabled={Boolean(selected)}
              key={choice}
              onClick={() => answer(choice)}
              type="button"
            >
              {choice}
            </button>
          ))}
        </div>
        <FeedbackBadge state={feedback}>
          {isCorrect ? 'Correct.' : `Not quite. Answer: ${question.answer}.`} {question.detail}
        </FeedbackBadge>
        <button className="primary-button" disabled={!selected} onClick={nextQuestion} type="button">
          Next question
        </button>
      </div>
    </section>
  );
}
