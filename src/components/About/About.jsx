import { ModeHeader } from '../shared/ModeHeader.jsx';

export function About({ onBack }) {
  return (
    <section className="mode-view about-view" aria-labelledby="about-title">
      <ModeHeader eyebrow="Static trivia cabinet" title="About" onBack={onBack}>
        AniMayhem is a GitHub Pages-friendly anime trivia hub built from committed JSON data.
      </ModeHeader>

      <div className="game-panel">
        <h2 id="about-title">No backend, no live API calls</h2>
        <p>
          Comparator data is curated ahead of time from MAL/Jikan-style series metadata.
          Image Guess entries use their own quiz prompts and image paths. Future account,
          OAuth, daily puzzle, and MAL-personalized features stay out of this v1 build.
        </p>
      </div>
    </section>
  );
}
