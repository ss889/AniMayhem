import { useMemo, useState } from 'react';
import { Hub } from './components/Hub/Hub.jsx';
import { MalTrivia } from './components/MalTrivia/MalTrivia.jsx';
import { AnimeComparator } from './components/AnimeComparator/AnimeComparator.jsx';
import { ImageGuess } from './components/ImageGuess/ImageGuess.jsx';
import userA from './data/mal-lists/akira.json';
import userB from './data/mal-lists/mika.json';
import comparatorData from './data/anime-comparator.json';
import imageGuessData from './data/image-guess.json';

const modeViews = {
  'mal-trivia': MalTrivia,
  comparator: AnimeComparator,
  'image-guess': ImageGuess,
};

export default function App() {
  const [activeMode, setActiveMode] = useState('hub');
  const malLists = useMemo(() => [userA, userB], []);
  const ActiveView = modeViews[activeMode];

  const stats = {
    'mal-trivia': `${malLists.length} MAL lists`,
    comparator: `${comparatorData.length} series`,
    'image-guess': `${imageGuessData.length} images and growing`,
  };

  return (
    <main className="app-shell">
      {activeMode === 'hub' ? (
        <Hub onSelectMode={setActiveMode} stats={stats} />
      ) : (
        <ActiveView
          comparatorData={comparatorData}
          imageGuessData={imageGuessData}
          malLists={malLists}
          onBack={() => setActiveMode('hub')}
        />
      )}
    </main>
  );
}
