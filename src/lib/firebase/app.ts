import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import type { FirebaseOptions } from "firebase/app";

/**
 * Firebase WEB-APP config (the six public keys from
 * Firebase console → Project settings → Your apps → Web app).
 * These are public identifiers, safe to use server-side and safe to serve
 * to the browser via /api/firebase/config for admin sign-in.
 */
export interface WebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getFirebaseConfig(): WebConfig | null {
  const apiKey = process.env.FIREBASE_API_KEY ?? "";
  const projectId = process.env.FIREBASE_PROJECT_ID ?? "";
  const appId = process.env.FIREBASE_APP_ID ?? "";
  if (!apiKey || !projectId || !appId) return null;
  return {
    apiKey,
    authDomain:
      process.env.FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId,
  };
}

export function hasFirebaseConfig(): boolean {
  return getFirebaseConfig() !== null;
}

let cachedApp: FirebaseApp | null = null;
let cachedFs: Firestore | null = null;

/** Works in the Next.js server runtime (SSR + API routes). */
export function getWebApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  const cfg = getFirebaseConfig();
  if (!cfg) throw new Error("Firebase web config missing (FIREBASE_* env vars)");
  cachedApp = getApps().length ? getApp() : initializeApp(cfg as FirebaseOptions);
  return cachedApp;
}

export function getFsWeb(): Firestore {
  if (cachedFs) return cachedFs;
  cachedFs = getFirestore(getWebApp());
  return cachedFs;
}
