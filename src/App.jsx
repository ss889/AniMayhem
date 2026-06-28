import { useState } from 'react';
import { About } from './components/About/About.jsx';
import { Comparator } from './components/Comparator/Comparator.jsx';
import { compareGuess } from './components/Comparator/comparison.js';
import { Hub } from './components/Hub/Hub.jsx';
import { ImageGuess } from './components/ImageGuess/ImageGuess.jsx';
import { SiteHeader } from './components/shared/SiteHeader.jsx';
import comparatorData from './data/anime-comparator.json';
import imageGuessData from './data/image-guess.json';

const modeViews = {
  about: About,
  comparator: Comparator,
  'image-guess': ImageGuess,
};

export default function App() {
  const [activeMode, setActiveMode] = useState('hub');
  const [modeFilter, setModeFilter] = useState({ type: 'all' });
  const ActiveView = modeViews[activeMode];

  const stats = {
    comparator: `${comparatorData.length} series`,
    'image-guess': `${imageGuessData.length} images and growing`,
  };
  const demoStates = compareGuess(comparatorData[1], comparatorData[0]).map((tile) => tile.state);
  const heroDemoStates = [...demoStates, ...demoStates].slice(0, 9);

  function navigate(mode, filter = { type: 'all' }) {
    setActiveMode(mode);
    setModeFilter(filter);
  }

  return (
    <>
      <SiteHeader
        activeMode={activeMode}
        comparatorData={comparatorData}
        imageGuessData={imageGuessData}
        onNavigate={navigate}
      />
      <main className="app-shell">
        <div className="view-transition" key={`${activeMode}-${modeFilter.type}-${modeFilter.value ?? 'all'}`}>
          {activeMode === 'hub' ? (
            <Hub demoStates={heroDemoStates} onSelectMode={navigate} stats={stats} />
          ) : (
            <ActiveView
              comparatorData={comparatorData}
              filter={modeFilter}
              imageGuessData={imageGuessData}
              onBack={() => navigate('hub')}
            />
          )}
        </div>
      </main>
    </>
  );
}
