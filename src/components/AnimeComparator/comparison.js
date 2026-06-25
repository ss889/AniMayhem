export function compareGuess(guess, target) {
  const sharedGenres = guess.genres.filter((genre) => target.genres.includes(genre));

  return [
    {
      label: 'Title',
      value: guess.title,
      state: guess.mal_id === target.mal_id ? 'match' : 'miss',
    },
    {
      label: 'Genres',
      value: guess.genres.join(', '),
      state:
        sharedGenres.length === guess.genres.length && sharedGenres.length === target.genres.length
          ? 'match'
          : sharedGenres.length > 0
            ? 'partial'
            : 'miss',
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
