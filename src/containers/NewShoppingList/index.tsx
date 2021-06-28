import React, { useCallback, useState } from "react";
import { db, now } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
const NewShoppingListBase = () => {
  const [name, setName] = useState("");
  const user = useAuth();
  const [state, setState] = useState<"IDLE" | "ERROR" | "CREATING">("IDLE");
  const handleCreation = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (user) {
        const create = async () => {
          setState("CREATING");
          try {
            await db
              .collection("users")
              .doc(user.uid)
              .collection("lists")
              .add({ name: name, date: now() });
            setState("IDLE");
            window.alert("list created");
          } catch (e) {
            console.error(e);
            setState("ERROR");
          }
        };
        const confirmed = window.confirm("create list");
        if (confirmed) {
          const newConfirmed = window.confirm("create list????????????");
          if (newConfirmed) {
            create();
          }
        }
      }
    },
    [name, user]
  );
  return (
    <form onSubmit={handleCreation}>
      <div className="grid grid-cols-6 gap-x-2">
        {state === "ERROR" ? (
          <div className="bg-error-900">ops!</div>
        ) : state === "CREATING" ? (
          <div>creating...</div>
        ) : null}
        <input
          className="border col-span-4 outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 w-full mt-2 px-2 py-2 bg-transparent"
          placeholder="list name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="col-span-2 block outline-none border-0 w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 focus:bg-gray-400 mt-2 uppercase px-2 py-2">
          +
        </button>
      </div>
    </form>
  );
};
export const NewShoppingList = React.memo(NewShoppingListBase);
