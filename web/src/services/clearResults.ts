import { db } from '../firebase'
import { ref, get, update } from 'firebase/database'

export const clearResults = async()=>{

   const snapshot=
      await get(
         ref(db,'matches')
      )

   if(!snapshot.exists()){
      return
   }

   const matches=snapshot.val()

   for(const matchId of Object.keys(matches)){

      await update(
         ref(db,`matches/${matchId}`),
         {
            homeScore:-1,
            awayScore:-1,
            finished:false
         }
      )

      console.log(
         `resultado limpo ${matchId}`
      )
   }

   console.log(
      'todos resultados limpos'
   )
}