import { firebaseAuth, firestore } from "@/lib/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export enum ItemAccess {
  PUBLIC = "PUBLIC",
  USER = "USER",
  PRO = "PRO",
  ADMIN = "ADMIN",
}

export type ItemType = {
  id: string;
  title: string;
  access: ItemAccess;
};

const defaultItems: ItemType[] = [
  { id: "1", title: "Item 1", access: ItemAccess.PUBLIC },
  { id: "2", title: "Item 2", access: ItemAccess.USER },
  { id: "3", title: "Item 3", access: ItemAccess.PRO },
  { id: "4", title: "Item 4", access: ItemAccess.ADMIN },
  { id: "5", title: "Item 5", access: ItemAccess.PUBLIC },
  { id: "6", title: "Item 6", access: ItemAccess.PRO },
  { id: "7", title: "Item 7", access: ItemAccess.ADMIN },
  { id: "8", title: "Item 8", access: ItemAccess.USER },
  { id: "9", title: "Item 9", access: ItemAccess.PRO },
  { id: "10", title: "Item 10", access: ItemAccess.ADMIN },
];

export async function GET(request: NextRequest) {
  try {
    if (!firestore) {
      return new NextResponse("No firebase", { status: 500 });
    }

    // get authoirzation token from the request headers
    const authToken = request.headers.get("authorization")?.split("Bearer ")[1];

    let user: DecodedIdToken | undefined = undefined;
    if (authToken)
      // check if it is a valid token & get user custom claims (role) for admin
      try {
        user = await firebaseAuth?.verifyIdToken(authToken);
      } catch (error) {
        console.error(error);
      }

    const isUserAdmin = user?.role === "admin";

    // get the user role from the firestore
    let userInfo = null;
    if (user) {
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
    }

    const isUserPro = userInfo?.isPro;

    // get the items based on the user role
    const firestoreCall =
      user && !isUserPro && !isUserAdmin
        ? firestore //for free user
            .collection("items")
            .where("access", "in", [ItemAccess.PUBLIC, ItemAccess.USER])
            .get()
        : isUserPro && !isUserAdmin
        ? firestore //for pro user
            .collection("items")
            .where("access", "in", [
              ItemAccess.PUBLIC,
              ItemAccess.USER,
              ItemAccess.PRO,
            ])
            .get()
        : isUserAdmin
        ? firestore.collection("items").get() //for admin
        : firestore //for public (not logged in user)
            .collection("items")
            .where("access", "==", ItemAccess.PUBLIC)
            .get();

    const response = await firestoreCall;
    const items = response.docs.map((doc) => doc.data() as ItemType);

    // if the collection is empty, we will seed the data by batch.
    // batch means all data will be inserted at once, if one fails, all will fail.
    if (items.length <= 0) {
      const batch = firestore.batch();
      defaultItems.forEach((item) => {
        const itemRef = firestore?.collection("items").doc();
        if (itemRef) {
          batch.set(itemRef, item);
        }
      });
      await batch.commit();
      return NextResponse.json(defaultItems);
    }

    return NextResponse.json(items);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
