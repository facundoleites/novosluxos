import React, { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { NewItem } from "../NewItem";
import { ShoppingList } from "../ShoppingList";
import { ShoppingListHeader } from "../ShoppingListHeader";
const ListBase: React.FC<{ height: number }> = ({ height }) => {
  const user = useAuth();
  const [status, setStatus] = useState<"IDLE" | "FETCHING">("IDLE");
  const [list, setList] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      const getCurrentList = async () => {
        setStatus("FETCHING");
        const snap = await db
          .collection("users")
          .doc(user.uid)
          .collection("lists")
          .orderBy("date", "desc")
          .limit(1)
          .get();
        if (snap.docs.length) {
          setList(snap.docs[0].id);
        } else {
          console.log("there are not current list");
        }
        setStatus("IDLE");
      };
      getCurrentList();
    } else {
      setStatus("IDLE");
    }
  }, [user, setStatus, setList]);
  return (
    <>
      {status === "FETCHING" ? (
        <Loading />
      ) : (
        <>
          <ShoppingListHeader setList={setList} list={list} height={height} />
          <ShoppingList list={list} />
          <NewItem list={list} />
        </>
      )}
    </>
  );
};
export const List = React.memo(ListBase);
