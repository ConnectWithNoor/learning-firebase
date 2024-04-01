## Learning how to use Firebase with Next.js server route

![Preview]()

#### Now Known as [Auth.js](https://authjs.dev/)

First, do the following:

```js
fill .env file
add lib/firebase/functions/service-account.json file // download it from your firebase project setting -> service account

```

Second, run the development server:

```bash
npm install
npm run dev
npm run emulators
```

#### Firebase services used

- Firebase Authentication
- Firebase Firestore
- Firebase Functions
- Firebase Emulator

#### Project Features

- Firebase server: Abstraction of route over firebase-admin's firestore to use it on server components and API routes/server actions.
- Setup `emulator` env to use firebase emulator service in our local system (check pkg.json).
- FirebaseAuthContext to keep track of current logged in users.
- Create FirebaseAuth using client initalization. You can do the same thing for server as well and use it as a server action.

#### Authentication Strategies used

1 - Login with Google (OAuth)

Made by [Noor Muhammad](https://www.linkedin.com/in/connectwithnoor)
