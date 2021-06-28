import React, { useCallback, useEffect } from "react";
import { db } from "../../../firebase";
import { useAuth } from "../../../hooks/useAuth";
const ShoppingListItemBase: React.FC<{ data: any; list: string }> = ({
  data,
  list,
}) => {
  const user = useAuth();
  const { id, name, price, qtd } = data;
  const handleDelete = useCallback(() => {
    if (user) {
      const deleteItem = async () => {
        try {
          await db
            .collection("users")
            .doc(user.uid)
            .collection("lists")
            .doc(list)
            .collection("items")
            .doc(id)
            .delete();
        } catch (e) {
          console.log("error", e);
        }
      };
      const confirmed = window.confirm(`delete item ${name}?`);
      if (confirmed) {
        deleteItem();
      }
    }
  }, [user, list, id, name]);
  return (
    <li className="grid grid-cols-7 items-center">
      <span>{qtd}</span>
      <span className="col-span-3">{name}</span>
      <span>{price}</span>
      <span className="text-red-400">{price * qtd}</span>
      <button
        onClick={handleDelete}
        className="block outline-none border-0 w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 focus:bg-gray-400 mt-2 uppercase px-2 py-2"
      >
        x
      </button>
    </li>
  );
};

export const ShoppingListItem = React.memo(ShoppingListItemBase);
