"use client";

import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

const currentApps = getApps();
let firebaseAuth: Auth | null = null;
// this data is not senssitive, so we can expose it
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAJI8cgZmv1_uqwQ7Gl0fm4hgpDM7-erTA",
  authDomain: "learning-nextjs-firebase-2429f.firebaseapp.com",
  projectId: "learning-nextjs-firebase-2429f",
  storageBucket: "learning-nextjs-firebase-2429f.appspot.com",
  messagingSenderId: "993366805310",
  appId: "1:993366805310:web:6a049ff8bda4e471317a6f",
};

if (currentApps.length <= 0) {
  // initializing the firebase app
  const app = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
} else {
  // if we have already initialized the app, we will use the first one
  firebaseAuth = getAuth(currentApps[0]);
}

// if we have emulator environment variable set, we will use the emulator
if (
  process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
  process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH &&
  firebaseAuth
) {
  connectAuthEmulator(
    firebaseAuth,
    `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
  );
}

export { firebaseAuth };
