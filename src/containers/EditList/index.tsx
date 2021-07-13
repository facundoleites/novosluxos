import { mdiDelete, mdiPencil } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingListData } from "../ShoppingList";
const EditListBase: React.FC<{
  list: ShoppingListData;
  onListEdit: () => void;
  onListDelete: () => void;
}> = ({ list, onListDelete, onListEdit }) => {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState<number>(Number.POSITIVE_INFINITY);
  const [state, setState] = useState<"IDLE" | "ERROR" | "WORKING">("IDLE");
  const user = useAuth();

  useEffect(() => {
    setName(list.name);
  }, [setName, list]);

  useEffect(() => {
    setBudget(list.budget);
  }, [setBudget, list]);

  const handleEdition = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (user) {
        const create = async () => {
          setState("WORKING");
          try {
            await db
              .doc(`users/${user.uid}/lists/${list.id}`)
              .update({ name: name, budget: budget });
            setState("IDLE");
            window.alert("List edited");
            onListEdit();
          } catch (e) {
            console.error(e);
            setState("ERROR");
          }
        };
        const confirmed = window.confirm("Edit list?");
        if (confirmed) {
          create();
        }
      }
    },
    [name, user, budget, list, onListEdit]
  );

  const handleDelete = useCallback(() => {
    const processDelete = async () => {
      if (user) {
        setState("WORKING");
        try {
          await db.doc(`users/${user.uid}/lists/${list.id}`).delete();
          window.alert("List deleted!");
          onListDelete();
        } catch (e) {
          window.alert("Error deleting list");
        }
        setState("IDLE");
      }
    };
    if (window.confirm("Delete list?")) {
      processDelete();
    }
  }, [list, setState, user, onListDelete]);

  return (
    <div className="py-2 border-b border-gray-800">
      {state === "WORKING" ? (
        <Loading />
      ) : (
        <>
          <form onSubmit={handleEdition}>
            <section className="grid grid-cols-5 gap-x-2 mb-2">
              <input
                className="border col-span-2 outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 px-2 py-2 bg-transparent"
                placeholder="Edit list name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border col-span-2 outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 px-2 py-2 bg-transparent"
                placeholder="Edit list budget"
                type="number"
                value={budget.toString()}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <button
                className="bg-orange-900 text-center uppercase w-full p-2"
                type="submit"
              >
                <Icon path={mdiPencil} size={1} className="inline" /> edit
              </button>
            </section>
          </form>
          <button
            className="bg-red-900 text-center uppercase w-full p-2"
            onClick={handleDelete}
          >
            <Icon path={mdiDelete} size={1} className="inline" /> delete list
          </button>
        </>
      )}
    </div>
  );
};

export const EditList = React.memo(EditListBase);
