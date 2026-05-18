import { db } from '../firebase';
import { ref, update } from 'firebase/database';

export const simulateResults = async () => {
  console.log('Simulando resultados...');

  // ajuste IDs conforme existirem no seu banco
  const fakeResults = {
    '1': {
      homeScore: 2,
      awayScore: 1,
      finished: true,
    },

    '2': {
      homeScore: 0,
      awayScore: 0,
      finished: true,
    },

    '3': {
      homeScore: 3,
      awayScore: 2,
      finished: true,
    }
  };

  for (const matchId of Object.keys(fakeResults)) {
    await update(
      ref(db, `matches/${matchId}`),
      fakeResults[matchId]
    );

    console.log(`Jogo ${matchId} atualizado`);
  }

  console.log('Resultados simulados');
};