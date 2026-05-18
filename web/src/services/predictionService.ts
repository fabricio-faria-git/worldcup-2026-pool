import { db } from '../firebase';
import {
  ref,
  get,
  set,
  onValue,
  type Unsubscribe
} from 'firebase/database';

export interface Prediction {
  homePrediction:number;
  awayPrediction:number;
  points:number;
  updatedAt:number;
}

export interface UserPredictions{
  [gameId:string]:Prediction
}

/**
 * Buscar todos os palpites do usuário
 */
export const getUserPredictions=async(
  userId:string
):Promise<UserPredictions>=>{

  const predictionsRef=
    ref(db,`predictions/${userId}`);

  const snapshot=
    await get(predictionsRef);

  if(!snapshot.exists()){
    return {};
  }

  return snapshot.val();
};

/**
 * Buscar palpite individual
 */
export const getPrediction=async(
  userId:string,
  gameId:number
):Promise<Prediction|null>=>{

  const predictionRef=
    ref(
      db,
      `predictions/${userId}/${gameId}`
    );

  const snapshot=
    await get(predictionRef);

  if(!snapshot.exists()){
    return null;
  }

  return snapshot.val();
};

/**
 * Salva palpite
 */
export const savePrediction=async(
  userId:string,
  gameId:number,
  homePrediction:number,
  awayPrediction:number
):Promise<void>=>{

  const predictionRef=
    ref(
      db,
      `predictions/${userId}/${gameId}`
    );

  const prediction:Prediction={

    homePrediction,
    awayPrediction,

    points:0,

    updatedAt:Date.now()
  };

  await set(
    predictionRef,
    prediction
  );

  console.log(
    'Palpite salvo. Recalculando ranking...'
  );

  // recalcula automaticamente
  const {
    recalculateRanking
  }=await import(
    './scoreService'
  );

  await recalculateRanking();

  console.log(
    'Ranking recalculado'
  );
};

/**
 * Atualização em tempo real
 */
export const subscribeToPredictions=(
  userId:string,
  callback:(
    predictions:UserPredictions
  )=>void
):Unsubscribe=>{

  const predictionsRef=
    ref(
      db,
      `predictions/${userId}`
    );

  return onValue(
    predictionsRef,
    snapshot=>{

      if(snapshot.exists()){

        callback(
          snapshot.val()
        );

      }else{

        callback({});

      }

    }
  );
};