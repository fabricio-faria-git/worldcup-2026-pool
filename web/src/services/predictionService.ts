import {
  ref,
  get,
  set,
  onValue,
  type Unsubscribe
} from 'firebase/database'

import { db } from '../firebase'

import { getMatch } from './matchService'

export interface Prediction{
  homePrediction:number
  awayPrediction:number
  points:number
  updatedAt:number
}

export interface UserPredictions{
  [gameId:string]:Prediction
}


/**
 * busca todos os palpites do usuário
 */
export const getUserPredictions=async(
  userId:string
):Promise<UserPredictions>=>{

  const predictionsRef=
    ref(
      db,
      `predictions/${userId}`
    )

  const snapshot=
    await get(predictionsRef)

  if(!snapshot.exists()){

    return {}

  }

  return snapshot.val()

}


/**
 * busca palpite específico
 */
export const getPrediction=async(
  userId:string,
  gameId:number
):Promise<Prediction|null>=>{

  const predictionRef=
    ref(
      db,
      `predictions/${userId}/${gameId}`
    )

  const snapshot=
    await get(predictionRef)

  if(!snapshot.exists()){

      return null

  }

  return snapshot.val()

}


/**
 * salva palpite
 */
export const savePrediction=async(
  userId:string,
  gameId:number,
  homePrediction:number,
  awayPrediction:number
):Promise<void>=>{

  /*
    valida se jogo ainda aceita
    palpites
  */

  const match=
    await getMatch(gameId)

  if(match){

      const kickoffTime=
        new Date(
          match.date
        ).getTime()

      const cutoffTime=
        kickoffTime-
        (10*60*1000)

      if(
        Date.now()>=
        cutoffTime
      ){

          throw new Error(
            'Palpites encerrados'
          )

      }

  }

  const predictionRef=
    ref(
      db,
      `predictions/${userId}/${gameId}`
    )

  const prediction:Prediction={

      homePrediction,

      awayPrediction,

      points:0,

      updatedAt:
        Date.now()

  }

  await set(
      predictionRef,
      prediction
  )

  /*
    recalcula ranking
    automaticamente
  */

  const {
      recalculateRanking
  }=await import(
      './scoreService'
  )

  await recalculateRanking()

}


/**
 * realtime
 */
export const subscribeToPredictions=(

  userId:string,

  callback:(
      predictions:
      UserPredictions
  )=>void

):Unsubscribe=>{

  const predictionsRef=
    ref(
      db,
      `predictions/${userId}`
    )

  return onValue(

      predictionsRef,

      (snapshot)=>{

          if(
            snapshot.exists()
          ){

            callback(
              snapshot.val()
            )

          }else{

            callback({})

          }

      }

  )

}