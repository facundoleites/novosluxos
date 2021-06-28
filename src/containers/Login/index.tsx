import React, { useCallback, useState } from "react";
import { auth } from "../../firebase";
const LoginBase = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"IDLE" | "PROCESSING" | "ERROR">("IDLE");
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log({ login, password });
      const signIn = async () => {
        setState("PROCESSING");
        try {
          await auth.signInWithEmailAndPassword(login, password);
        } catch (e) {
          console.error(e);
          setState("ERROR");
        }
      };
      signIn();
    },
    [login, password, setState]
  );

  const registerUser = useCallback(() => {
    const register = async () => {
      setState("PROCESSING");
      try {
        await auth.createUserWithEmailAndPassword(login, password);
      } catch (e) {
        console.error(e);
        setState("ERROR");
      }
    };
    register();
  }, [login, password, setState]);
  return (
    <div className="mt-2 mb-2 border border-gray-800">
      <header className="bg-gray-800 px-2 py-2">Login</header>
      <main className="px-2 py-2">
        <form onSubmit={handleSubmit}>
          <input
            className="border outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 w-full mt-2 px-2 py-2 bg-transparent"
            placeholder="login"
            type="email"
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            className="border outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 w-full mt-2 px-2 py-2 bg-transparent"
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="block outline-none border-0 w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 focus:bg-gray-400 mt-2 uppercase px-2 py-2"
            type="submit"
          >
            send
          </button>
        </form>
        {state === "IDLE" ? null : state === "ERROR" ? (
          <div className="px-2 py-2 bg-red-900">ops!</div>
        ) : state === "PROCESSING" ? (
          <p>processing...</p>
        ) : null}
        <button
          className="block text-center outline-none border-0 w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 focus:bg-gray-600 mt-2 uppercase px-2 py-2"
          onClick={registerUser}
        >
          register
        </button>
      </main>
    </div>
  );
};
export const Login = React.memo(LoginBase);
