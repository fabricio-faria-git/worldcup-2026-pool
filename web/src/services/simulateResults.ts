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

   '1':{

      homeScore:2,
      awayScore:1,
	  date:"2026-05-18T19:15:00Z",
	  timestamp:1779131700,
      finished:true
    },

    '2':{

      homeScore:-1,
      awayScore:-1,
      finished:false
    },

    '3':{

      homeScore:-1,
      awayScore:-1,
      finished:false
    },
	    '4':{

      homeScore:-1,
      awayScore:-1,
      finished:false
    },

    '5':{

      homeScore:-1,
      awayScore:-1,
      finished:false
    },

    '6':{

      homeScore:-1,
      awayScore:-1,
      finished:false
    }

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