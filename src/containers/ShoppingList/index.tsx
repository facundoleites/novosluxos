import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import {
  ShoppingListItem,
  ShoppingListItemData,
  ShoppingListItemDataFirestore,
} from "./Item";
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
const ShoppingListBase: React.FC<{ list: string | null }> = ({ list }) => {
  const [items, setItems] = useState<Array<ShoppingListItemData>>([]);
  const user = useAuth();
  const listener = useRef<any>(null);
  const [order, setOrder] = useState<Order>(Order.Date);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(
    OrderDirection.Top
  );
  console.log({ order });
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
              const { date, ...data } =
                item.data() as ShoppingListItemDataFirestore;
              console.log({ date });
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
  }, [setItems, list, user]);

  const totalValue = items.reduce((anterior, current) => {
    return current.total + anterior;
  }, 0);
  const totalFormatted = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  }).format(totalValue);

  const sortedList = sortItems(items, order, orderDirection);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto relative">
      <div className="bg-red-900 px-2 py-2 mt-2 fixed grid grid-cols-3 items-center">
        <section>
          Total: <span className="font-black">{totalFormatted}</span>
        </section>
        <select
          className="bg-gray-800 p-4"
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
          className="p-4 bg-gray-800 ml-2 rounded"
          onClick={() =>
            setOrderDirection((order) =>
              order === OrderDirection.Top
                ? OrderDirection.Bottom
                : OrderDirection.Top
            )
          }
        >
          {orderDirection === OrderDirection.Bottom ? "👆" : "👇"}
        </button>
      </div>
      <ul className="mt-20">
        {list
          ? sortedList.map((item) => (
              <ShoppingListItem list={list} data={item} />
            ))
          : null}
      </ul>
    </div>
  );
};
export const ShoppingList = React.memo(ShoppingListBase);
