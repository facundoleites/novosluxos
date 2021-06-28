import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingListItem } from "./Item";
const ShoppingListBase: React.FC<{ list: string | null }> = ({ list }) => {
  const [items, setItems] = useState<Array<any>>([]);
  const user = useAuth();
  const [status, setStatus] = useState<"IDLE" | "FETCHING">("IDLE");
  const listener = useRef<any>(null);
  useEffect(() => {
    if (listener.current) {
      listener.current();
    }
    if (user && list) {
      listener.current = db
        .collection("users")
        .doc(user.uid)
        .collection("lists")
        .doc(list)
        .collection("items")
        .onSnapshot((itemsSnap) => {
          console.log("itemsSnap", itemsSnap);
          setItems(
            itemsSnap.docs.map((item) => {
              return { id: item.id, ...item.data() };
            })
          );
        });
    }
    return () => {
      if (listener.current) {
        listener.current();
      }
    };
  }, [setItems, list, user]);
  return (
    <div className="flex-1 overflow-y-auto">
      <ul>
        {list
          ? items.map((item) => <ShoppingListItem list={list} data={item} />)
          : null}
      </ul>
      <div className="bg-red-900 text-center px-2 py-2 mt-2">
        {items.reduce((anterior, current) => {
          return current.total + anterior;
        }, 0)}
      </div>
    </div>
  );
};
export const ShoppingList = React.memo(ShoppingListBase);
