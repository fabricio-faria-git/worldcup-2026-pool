import { useEffect, useRef, useState } from 'react'
import { getDatabase, ref, get, set } from 'firebase/database'

declare global {
  interface Window {
    hideSplash?: ()=>void
  }
}

export function Recalculate(){

  const iniciou = useRef(false)

  const [status,setStatus] =
    useState("Carregando...")

  async function executar(){

    try{

      setStatus(
        "Recalculando..."
      )

      const db=
        getDatabase()

      const usersSnap=
        await get(
          ref(db,"users")
        )

      const users=
        usersSnap.val()

      const matchesSnap=
        await get(
          ref(db,"matches")
        )

      const matches=
        matchesSnap.val()

      const predictionsSnap=
        await get(
          ref(db,"predictions")
        )

      const predictions=
        predictionsSnap.val()

      const ranking:any={}

      Object.keys(
        users || {}
      ).forEach((userId)=>{

        ranking[userId]=0

      })

      Object.keys(
        predictions || {}
      ).forEach((userId)=>{

        const palpites=
          predictions[userId]

        Object.entries(
          palpites || {}
        ).forEach(
        ([gameId,p]:any)=>{

          if(!p)return

          const jogo=
            matches?.[gameId]

          if(!jogo)return

          // ignora jogos sem resultado
          if(
            jogo.homeScore==null ||
            jogo.awayScore==null ||
            jogo.homeScore===-1 ||
            jogo.awayScore===-1
          ){
            return
          }

          let pontos=0

          // placar exato
          if(
            p.homePrediction===
            jogo.homeScore &&

            p.awayPrediction===
            jogo.awayScore
          ){
            pontos=3
          }

          ranking[userId]+=
            pontos

        })

      })

      console.log(
        "RANKING FINAL",
        ranking
      )

      await set(
        ref(
          db,
          "rankings"
        ),
        ranking
      )

      console.log(
        "RANKING SALVO"
      )

      setStatus(
        "Recalculado ✅"
      )

    }catch(e){

      console.error(e)

      setStatus(
        "Erro ao recalcular ❌"
      )

    }

  }

  useEffect(()=>{

    window.hideSplash?.()

    if(iniciou.current){
      return
    }

    iniciou.current=true

    executar()

  },[])

  return(

    <div
      style={{
        minHeight:'100vh',
        background:'#000',
        color:'white',
        padding:'50px'
      }}
    >

      <h1>{status}</h1>

      <button
        onClick={executar}
        style={{
          padding:'12px 20px',
          cursor:'pointer'
        }}
      >
        Executar novamente
      </button>

    </div>

  )

}