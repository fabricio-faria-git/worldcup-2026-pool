import { useEffect, useState } from 'react';

import {
  generateMockUsers,
  clearMockUsers,
  getMockUserCount,
  simulateResults,
  clearResults,
} from '../services/devService';

import {
  recalculateRanking
} from '../services';

export default function Admin() {

  const [loading,setLoading] =
    useState(true);

  const [mockCount,setMockCount] =
    useState(0);

  const [
    actionLoading,
    setActionLoading
  ]=
    useState<string|null>(null);

  console.log(
    'ADMIN RENDER'
  );

  const loadData=
  async()=>{

    console.log(
      'loadData iniciou'
    );

    try{

      const total=
        await getMockUserCount();

      console.log(
        'TOTAL:',
        total
      );

      setMockCount(
        total
      );

    }catch(err){

      console.error(
        err
      );

    }finally{

      setLoading(
        false
      );

      console.log(
        'loading false'
      );
    }
  };

useEffect(()=>{

  if(
    typeof window !== 'undefined' &&
    window.hideSplash
  ){
    window.hideSplash()
  }

  async function load(){

    try{

      const total=
        await getMockUserCount()

      setMockCount(total)

    }
    catch(e){

      console.error(
        'Erro ao carregar',
        e
      )

    }
    finally{

      setLoading(false)
    }
  }

  load()

},[])

  const runAction=
  async(
    action:string,
    callback:()=>Promise<void>
  )=>{

    try{

      setActionLoading(
        action
      );

      await callback();

      await loadData();

    }catch(e){

      console.error(
        e
      );

      alert(
        'Erro ao executar ação'
      );

    }finally{

      setActionLoading(
        null
      );
    }
  };

  console.log(
    'RENDER FINAL',
    {
      loading,
      mockCount,
      actionLoading
    }
  );

  if(
    loading
  ){

    return(

      <div className="
      p-8
      text-white
      ">

        Carregando painel...

      </div>
    )
  }

  return(

    <div className="
    max-w-5xl
    mx-auto
    p-8
    text-white
    ">

      <h1 className="
      text-3xl
      font-bold
      mb-8
      ">
        Administração
      </h1>

      <div className="
      mb-8
      p-2
	  w-48
      rounded
      bg-zinc-900
      ">

        <div className="
        text-xl
		text-center
        ">

          Fakes: {' '}
           {mockCount}

        </div>

      </div>

      <div className="
      grid
      gap-4
      ">

        <button
          disabled={
            !!actionLoading
          }
          onClick={()=>
            runAction(
              'create',
              async()=>{

                await generateMockUsers(
                  5
                );

              }
            )
          }
          className="
          bg-green-600
          p-2
		  w-48
          rounded
          "
        >

          {
            actionLoading==='create'
            ?
            'Criando...'
            :
            'Criar 5 Fakes'
          }

        </button>

        <button
          disabled={
            !!actionLoading
          }
          onClick={()=>
            runAction(
              'clearUsers',
              async()=>{

                await clearMockUsers();

              }
            )
          }
          className="
          bg-red-600
          p-2
		  w-48
          rounded
          "
        >

          {
            actionLoading==='clearUsers'
            ?
            'Limpando...'
            :
            'Limpar Fakes'
          }

        </button>

        <button
          disabled={
            !!actionLoading
          }
          onClick={()=>
            runAction(
              'simulate',
              async()=>{

                await simulateResults();

              }
            )
          }
          className="
          bg-blue-600
          p-2
		  w-48
          rounded
		  "
        >

          {
            actionLoading==='simulate'
            ?
            'Simulando...'
            :
            'Simular resultados'
          }

        </button>

        <button
          disabled={
            !!actionLoading
          }
          onClick={()=>
            runAction(
              'ranking',
              async()=>{

                await recalculateRanking();

              }
            )
          }
          className="
          bg-yellow-500
          text-black
          p-2
		  w-48
          rounded
          "
        >

          {
            actionLoading==='ranking'
            ?
            'Recalculando...'
            :
            'Recalcular ranking'
          }

        </button>

        <button
          disabled={
            !!actionLoading
          }
          onClick={()=>
            runAction(
              'clearResults',
              async()=>{

                await clearResults();

              }
            )
          }
          className="
          bg-purple-600
          p-2
		  w-48
          rounded
          "
        >

          {
            actionLoading==='clearResults'
            ?
            'Limpando...'
            :
            'Limpar resultados'
          }

        </button>

      </div>

    </div>
  )
}