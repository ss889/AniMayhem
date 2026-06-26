export function compareGuess(guess, target) {
  const sharedGenres = guess.genres.filter((genre) => target.genres.includes(genre));
  const genreState =
    sharedGenres.length === guess.genres.length && sharedGenres.length === target.genres.length
      ? 'match'
      : sharedGenres.length > 0
        ? 'partial'
        : 'miss';

  return [
    {
      label: 'Title',
      value: guess.title,
      state: guess.mal_id === target.mal_id ? 'match' : 'miss',
    },
    {
      label: 'Genres',
      value: guess.genres.join(', '),
      state: genreState,
    },
    {
      label: 'Studio',
      value: guess.studio,
      state: guess.studio === target.studio ? 'match' : 'miss',
    },
    {
      label: 'Year',
      value: `${guess.year}${guess.year === target.year ? '' : target.year > guess.year ? ' ↑' : ' ↓'}`,
      state: guess.year === target.year ? 'match' : 'miss',
    },
    {
      label: 'Episodes',
      value: `${guess.episodes}${guess.episodes === target.episodes ? '' : target.episodes > guess.episodes ? ' ↑' : ' ↓'}`,
      state: guess.episodes === target.episodes ? 'match' : 'miss',
    },
    {
      label: 'Demo',
      value: guess.demographic,
      state: guess.demographic === target.demographic ? 'match' : 'miss',
    },
  ];
}

export function filterComparatorData(data, filter) {
  if (!filter || filter.type === 'all') {
    return data;
  }

  if (filter.type === 'genre') {
    return data.filter((anime) => anime.genres.includes(filter.value));
  }

  if (filter.type === 'studio') {
    return data.filter((anime) => anime.studio === filter.value);
  }

  return data;
}
