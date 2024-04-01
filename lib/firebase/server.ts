import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

import serviceAccount from "@/lib/firebase/service-account.json";

const currentApps = getApps();
let firestore: Firestore | null = null;

if (currentApps.length <= 0) {
  if (process.env.NEXT_PUBLIC_APP_ENV === "emulator") {
    // if we have emulator environment variable set, we will use the emulator
    process.env["FIRESTORE_EMULATOR_HOST"] =
      process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
      process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
  }
  // initializing the firebase app
  const app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  firestore = getFirestore(app);
} else {
  // if we have already initialized the app, we will use the first one
  firestore = getFirestore(currentApps[0]);
}

export { firestore };
