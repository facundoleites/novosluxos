import React, { useEffect, useState } from "react";
import { Login } from "../../containers/Login";
import { auth } from "../../firebase";
import { AuthContext } from "./Context";
import firebase from "firebase/app";
import { Loading } from "../../components/Loading";
const AuthWrapperBase: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<null | false | firebase.User>(
    null
  );
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((newUser) => {
      if (newUser) {
        setCurrentUser(newUser);
      } else {
        setCurrentUser(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setCurrentUser]);
  return (
    <AuthContext.Provider value={currentUser}>
      {currentUser ? children : currentUser === null ? <Loading /> : <Login />}
    </AuthContext.Provider>
  );
};
export const AuthWrapper = React.memo(AuthWrapperBase);
