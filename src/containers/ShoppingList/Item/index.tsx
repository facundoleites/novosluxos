import React, { useCallback } from "react";
import { db } from "../../../firebase";
import { useAuth } from "../../../hooks/useAuth";
import firebase from "firebase/app";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

export interface ShoppingListItemData {
  id: string;
  name: string;
  price: number;
  qtd: number;
  total: number;
  date: Date;
}

export interface ShoppingListItemDataFirestore {
  name: string;
  price: number;
  qtd: number;
  total: number;
  date: firebase.firestore.Timestamp;
}

const ShoppingListItemBase: React.FC<{
  data: ShoppingListItemData;
  list: string;
}> = ({ data, list }) => {
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

  const formatedPrice = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  }).format(price);

  const formatedTotalPrice = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  }).format(price * qtd);

  const formattedQuantity = Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  }).format(qtd);
  return (
    <li className="grid grid-cols-7 items-center gap-x-3 py-1">
      <span className="col-span-4">
        <span className="text-gray-600">{formattedQuantity}</span> {name}
      </span>
      <span className="text-gray-600 text-right">{formatedPrice}</span>
      <span className="text-red-400  text-right">{formatedTotalPrice}</span>
      <button
        onClick={handleDelete}
        className="inline outline-none border-0 w-full text-gray-700 hover:text-gray-100 hover:bg-gray-700 active:bg-gray-600 focus:bg-gray-500 uppercase px-2 py-2 rounded-full"
      >
        <Icon path={mdiClose} size={1} className="inline" />
      </button>
    </li>
  );
};

export const ShoppingListItem = React.memo(ShoppingListItemBase);
