"use client";

import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { WebConfig } from "./app";
import { CONFIG_ELEMENT_ID } from "./configElement";

let ready: Promise<boolean> | null = null;
let auth: Auth | null = null;
let fs: Firestore | null = null;

function readConfig(): WebConfig | null {
  const el = document.getElementById(CONFIG_ELEMENT_ID);
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as WebConfig;
  } catch {
    return null;
  }
}

/** Init the SDK in the browser once. Resolves false when Firebase isn't configured. */
export function initClientFirebase(): Promise<boolean> {
  ready ??= (async () => {
    const config = readConfig();
    if (!config) return false;
    try {
      const [{ initializeApp, getApps, getApp }, { getAuth }, { getFirestore }] =
        await Promise.all([
          import("firebase/app"),
          import("firebase/auth"),
          import("firebase/firestore"),
        ]);
      const app = getApps().length ? getApp() : initializeApp(config);
      auth = getAuth(app);
      fs = getFirestore(app);
      return true;
    } catch {
      return false;
    }
  })();
  return ready;
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

export async function signInGoogle(): Promise<void> {
  const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import(
    "firebase/auth"
  );
  if (!auth) throw new Error("Firebase not initialised");
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    // Popup blockers (and some in-app browsers) — fall back to a full redirect.
    if (errorCode(e) === "auth/popup-blocked") await signInWithRedirect(auth, provider);
    else throw e;
  }
}

export async function signOutUser(): Promise<void> {
  const { signOut } = await import("firebase/auth");
  if (auth) await signOut(auth);
}

export function errorCode(e: unknown): string {
  return typeof e === "object" && e !== null && "code" in e
    ? String((e as { code: unknown }).code)
    : "";
}

export function isPermissionDenied(e: unknown): boolean {
  return errorCode(e).includes("permission-denied");
}

/** Closing the popup yourself isn't an error worth showing. */
export function isUserCancelled(e: unknown): boolean {
  const c = errorCode(e);
  return c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request";
}
