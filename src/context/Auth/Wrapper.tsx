import React, { useEffect, useState } from "react";
import { Login } from "../../containers/Login";
import { auth } from "../../firebase";
import { AuthContext } from "./Context";
const AuthWrapperBase: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<null | false | firebase.User>(
    null
  );
  console.log("currentUser", currentUser);
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
      {currentUser ? children : currentUser === null ? "loading..." : <Login />}
    </AuthContext.Provider>
  );
};
export const AuthWrapper = React.memo(AuthWrapperBase);
