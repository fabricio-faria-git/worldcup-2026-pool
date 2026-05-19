import { useEffect, useState } from 'react'

import {
 generateMockUsers,
 clearMockUsers,
 getMockUserCount
} from '../services'

export default function Admin(){

 const [loading,setLoading]=useState(true)

 const [mockCount,setMockCount]=useState(0)

 const [working,setWorking]=useState(false)

useEffect(()=>{

  if(window.hideSplash){
     window.hideSplash()
  }

  async function load(){

      try{

         const total=
           await getMockUserCount()

         setMockCount(total)

      }finally{

         setLoading(false)
      }
  }

  load()

},[])

 console.log(
   "render final",
   {loading,mockCount}
 )

 if(loading){

   return(
      <div className="p-8">
        Carregando...
      </div>
   )
 }

 const createMocks=async()=>{

    setWorking(true)

    try{

      await generateMockUsers(10)

      const total=
        await getMockUserCount()

      setMockCount(total)

    }finally{

      setWorking(false)
    }
 }

 const clearMocks=async()=>{

    setWorking(true)

    try{

      await clearMockUsers()

      setMockCount(0)

    }finally{

      setWorking(false)
    }
 }

 return(

<div className="flex flex-wrap gap-4">

<button
onClick={createMocks}
disabled={working}
className="bg-green-700 px-4 py-2 rounded"
>
Criar Fakes
</button>

<button
onClick={clearMocks}
disabled={working}
className="bg-red-700 px-4 py-2 rounded"
>
Limpar Fakes
</button>

<button
onClick={async()=>{

 setWorking(true)

 try{

   const {
      simulateResults
   }=await import('../services')

   await simulateResults()

 }finally{

   setWorking(false)
 }

}}
className="bg-blue-700 px-4 py-2 rounded"
>
Simular resultados
</button>

<button
onClick={async()=>{

 setWorking(true)

 try{

   const {
      recalculateRanking
   }=await import(
     '../services/scoreService'
   )

   await recalculateRanking()

 }finally{

   setWorking(false)
 }

}}
className="bg-yellow-700 px-4 py-2 rounded"
>
Recalcular ranking
</button>

<button
onClick={async()=>{

 setWorking(true)

 try{

   const {
      clearResults
   }=await import('../services')

   await clearResults()

 }finally{

   setWorking(false)
 }

}}
className="bg-gray-700 px-4 py-2 rounded"
>
Limpar resultados
</button>

</div>

 //</div>

 )

}