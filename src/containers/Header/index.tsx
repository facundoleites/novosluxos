import React from "react";
import { auth } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
const HeaderBase = () => {
  const user = useAuth();
  console.log("HeaderBase -> user", user);
  return (
    <header className="flex justify-between items-center">
      <h1>Luxos</h1>
      {user ? (
        <div className="flex items-center">
          <h2 className="pl-2 truncate">{user.email}</h2>
          <button
            className="ml-2 px-2 py-2"
            onClick={() => {
              const confirmed = window.confirm("logout?");
              if (confirmed) {
                auth.signOut();
              }
            }}
          >
            x
          </button>
        </div>
      ) : (
        ""
      )}
    </header>
  );
};
export const Header = React.memo(HeaderBase);
