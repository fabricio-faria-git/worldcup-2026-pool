import React,{useContext} from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context'

type Props={
 children:React.ReactNode
}

export default function AdminRoute({
 children
}:Props){

 const auth=useContext(AuthContext)

 if(!auth){
   return <div>Erro Auth</div>
 }

 const {
   user,
   userData,
   loading
 }=auth

 if(loading){
   return <div>Carregando...</div>
 }

 if(!user){
   return <Navigate to="/" replace />
 }

 if(!userData?.admin){
   return <div>Sem permissão</div>
 }

 return <>{children}</>
}