import { firebaseAuth, firestore } from "@/lib/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    // check if the user is admin or the user is the same as the requested user
    const validUser = isUserAdmin || user?.id === params.userId;
    if (!validUser) {
      return new NextResponse("Unauthorized", { status: 401 });
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
