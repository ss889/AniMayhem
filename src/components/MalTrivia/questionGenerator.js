function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickEntryPair(entries) {
  const first = randomItem(entries);
  const alternatives = entries.filter((entry) => entry.mal_id !== first.mal_id);
  return [first, randomItem(alternatives)];
}

function makeCompletedQuestion(userList) {
  const entry = randomItem(userList.entries);
  const answer = entry.status === 'completed' ? 'Yes' : 'No';

  return {
    prompt: `Has ${userList.username} completed ${entry.title}?`,
    choices: ['Yes', 'No'],
    answer,
    detail: `${entry.title} is marked as ${entry.status.replaceAll('_', ' ')}.`,
  };
}

function makeHigherLowerQuestion(userList) {
  const scoredEntries = userList.entries.filter((entry) => typeof entry.score === 'number');

  if (scoredEntries.length < 2) {
    return makeCompletedQuestion(userList);
  }

  const [first, second] = pickEntryPair(scoredEntries);
  const answer = first.score > second.score ? 'Higher' : first.score < second.score ? 'Lower' : 'Same';

  return {
    prompt: `Did ${userList.username} rate ${first.title} higher or lower than ${second.title}?`,
    choices: ['Higher', 'Lower', 'Same'],
    answer,
    detail: `${first.title}: ${first.score}. ${second.title}: ${second.score}.`,
  };
}

export function generateMalQuestion(userLists) {
  const eligibleLists = userLists.filter((userList) => userList.entries.length > 0);
  const userList = randomItem(eligibleLists);
  const builders = [makeCompletedQuestion, makeHigherLowerQuestion];

  return randomItem(builders)(userList);
}
