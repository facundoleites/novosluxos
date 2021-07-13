import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useState } from "react";
import { Loading } from "../../components/Loading";
import { db, now } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
const NewItemBase: React.FC<{ list: string | null }> = ({ list }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [qtd, setQtd] = useState(1);
  const user = useAuth();
  const [state, setState] = useState<"IDLE" | "CREATING" | "ERROR">("IDLE");
  const handleSubmit = useCallback(() => {
    if (user && list) {
      setState("CREATING");
      db.collection("users")
        .doc(user.uid)
        .collection("lists")
        .doc(list)
        .collection("items")
        .add({
          name,
          price,
          qtd,
          total: price * qtd,
          date: now(),
        })
        .catch((e) => {
          console.error(e);
          setState("ERROR");
        })
        .then(() => {
          setState("IDLE");
        });
    }
  }, [name, price, qtd, user, list, setState]);
  return (
    <div className="grid grid-cols-6 gap-x-2 py-1">
      {state === "CREATING" ? (
        <div className="col-span-6">
          <Loading />
        </div>
      ) : state === "ERROR" ? (
        <div className="col-span-6 bg-red-900">OPS!</div>
      ) : null}
      <input
        className="col-span-6 border outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 w-full mt-2 px-2 py-2 bg-transparent"
        placeholder="New item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="col-span-2 border outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 w-full mt-2 px-2 py-2 bg-transparent"
        placeholder="price"
        step={0.01}
        value={String(price)}
        type="number"
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <input
        className="col-span-2 border outline-none border-gray-700 hover:border-gray-600 focus:border-gray-500 w-full mt-2 px-2 py-2 bg-transparent"
        type="number"
        value={String(qtd)}
        onChange={(e) => setQtd(Number(e.target.value))}
      />
      <button
        className="col-span-2 block outline-none border-0 w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 focus:bg-gray-400 mt-2 uppercase px-2 py-2"
        onClick={handleSubmit}
      >
        <Icon path={mdiPlus} size={1} className="inline" />
      </button>
    </div>
  );
};
export const NewItem = React.memo(NewItemBase);
