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
- Create FirebaseAuth (for logging and logout) using client initalization. [Read here](https://stackoverflow.com/a/42966170)
- Created firebaseAuth in server as well
- Use of Firebase functions (they run in cloud for everytime state changes in authentication, firestore, storage, etc.)
- flow goes from user first ever signin (client) triggers the firebase function which creates that new user collection in firestore along with a custom claim (role for the user on the authentication side).
- Every signin fetches that custom role (getIdTokenResult) to check if it is admin/pro/normal user and keep it in Auth Context provider(this is for client compoents)
- For server compoenents, since it doesn't have access to Auth context provider, we have to store the jwt token in cookies to handle dynamic role based route protection on server components.
- Added jwt bearer authentication on list API to access only role based data.
- Added a security measure in user API by jwt bearer authentication to make sure user can only access data which belong to them.

- firebase hosting has issues with server actions, to you need to replace the server actions with firebase functions if you want to deploy on firebase. Vercel is a good alternative.

#### Authentication Strategies used

1 - Login with Google (OAuth)

#### Useful resources for firebase with NextJS

1 - (Client side auth, firestore, CRUD operations, server actions to replace client CRUD to server)[https://www.youtube.com/watch?v=C3iYBxO8Iao]
2 - (Firebase functions)[https://www.youtube.com/watch?v=A77JMPOdMdc]
3 - (client firebase storage)[https://www.youtube.com/watch?v=hrlmbRo1iOQ]

Made by [Noor Muhammad](https://www.linkedin.com/in/connectwithnoor)
