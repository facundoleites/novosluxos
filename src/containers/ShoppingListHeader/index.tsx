import React, { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingListData, ShoppingListDataFirestore } from "../ShoppingList";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { NewShoppingList } from "../NewShoppingList";
import { EditList } from "../EditList";

const fetchLists = async (user: string) => {
  const snap = await db
    .collection(`users/${user}/lists`)
    .orderBy("date", "desc")
    .get();
  const items: ShoppingListData[] = snap.docs.map((doc) => {
    const { date, budget, ...data } = doc.data() as ShoppingListDataFirestore;
    return {
      ...data,
      date: date.toDate(),
      id: doc.id,
      budget: budget ? budget : Number.POSITIVE_INFINITY,
    };
  });
  return items;
};
export const ShoppingListHeaderBase: React.FC<{
  list: string | null;
  height: number;
  setList: (listId: string) => void;
}> = ({ list, setList, height }) => {
  const [lists, setLists] = useState<ShoppingListData[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingListData>();
  const user = useAuth();
  const [listOpened, setListOpened] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, [setMounted]);
  useEffect(() => {
    if (lists.length > 0 && list) {
      setCurrentList(lists.find(({ id: listItemId }) => listItemId === list));
    }
  }, [setCurrentList, list, lists]);

  const fetchUserLists = useCallback(
    (user: string) => {
      const fetch = async () => {
        const userLists = await fetchLists(user);
        setLists(userLists);
      };

      fetch();
    },
    [setLists]
  );

  useEffect(() => {
    if (user && mounted) {
      fetchUserLists(user.uid);
    }
  }, [user, fetchUserLists, list, mounted]);
  return (
    <>
      <header className="grid grid-cols-6 gap-x-2 items-start pb-2 bg-gray-900">
        <section className="col-span-6">
          <button
            className="flex text-left block outline-none border-0 w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 focus:bg-gray-600 mt-2 uppercase px-2 py-2"
            onClick={() => setListOpened(!listOpened)}
          >
            <span className="text-gray-600">list</span>
            <strong className="text-gray-500 flex-grow mx-2">
              {currentList ? currentList.name : ""}
            </strong>
            <Icon
              path={listOpened ? mdiChevronUp : mdiChevronDown}
              size={1}
              className="inline"
            />
          </button>
          <ul
            className="overflow-y-auto"
            style={{ maxHeight: `${height - 80}px` }}
          >
            {listOpened ? (
              <>
                {currentList ? (
                  <li>
                    <EditList
                      list={currentList}
                      onListDelete={() => window.location.reload()}
                      onListEdit={() => window.location.reload()}
                    />
                  </li>
                ) : null}
                <li>
                  <NewShoppingList
                    setList={(newList) => {
                      setList(newList);
                      setListOpened(false);
                    }}
                  />
                </li>
                {lists.map((thisList) => (
                  <li
                    key={`shopping-list-header-${thisList.id}`}
                    className="py-2 flex"
                    onClick={() => {
                      setList(thisList.id);
                      setListOpened(false);
                    }}
                  >
                    <span className="text-gray-600 mr-2">
                      {thisList.date.toLocaleString(undefined, {
                        dateStyle: "short",
                      })}
                    </span>
                    <span>{thisList.name}</span>
                  </li>
                ))}
              </>
            ) : null}
          </ul>
        </section>
      </header>
    </>
  );
};

export const ShoppingListHeader = React.memo(ShoppingListHeaderBase);
