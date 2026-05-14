import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

type AuthContextType = {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext =
createContext({} as AuthContextType);

export function AuthProvider({
 children
}:{
 children: React.ReactNode
}) {

 const [user,setUser]=
 useState<User|null>(null);

 async function login(){

   const provider=
   new GoogleAuthProvider();

   await signInWithPopup(
      auth,
      provider
   );

 }

 async function logout(){

   await signOut(auth);

 }

 useEffect(()=>{

   const unsubscribe=
   onAuthStateChanged(
      auth,
      (user)=>{

        setUser(user);

      }
   );

   return unsubscribe;

 },[]);

 return(

 <AuthContext.Provider
 value={{
    user,
    login,
    logout
 }}>

 {children}

 </AuthContext.Provider>

 );

}

export function useAuth(){

 return useContext(
    AuthContext
 );

}