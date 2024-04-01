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
  { id: "5", title: "Item 5", access: ItemAccess.USER },
  { id: "6", title: "Item 6", access: ItemAccess.PRO },
  { id: "7", title: "Item 7", access: ItemAccess.ADMIN },
  { id: "8", title: "Item 8", access: ItemAccess.USER },
  { id: "9", title: "Item 9", access: ItemAccess.PRO },
  { id: "10", title: "Item 10", access: ItemAccess.ADMIN },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(defaultItems);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
