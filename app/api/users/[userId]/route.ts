import { firestore } from "@/lib/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    if (!firestore) {
      return new NextResponse("No firebase", { status: 500 });
    }

    const userDocument = await firestore
      .collection("users")
      .doc(params.userId)
      .get();

    const data = userDocument.data();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
