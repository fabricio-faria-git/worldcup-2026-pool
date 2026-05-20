import { db } from '../firebase'
import { ref, get, update } from 'firebase/database'

const getWinner = (
  home:number,
  away:number
) => {

  if(home>away) return 'home'

  if(home<away) return 'away'

  return 'tied'
}

const calculatePoints = (
  homeScore:number,
  awayScore:number,
  homePrediction:number,
  awayPrediction:number
)=>{

  // jogo ainda sem resultado
  if(
    homeScore == null ||
    awayScore == null ||
    homeScore === undefined ||
    awayScore === undefined ||
    homeScore < 0 ||
    awayScore < 0
  ){
    return 0
  }

  // placar exato
  if(
    homeScore===homePrediction &&
    awayScore===awayPrediction
  ){
    return 15
  }

  // vencedor correto
  if(
    getWinner(
      homeScore,
      awayScore
    )===
    getWinner(
      homePrediction,
      awayPrediction
    )
  ){

    const diff=
      Math.abs(
        homePrediction-homeScore
      )
      +
      Math.abs(
        awayPrediction-awayScore
      )

    return Math.max(
      0,
      10-diff
    )
  }

  return 0
}
export const recalculateRanking =
async()=>{

  const usersSnap=
    await get(
      ref(db,'users')
    )

  const predictionsSnap=
    await get(
      ref(db,'predictions')
    )

  const matchesSnap=
    await get(
      ref(db,'matches')
    )

  const users=
    usersSnap.val()

  const predictions=
    predictionsSnap.val()

  const matches=
    matchesSnap.val()

  const updates:any={}

  for(
    const userId in users
  ){

    let total=0

    for(
      const matchId in
      predictions?.[userId]||{}
    ){

      const p=
        predictions[userId][matchId]

      const m=
        matches?.[matchId]

      if(!m){
        continue
      }
	    console.log({
    userId,
    matchId,

    homeScore:m?.homeScore,
    awayScore:m?.awayScore,

    homePrediction:p?.homePrediction,
    awayPrediction:p?.awayPrediction
  })

      const points=
        calculatePoints(

          m.homeScore,
          m.awayScore,

          p.homePrediction,
          p.awayPrediction
        )

      total+=points

      updates[
        `predictions/${userId}/${matchId}/points`
      ]=points

    }

    updates[
      `users/${userId}/score`
    ]=total

    updates[
      `rankings/${userId}`
    ]=total
  }

  await update(
    ref(db),
    updates
  )

  console.log(
    'Ranking recalculado'
  )
}