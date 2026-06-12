import { db } from '../firebase'

import {
  ref,
  update
}
from 'firebase/database'

import {
  recalculateRanking
}
from './scoreService'

export const simulateResults=
async()=>{

  console.log(
    'Simulando resultados...'
  )

  const fakeResults={


  }

  for(
    const matchId of
    Object.keys(
      fakeResults
    )
  ){

    await update(

      ref(
        db,
        `matches/${matchId}`
      ),

      fakeResults[
        matchId as keyof
        typeof fakeResults
      ]

    )

    console.log(

      `Jogo ${matchId}
      atualizado`

    )

  }

  console.log(
    'Recalculando...'
  )

  await recalculateRanking()

  console.log(
    'Concluído'
  )
}