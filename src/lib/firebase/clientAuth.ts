"use client";

import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";
import type { WebConfig } from "./app";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let fs: Firestore | null = null;

/** Fetch the public config from the server and init the SDK in-browser. */
export async function initClientFirebase(): Promise<boolean> {
  if (app) return true;
  try {
    const res = await fetch("/api/firebase/config");
    const data = (await res.json()) as {
      configured: boolean;
      config?: WebConfig;
    };
    if (!data.configured || !data.config) return false;
    const [{ initializeApp, getApps, getApp }, { getAuth }, { getFirestore }] =
      await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
        import("firebase/firestore"),
      ]);
    app = getApps().length ? getApp() : initializeApp(data.config);
    auth = getAuth(app);
    fs = getFirestore(app);
    return true;
  } catch {
    return false;
  }
}

export function clientAuth(): Auth | null {
  return auth;
}

export function clientFs(): Firestore | null {
  return fs;
}

export function onAuthChange(cb: (u: User | null) => void): () => void {
  if (!auth) return () => {};
  return auth.onAuthStateChanged(cb);
}

export async function signInGoogle(): Promise<User> {
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  if (!auth) throw new Error("Firebase not initialised");
  const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  return cred.user;
}

export async function signOutUser(): Promise<void> {
  const { signOut } = await import("firebase/auth");
  if (auth) await signOut(auth);
}

export function isPermissionDenied(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    String((e as { code: unknown }).code).includes("permission-denied")
  );
}
