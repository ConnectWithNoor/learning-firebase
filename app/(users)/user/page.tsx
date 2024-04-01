import { ItemAccess, ItemType } from "@/app/api/items/route";
import React from "react";

type Props = {};

async function UserPage({}: Props) {
  let items: ItemType[] = [];

  const response = await fetch(`${process.env.API_URL}/api/items`);
  if (response.ok) {
    const itemsJson = await response.json();
    if (itemsJson && Array.isArray(itemsJson)) {
      items = itemsJson;
    }
  }
  return (
    <div>
      <h1 className="text-white text-xl mb-10">User Page</h1>
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className="flex items-center justify-between w-full gap-20 bg-slate-100/10 rounded text-slate-200 text-sm font-semibold px-2 py-1 mb-2"
          >
            <p>{item.title}</p>
            <span
              className={`${
                item.access === ItemAccess.ADMIN
                  ? "bg-orange-400"
                  : item.access === ItemAccess.PRO
                  ? "bg-emerald-400"
                  : item.access === ItemAccess.USER
                  ? "bg-pink-600"
                  : "bg-slate-400"
              } text-white text-xs px-2 py-1 rounded-full`}
            >
              {item.access}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default UserPage;
