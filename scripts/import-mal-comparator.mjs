import fs from 'node:fs/promises';

const DATA_PATH = new URL('../src/data/anime-comparator.json', import.meta.url);
const DEFAULT_USERS = ['Marvinda0', 'ZoroSmoker18'];
const DEMOGRAPHIC_MAP = new Map([
  ['shounen', 'shonen'],
  ['shoujo', 'shojo'],
  ['seinen', 'seinen'],
  ['josei', 'josei'],
  ['kids', 'kids'],
]);

const users = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limitPerUser = limitArg ? Number(limitArg.split('=')[1]) : 18;
const usernames = users.length ? users : DEFAULT_USERS;

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeDemographic(demographics = []) {
  const match = demographics
    .map((item) => DEMOGRAPHIC_MAP.get(item.name.toLowerCase()))
    .find(Boolean);

  return match ?? 'none';
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AniMayhem static data importer',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AniMayhem static data importer',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.json();
}

async function getCompletedList(username) {
  const html = await fetchText(`https://myanimelist.net/animelist/${username}?status=2`);
  const match = html.match(/data-items="([^"]+)"/);

  if (!match) {
    throw new Error(`Could not find embedded list data for ${username}`);
  }

  return JSON.parse(decodeHtml(match[1]));
}

async function enrichAnime(entry) {
  const detail = await fetchJson(`https://api.jikan.moe/v4/anime/${entry.anime_id}`);
  const anime = detail.data;
  const genres = anime.genres?.length
    ? anime.genres.map((genre) => genre.name)
    : entry.genres.map((genre) => genre.name);
  const studio = anime.studios?.[0]?.name ?? 'Unknown';
  const year = anime.year ?? anime.aired?.prop?.from?.year;
  const episodes = anime.episodes ?? entry.anime_num_episodes;
  const demographics = anime.demographics?.length ? anime.demographics : entry.demographics;

  if (!['TV', 'ONA'].includes(anime.type)) {
    return null;
  }

  if (!year || !episodes || studio === 'Unknown' || !genres.length) {
    return null;
  }

  return {
    mal_id: anime.mal_id,
    title: anime.title_english || anime.title,
    genres,
    studio,
    year,
    episodes,
    demographic: normalizeDemographic(demographics),
  };
}

async function main() {
  const existing = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
  const byId = new Map(existing.map((anime) => [anime.mal_id, anime]));
  let imported = 0;

  for (const username of usernames) {
    console.log(`Reading ${username}...`);
    const list = await getCompletedList(username);
    const candidates = list
      .filter((entry) => entry.status === 2 && entry.anime_airing_status === 2)
      .filter((entry) => !byId.has(entry.anime_id))
      .sort((left, right) => {
        const scoreDelta = right.score - left.score;
        return scoreDelta || right.anime_total_members - left.anime_total_members;
      })
      .slice(0, limitPerUser);

    for (const entry of candidates) {
      try {
        await sleep(450);
        const anime = await enrichAnime(entry);

        if (anime && !byId.has(anime.mal_id)) {
          byId.set(anime.mal_id, anime);
          imported += 1;
          console.log(`  + ${anime.title}`);
        }
      } catch (error) {
        console.warn(`  skipped ${entry.anime_title}: ${error.message}`);
      }
    }
  }

  const merged = Array.from(byId.values()).sort((left, right) => left.title.localeCompare(right.title));
  await fs.writeFile(DATA_PATH, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Imported ${imported}. Total comparator rows: ${merged.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
