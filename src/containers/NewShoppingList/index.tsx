import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useState } from "react";
import { Loading } from "../../components/Loading";
import { db, now } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
const NewShoppingListBase: React.FC<{ setList: (newlistid: string) => void }> =
  ({ setList }) => {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState<number>(Number.POSITIVE_INFINITY);
    const user = useAuth();
    const [state, setState] = useState<"IDLE" | "ERROR" | "CREATING">("IDLE");
    const handleCreation = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user) {
          const create = async () => {
            setState("CREATING");
            try {
              const { id } = await db
                .collection(`users/${user.uid}/lists`)
                .add({ name: name, date: now(), budget: budget });
              setState("IDLE");
              window.alert("list created");
              setList(id);
            } catch (e) {
              console.error(e);
              setState("ERROR");
            }
          };
          const confirmed = window.confirm("Create list?");
          if (confirmed) {
            create();
          }
        }
      },
      [name, user, setList, budget]
    );
    return (
      <form onSubmit={handleCreation}>
        <div>
          {state === "ERROR" ? (
            <div className="bg-error-900">ops!</div>
          ) : state === "CREATING" ? (
            <Loading />
          ) : null}
          <section className="pt-2 grid grid-cols-2 gap-x-2">
            <input
              className="border outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 px-2 py-2 bg-transparent"
              placeholder="New list name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 px-2 py-2 bg-transparent"
              placeholder="New list budget"
              type="number"
              value={budget.toString()}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </section>
          <button className="col-span-2 block outline-none border-0 w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 focus:bg-gray-400 mt-2 uppercase px-2 py-2">
            <Icon path={mdiPlus} size={1} className="inline" /> Create new list
          </button>
        </div>
      </form>
    );
  };
export const NewShoppingList = React.memo(NewShoppingListBase);
