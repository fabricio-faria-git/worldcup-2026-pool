import { useEffect, useState } from "react";

import { onAuthStateChanged, User } from "firebase/auth";

import {
  ref,
  set
} from "firebase/database";

import { auth, db } from "./firebase";

import { loginWithGoogle } from "./services/auth";

function App() {

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  async function handleLogin() {
    await loginWithGoogle();
  }

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      if (currentUser) {

     await set(
  ref(db, `users/${currentUser.uid}`),
  {
    uid: currentUser.uid,
    name: currentUser.displayName,
    email: currentUser.email,
    photoURL: currentUser.photoURL,
    lastLogin: Date.now()
  }
);

      }

      setUser(currentUser);

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  if (loading) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div style={{ padding: 40 }}>

      <h1>World Cup Pool</h1>

      {!user ? (

        <button onClick={handleLogin}>
          Login com Google
        </button>

      ) : (

        <div>

          <h2>Usuário logado</h2>

          <p>Nome: {user.displayName}</p>

          <p>Email: {user.email}</p>

          <img
            src={user.photoURL || ""}
            width={100}
            style={{ borderRadius: "50%" }}
          />

        </div>

      )}

    </div>
  );
}

export default App;