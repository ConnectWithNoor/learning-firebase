import { firestore } from "@/lib/firebase/server";
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
    const response = await firestore.collection("items").get();
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
