import 'dotenv/config';

import { db } from './firebase-admin';

/*
|--------------------------------------------------------------------------
| FIFA
|--------------------------------------------------------------------------
*/

const FIFA_API_URL =
  'https://api.fifa.com/api/v3/calendar/matches';

const SEASON_ID = '285023';
const COMPETITION_ID = '17';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface Match {
  game: number;
  fifaId: string;
  round: string;
  group: string | null;
  date: string;
  timestamp: number;
  location: string;
  locationCity: string;
  locationCountry: string;
  home: string;
  homeName: string;
  homeScore: number;
  away: string;
  awayName: string;
  awayScore: number;
}

interface Prediction {
  homePrediction: number;
  awayPrediction: number;
  points: number;
  updatedAt: number;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getWinner = (
  home: number,
  away: number
): 'home' | 'away' | 'tied' => {
  if (home > away) return 'home';
  if (home < away) return 'away';
  return 'tied';
};

const calculatePoints = (
  homeScore: number,
  awayScore: number,
  homePrediction: number,
  awayPrediction: number
): number => {
  if (
    homeScore == null ||
    awayScore == null ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    return 0;
  }

  if (
    homeScore === homePrediction &&
    awayScore === awayPrediction
  ) {
    return 15;
  }

  if (
    getWinner(homeScore, awayScore) ===
    getWinner(
      homePrediction,
      awayPrediction
    )
  ) {
    const diff =
      Math.abs(
        homePrediction - homeScore
      ) +
      Math.abs(
        awayPrediction - awayScore
      );

    return Math.max(
      0,
      10 - diff
    );
  }

  return 0;
};

/*
|--------------------------------------------------------------------------
| FIFA Fetch
|--------------------------------------------------------------------------
*/

async function fetchMatches() {

  const url = new URL(FIFA_API_URL);

  url.searchParams.set(
    'idseason',
    SEASON_ID
  );

  url.searchParams.set(
    'idcompetition',
    COMPETITION_ID
  );

  url.searchParams.set(
    'count',
    '500'
  );

  const response =
    await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `FIFA API error ${response.status}`
    );
  }

  const data =
    await response.json();

  const matches: Record<
    string,
    Match
  > = {};

  data.Results.forEach(
    (
      item: any,
      index: number
    ) => {

      const game = index + 1;

      matches[String(game)] = {

        game,

        fifaId:
          item.IdMatch,

        round:
          item.StageName?.[0]
            ?.Description ?? '',

        group:
          item.GroupName?.[0]
            ?.Description ?? null,

        date:
          item.Date,

        timestamp:
          Math.floor(
            new Date(
              item.Date
            ).getTime() / 1000
          ),

        location:
          item.Stadium?.Name?.[0]
            ?.Description ?? '',

        locationCity:
          item.Stadium?.CityName?.[0]
            ?.Description ?? '',

        locationCountry:
          item.Stadium
            ?.IdCountry ?? '',

        home:
          item.Home
            ?.Abbreviation ??
          item.PlaceHolderA,

        homeName:
          item.Home
            ?.ShortClubName ??
          item.PlaceHolderA,

        homeScore:
          item.Home?.Score ?? -1,

        away:
          item.Away
            ?.Abbreviation ??
          item.PlaceHolderB,

        awayName:
          item.Away
            ?.ShortClubName ??
          item.PlaceHolderB,

        awayScore:
          item.Away?.Score ?? -1,
      };
    }
  );

  return matches;
}

/*
|--------------------------------------------------------------------------
| Ranking
|--------------------------------------------------------------------------
*/

async function recalculateRanking() {

  console.log(
    'Recalculando ranking...'
  );

  const usersSnap =
   await db.ref('users').get();

  const predictionsSnap =
   await db.ref('predictions').get();

  const matchesSnap =
   await db.ref('matches').get();

  const users =
    usersSnap.val() || {};

  const predictions =
    predictionsSnap.val() || {};

  const matches =
    matchesSnap.val() || {};

  const updates:
    Record<string, any> = {};

  for (const userId in users) {

    let total = 0;

    const userPredictions =
      predictions[userId] || {};

    for (
      const matchId in
      userPredictions
    ) {

      const p =
        userPredictions[
          matchId
        ] as Prediction;

      const m =
        matches[matchId];

      if (!m) {
        continue;
      }

      const points =
        calculatePoints(
          m.homeScore,
          m.awayScore,
          p.homePrediction,
          p.awayPrediction
        );

      total += points;

      updates[
        `predictions/${userId}/${matchId}/points`
      ] = points;
    }

    updates[
      `users/${userId}/score`
    ] = total;

    updates[
      `rankings/${userId}`
    ] = total;
  }

await db.ref().update(updates);

  console.log(
    'Ranking atualizado'
  );
}

/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
*/

async function run() {

  console.log(
    'Buscando jogos FIFA...'
  );

  const beforeSnap =
   await db.ref('matches').get();

  const before =
    beforeSnap.exists()
      ? beforeSnap.val()
      : {};

  const matches =
    await fetchMatches();

  let changed = 0;

  for (
    const matchId in matches
  ) {

    const oldMatch =
      before?.[matchId];

    const newMatch =
      matches[matchId];

    if (
      oldMatch?.homeScore !==
        newMatch.homeScore ||
      oldMatch?.awayScore !==
        newMatch.awayScore
    ) {
      changed++;

      console.log(
        `Jogo ${matchId}: ` +
        `${oldMatch?.homeScore}x${oldMatch?.awayScore}` +
        ` -> ` +
        `${newMatch.homeScore}x${newMatch.awayScore}`
      );
    }
  }

await db.ref('matches').set(matches);

  console.log(
    `${changed} jogos alterados`
  );

  if (changed > 0) {
    await recalculateRanking();
  } else {
    console.log(
      'Nenhuma alteração de placar'
    );
  }

  console.log(
    'Finalizado'
  );
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });