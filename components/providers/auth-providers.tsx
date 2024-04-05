"use client";

import Cookies from "js-cookie";
import { User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { firebaseAuth } from "@/lib/firebase/client";

type Props = { children: React.ReactNode };

export function getAuthToken(): string | undefined {
  return Cookies.get("firebaseIdToken");
}

export function setAuthToken(token: string): string | undefined {
  return Cookies.set("firebaseIdToken", token, { secure: true });
}

export function removeAuthToken(): void {
  return Cookies.remove("firebaseIdToken");
}

type AuthContextType = {
  currentUser: User | null; // to check if the user is signin or signout
  isAdmin: boolean;
  isPro: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const FirebaseAuthContext = createContext<AuthContextType | null>(null);

function FirebaseAuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    if (!firebaseAuth) return;

    // auth state change listener
    const unsub = firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null);
        setIsAdmin(false);
        setIsPro(false);
        removeAuthToken();
      }
      if (user) {
        setCurrentUser(user);
        const token = await user.getIdToken();
        console.log(token);
        setAuthToken(token);

        // get the token values (custom claims)
        const tokenValues = await user.getIdTokenResult();
        setIsAdmin(tokenValues.claims.role === "admin");

        const userResponse = await fetch(`/api/users/${user.uid}`);
        if (userResponse.ok) {
          const userJson = await userResponse.json();
          if (userJson?.isPro) {
            setIsPro(true);
          }
        } else {
          console.error("Could not fetch user info");
        }
      }
    });

    return () => unsub();
  }, []);

  function loginGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!firebaseAuth) {
        reject();
        return;
      }

      signInWithPopup(firebaseAuth, new GoogleAuthProvider())
        .then((user) => {
          console.log("Signed in!");
          resolve();
        })
        .catch((err) => {
          console.error("error logging in with google", err);
          reject();
        });
    });
  }

  function logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!firebaseAuth) {
        reject();
        return;
      }
      firebaseAuth
        .signOut()
        .then(() => {
          console.log("signed out");
          resolve();
        })
        .catch(() => {
          console.error("error logging in with google");
          reject();
        });
    });
  }

  return (
    <FirebaseAuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isPro,
        loginGoogle,
        logout,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export const useAuth = () => useContext(FirebaseAuthContext);

export default FirebaseAuthProvider;
