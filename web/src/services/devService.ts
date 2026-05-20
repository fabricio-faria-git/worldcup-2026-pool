import { db } from '../firebase';
import {
  ref,
  set,
  get,
  remove,
  update,
} from 'firebase/database';

import type { UserData } from './userService';
import type { MatchesData } from './matchService';
import type { Prediction } from './predictionService';
import { recalculateRanking } from './scoreService';

// [firstName, lastName]
const MOCK_NAMES: [string, string][] = [
  ['James', 'Hetfield'],
  ['Dave', 'Mustaine'],
  ['Tom', 'Araya'],
  ['Scott', 'Ian'],
  ['Trent', 'Reznor'],
  ['Cliff', 'Burton'],
  ['Kirk', 'Hammett'],
  ['Lars', 'Ulrich'],
  ['Les', 'Claypool'],
  ['Max', 'Cavalera'],
  ['Lemmy', 'Kilmister'],
  ['Ozzy', 'Osbourne'],
  ['Björk', 'Guðmundsdóttir'],
  ['Cate', 'Blanchett'],
  ['Nicole', 'Kidman'],
  ['Charlize', 'Theron'],
  ['Scarlett', 'Johansson'],
  ['Natalie', 'Portman'],
  ['Emma', 'Stone'],
  ['Margot', 'Robbie'],
  ['Viola', 'Davis'],
  ['Sandra', 'Bullock'],
  ['Julia', 'Roberts'],
  ['Angelina', 'Jolie'],
];

const generateMockUser = (
  index: number,
  timestamp: number
): UserData => {
  const [firstName] =
    MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];

  const [, lastName] =
    MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];

  const displayName = `${firstName} ${lastName}`;

  const userName =
    `${firstName.toLowerCase()}${lastName.toLowerCase()}${index}`;

  return {
    email: `${userName}@mock.test`,
    displayName,
    userName,
    photoURL: `https://i.pravatar.cc/150?u=${timestamp}_${index}`,
    score: 0,
    admin: false,
  };
};

const generatePredictionsForUser = async (
  userId: string,
  matches: MatchesData
): Promise<number> => {
  const now = Date.now();

  const predictions: Record<string, Prediction> = {};

  for (const matchId of Object.keys(matches)) {
    predictions[matchId] = {
      homePrediction: Math.floor(Math.random() * 6),
      awayPrediction: Math.floor(Math.random() * 6),
      points: 0,
      updatedAt: now,
    };
  }

  await set(
    ref(db, `predictions/${userId}`),
    predictions
  );

  return Object.keys(matches).length;
};

export const generateMockUsers = async (
  count: number
): Promise<number> => {
  const snapshot = await get(ref(db, 'matches'));

  const matches = snapshot.exists()
    ? (snapshot.val() as MatchesData)
    : null;

  const timestamp = Date.now();

  let created = 0;

  for (let i = 0; i < count; i++) {
    const uid = `mock_${timestamp}_${i}`;

    const user = generateMockUser(i, timestamp);

    await set(ref(db, `users/${uid}`), {
      ...user,
      mock: true,
    });

    await set(
      ref(db, `usernames/${user.userName}`),
      uid
    );

    if (matches) {
      await generatePredictionsForUser(
        uid,
        matches
      );
    }

    created++;
  }

  return created;
};

export const clearMockUsers = async (): Promise<number> => {
  const snapshot = await get(ref(db, 'users'));

  if (!snapshot.exists()) return 0;

  const users = snapshot.val();

  let removed = 0;

  for (const [uid, user] of Object.entries<any>(
    users
  )) {
    if (!user.mock) continue;

    await remove(ref(db, `users/${uid}`));
    await remove(
      ref(db, `usernames/${user.userName}`)
    );
    await remove(ref(db, `predictions/${uid}`));

    removed++;
  }

  return removed;
};

export const getMockUserCount =
  async (): Promise<number> => {
    
    const snapshot = await get(
      ref(db, 'users')
    );

    if (!snapshot.exists()) {
      return 0;
    }

    const users = snapshot.val();

    const total = Object.values(users)
      .filter((u: any) => u.mock)
      .length;

   return total;
  };

/**
 * Simula resultados para jogos passados
 */
export const simulateResults =
async ():Promise<number> => {

  const snapshot =
    await get(
      ref(db,'matches')
    );

  if(
    !snapshot.exists()
  ){
    return 0;
  }

  const matches =
    snapshot.val();

  let updated=0;

  const now=Date.now();

  for(
    const [matchId,match]
    of Object.entries<any>(matches)
  ){

    const kickoff=
      match.timestamp;

    // jogo futuro:
    // mantém sem resultado
    if(
      kickoff>now
    ){

      await update(
        ref(
          db,
          `matches/${matchId}`
        ),
        {
          homeScore:-1,
          awayScore:-1,
          finished:false
        }
      );

      continue;
    }

    // jogo já passou:
    // gera placar aleatório

    await update(
      ref(
        db,
        `matches/${matchId}`
      ),
      {
        homeScore:
          Math.floor(
            Math.random()*6
          ),

        awayScore:
          Math.floor(
            Math.random()*6
          ),

        finished:true
      }
    );

    updated++;
  }

  console.log(
    `${updated} jogos simulados`
  );

  await recalculateRanking();

  return updated;
};
/**
 * Remove resultados
 */
export const clearResults =
  async (): Promise<number> => {
    const snapshot = await get(
      ref(db, 'matches')
    );

    if (!snapshot.exists()) return 0;

    const matches = snapshot.val();

    let count = 0;

    for (const matchId of Object.keys(
      matches
    )) {
      await remove(
        ref(
          db,
          `matches/${matchId}/homeScore`
        )
      );

      await remove(
        ref(
          db,
          `matches/${matchId}/awayScore`
        )
      );

      count++;
    }

    return count;
  };