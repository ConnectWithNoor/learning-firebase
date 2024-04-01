import { auth, config } from "firebase-functions";
import { firestore } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase-admin/app";

// connect firebase connections with our app
initializeApp(config().firebase);

// run function everytime a user is created
const onUserCreate = auth.user().onCreate(async (user) => {
  if (user.email && user.email === "admin@example.com") {
    await firestore().doc(`users/${user.uid}`).create({
      isPro: true,
    });

    const customClaims = {
      role: "admin",
    };

    try {
      await getAuth().setCustomUserClaims(user.uid, customClaims);
    } catch (error) {
      console.log(error);
    }

    return;
  }

  if (user.email && user.email === "pro@example.com") {
    await firestore().doc(`users/${user.uid}`).create({
      isPro: true,
    });

    return;
  }

  // set isPro to false, when a new user is created.

  await firestore().doc(`users/${user.uid}`).create({
    isPro: false,
  });

  return;
});

export { onUserCreate };
