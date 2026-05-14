import { useAuth } from "../context/AuthContext";

export function HomePage() {

  const {
    user,
    login,
    logout
  } = useAuth();

  return (

    <div className="min-h-screen bg-zinc-900 text-white p-6">

      <h1 className="text-4xl font-bold">
        World Cup 2026
      </h1>

      {!user ? (

        <button
          onClick={login}
          className="
          mt-6
          px-4
          py-2
          rounded
          bg-blue-600
          hover:bg-blue-700
          "
        >

          Login Google

        </button>

      ) : (

        <div className="mt-6">

          {user.photoURL && (

            <img
              src={user.photoURL}
              className="
              w-16
              h-16
              rounded-full
              "
            />

          )}

          <h2 className="mt-2 text-xl">

            {user.displayName}

          </h2>

          <p>

            {user.email}

          </p>

          <button
            onClick={logout}
            className="
            mt-4
            px-4
            py-2
            rounded
            bg-red-600
            "
          >

            Sair

          </button>

        </div>

      )}

    </div>

  );

}