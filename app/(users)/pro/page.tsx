import { ItemAccess, ItemType } from "@/app/api/items/route";
import { firebaseAuth } from "@/lib/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import React from "react";

type Props = {};

async function ProPage({}: Props) {
  // get user jwt token by cookies
  const cookieStore = cookies();
  const authToken = cookieStore.get("firebaseIdToken")?.value;

  if (!authToken) {
    return <h1 className="text-white text-xl mb-10">Restricted page</h1>;
  }
  // check if it is a valid token
  let user: DecodedIdToken | undefined = undefined;
  try {
    user = await firebaseAuth?.verifyIdToken(authToken);
  } catch (error) {
    console.error(error);
  }

  if (!user) {
    return <h1 className="text-white text-xl mb-10">Restricted page</h1>;
  }

  // get the user role from the firestore
  let userInfo = null;

  const userInfoResp = await fetch(
    `${process.env.API_URL}/api/users/${user.uid}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  if (userInfoResp.ok) {
    userInfo = (await userInfoResp.json()) as { isPro: boolean };
  }

  const isPro = userInfo?.isPro;

  // if user dont have the pro role
  if (!isPro) {
    return <h1 className="text-white text-xl mb-10">Restricted page</h1>;
  }

  let items: ItemType[] = [];

  const response = await fetch(`${process.env.API_URL}/api/items`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (response.ok) {
    const itemsJson = await response.json();
    if (itemsJson && Array.isArray(itemsJson)) {
      items = itemsJson;
    }
  }
  return (
    <div>
      <h1 className="text-white text-xl mb-10">Pro Page</h1>
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

export default ProPage;
