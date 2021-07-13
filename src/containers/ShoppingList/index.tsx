import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import {
  ShoppingListItem,
  ShoppingListItemData,
  ShoppingListItemDataFirestore,
} from "./Item";

import firebase from "firebase/app";
import Icon from "@mdi/react";
import { mdiSortVariant } from "@mdi/js";

export interface ShoppingListData {
  name: string;
  id: string;
  date: Date;
  budget: number;
}

export interface ShoppingListDataFirestore {
  name: string;
  date: firebase.firestore.Timestamp;
  budget: number | undefined;
}

enum Order {
  Date = "date",
  Name = "name",
  Quantity = "quantity",
  Price = "price",
  TotalPrice = "total_price",
}

enum OrderDirection {
  Top = "top",
  Bottom = "bottom",
}

const fetchListInfo = async (
  user: string,
  id: string
): Promise<ShoppingListData> => {
  const snap = await db.doc(`users/${user}/lists/${id}`).get();
  const { date, budget, ...data } = snap.data() as ShoppingListDataFirestore;
  return {
    ...data,
    id: snap.id,
    date: date.toDate(),
    budget: budget ? budget : Number.POSITIVE_INFINITY,
  };
};

const sortItems = (
  items: ShoppingListItemData[],
  orderBy: Order,
  orderDirection: OrderDirection
) => {
  let sortedItems = [];
  switch (orderBy) {
    case Order.Date:
      sortedItems = items.sort(
        (itemA, itemB) => itemA.date.getTime() - itemB.date.getTime()
      );
      break;
    case Order.TotalPrice:
      sortedItems = items.sort((itemA, itemB) => {
        return itemA.total > itemB.total ? 1 : -1;
      });
      break;
    case Order.Price:
      sortedItems = items.sort((itemA, itemB) => {
        return itemA.price > itemB.price ? 1 : -1;
      });
      break;
    case Order.Quantity:
      sortedItems = items.sort((itemA, itemB) => {
        return itemA.qtd > itemB.qtd ? 1 : -1;
      });
      break;
    case Order.Name:
      sortedItems = items.sort((itemA, itemB) => {
        return itemA.name.localeCompare(itemB.name);
      });
      break;
    default:
      sortedItems = items.sort((itemA, itemB) => {
        return itemA.name.localeCompare(itemB.name);
      });
      break;
  }
  return orderDirection === OrderDirection.Top
    ? sortedItems.reverse()
    : sortedItems;
};

const TotalsDisplay: React.FC<{ total: number; budget: number }> = ({
  total,
  budget,
}) => {
  const budgetFormatted = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  }).format(budget);
  const availableBudget = budget - total;
  const totalFormatted = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  }).format(total);
  const availableBudgetFormatted = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  }).format(availableBudget);
  return (
    <section className="flex justify-between text-red-100">
      <section>
        <span className="text-red-400">Total: </span>
        <strong>{totalFormatted}</strong>
      </section>
      {Number.isFinite(availableBudget) ? (
        <section>
          <span className="text-red-400">Budget: </span>
          <strong>{availableBudgetFormatted}</strong>
          <span className="text-red-300"> / {budgetFormatted}</span>
        </section>
      ) : null}
    </section>
  );
};
const ShoppingListBase: React.FC<{ list: string | null }> = ({ list }) => {
  const [items, setItems] = useState<Array<ShoppingListItemData>>([]);
  const user = useAuth();
  const listener = useRef<any>(null);
  const [order, setOrder] = useState<Order>(Order.Date);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(
    OrderDirection.Top
  );
  const [listInfo, setListInfo] = useState<ShoppingListData>();
  useEffect(() => {
    if (listener.current) {
      listener.current();
    }
    if (user && list) {
      const fetchInfo = async () => {
        const info = await fetchListInfo(user.uid, list);
        setListInfo(info);
      };
      fetchInfo();
      listener.current = db
        .collection("users")
        .doc(user.uid)
        .collection("lists")
        .doc(list)
        .collection("items")
        .onSnapshot((itemsSnap) => {
          setItems(
            itemsSnap.docs.map((item) => {
              const { date, ...data } =
                item.data() as ShoppingListItemDataFirestore;
              return {
                ...data,
                id: item.id,
                date: typeof date !== "undefined" ? date.toDate() : new Date(),
              } as ShoppingListItemData;
            })
          );
        });
    }
    return () => {
      if (listener.current) {
        listener.current();
      }
    };
  }, [setItems, list, user, setListInfo]);

  const totalValue = items.reduce((anterior, current) => {
    return current.total + anterior;
  }, 0);

  const sortedList = sortItems(items, order, orderDirection);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto relative">
      <div className="bg-gradient-to-r from-red-900 to-gray-800 px-2 py-2 left-0 w-full fixed">
        <TotalsDisplay
          total={totalValue}
          budget={listInfo ? listInfo.budget : Number.POSITIVE_INFINITY}
        />
      </div>
      <ul style={{ marginTop: 40 }} className="pt-2">
        <section className="flex justify-end">
          <select
            className="bg-gray-800 p-4 mr-1 rounded"
            placeholder="order by"
            value={order}
            onChange={(e) => setOrder(e.target.value as Order)}
          >
            <option value={Order.Date}>Date</option>
            <option value={Order.Name}>Name</option>
            <option value={Order.Price}>Price per unit</option>
            <option value={Order.TotalPrice}>Price total</option>
            <option value={Order.Quantity}>Quantity</option>
          </select>
          <button
            className="p-4 bg-gray-800 rounded ml-1"
            onClick={() =>
              setOrderDirection((order) =>
                order === OrderDirection.Top
                  ? OrderDirection.Bottom
                  : OrderDirection.Top
              )
            }
          >
            <Icon
              path={mdiSortVariant}
              className="inline"
              size={1}
              rotate={orderDirection === OrderDirection.Top ? 0 : 180}
            />
          </button>
        </section>
        {list
          ? sortedList.map((item) => (
              <ShoppingListItem
                key={`shopping-list-item-${item.id}`}
                list={list}
                data={item}
              />
            ))
          : null}
      </ul>
    </div>
  );
};
export const ShoppingList = React.memo(ShoppingListBase);
