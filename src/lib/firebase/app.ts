import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase WEB-APP config (the six public keys from
 * Firebase console → Project settings → Your apps → Web app).
 * These are public identifiers — the server reads the public catalogue with
 * them, and the root layout hands them to the browser for Google sign-in.
 * Access control lives in firestore.rules, not in keeping these secret.
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
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId,
  };
}

let cachedFs: Firestore | null = null;

/** Firestore handle for the Next.js server runtime (SSR + route handlers). */
export function getFsWeb(): Firestore {
  if (cachedFs) return cachedFs;
  const cfg = getFirebaseConfig();
  if (!cfg) throw new Error("Firebase web config missing — set the FIREBASE_* env vars");
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(cfg);
  cachedFs = getFirestore(app);
  return cachedFs;
}
