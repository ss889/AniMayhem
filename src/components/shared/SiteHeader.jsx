function uniqueComparatorGenres(comparatorData) {
  return Array.from(new Set(comparatorData.flatMap((anime) => anime.genres))).sort();
}

function uniqueComparatorStudios(comparatorData) {
  return Array.from(new Set(comparatorData.map((anime) => anime.studio))).sort();
}

function uniqueImageGenres(imageGuessData) {
  return Array.from(new Set(imageGuessData.flatMap((entry) => entry.genre))).sort();
}

function uniqueImageStudios(imageGuessData) {
  return Array.from(new Set(imageGuessData.map((entry) => entry.studio))).sort();
}

export function SiteHeader({
  activeMode,
  comparatorData,
  imageGuessData,
  onNavigate,
}) {
  const comparatorGenres = uniqueComparatorGenres(comparatorData);
  const comparatorStudios = uniqueComparatorStudios(comparatorData);
  const imageGenres = uniqueImageGenres(imageGuessData);
  const imageStudios = uniqueImageStudios(imageGuessData);

  function navigate(mode, filter = { type: 'all' }) {
    onNavigate(mode, filter);
  }

  return (
    <header className="site-header">
      <button className="brand-mark" onClick={() => navigate('hub')} type="button">
        AniMayhem
      </button>
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="nav-group">
          <button
            className={activeMode === 'comparator' ? 'nav-trigger nav-trigger--active' : 'nav-trigger'}
            onClick={() => navigate('comparator')}
            type="button"
          >
            Comparator <span aria-hidden="true">v</span>
          </button>
          <div className="nav-dropdown">
            <button onClick={() => navigate('comparator')} type="button">All Series</button>
            <button onClick={() => navigate('comparator')} type="button">Daily Challenge</button>
            <span>By Genre</span>
            {comparatorGenres.slice(0, 6).map((genre) => (
              <button
                key={`comparator-genre-${genre}`}
                onClick={() => navigate('comparator', { type: 'genre', value: genre })}
                type="button"
              >
                {genre}
              </button>
            ))}
            <span>By Studio</span>
            {comparatorStudios.slice(0, 6).map((studio) => (
              <button
                key={`comparator-studio-${studio}`}
                onClick={() => navigate('comparator', { type: 'studio', value: studio })}
                type="button"
              >
                {studio}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-group">
          <button
            className={activeMode === 'image-guess' ? 'nav-trigger nav-trigger--active' : 'nav-trigger'}
            onClick={() => navigate('image-guess')}
            type="button"
          >
            Image Guess <span aria-hidden="true">v</span>
          </button>
          <div className="nav-dropdown">
            <button onClick={() => navigate('image-guess')} type="button">All Series</button>
            <span>By Genre</span>
            {imageGenres.slice(0, 6).map((genre) => (
              <button
                key={`image-genre-${genre}`}
                onClick={() => navigate('image-guess', { type: 'genre', value: genre })}
                type="button"
              >
                {genre}
              </button>
            ))}
            <span>By Studio</span>
            {imageStudios.slice(0, 6).map((studio) => (
              <button
                key={`image-studio-${studio}`}
                onClick={() => navigate('image-guess', { type: 'studio', value: studio })}
                type="button"
              >
                {studio}
              </button>
            ))}
          </div>
        </div>

        <button
          className={activeMode === 'about' ? 'nav-trigger nav-trigger--active' : 'nav-trigger'}
          onClick={() => navigate('about')}
          type="button"
        >
          About
        </button>
      </nav>
    </header>
  );
}
