"use client";

import type { User } from "firebase/auth";
import {
  clientFs,
  initClientFirebase,
  onAuthChange,
} from "./firebase/clientAuth";

/**
 * Size profile facade.
 *  - Signed in with Firebase  → stored on Firestore at users/{uid}.sizeProfile,
 *    fetched back on every future visit (any device).
 *  - Signed out / no Firebase → device-local IndexedDB guest profile.
 * Local guest entries are merged up to Firestore on first sign-in.
 *
 * Store shape (both backends): key "{category}:{gender}" → ProfileEntry.
 */

export interface ProfileEntry {
  anchorValue: number;
  sourceBrandSlug: string;
  sourceBrandName?: string;
  sourceSizeLabel: string;
  confidence: "exact" | "inferred";
  updatedAt: number;
}

export type Profile = Record<string, ProfileEntry>;

export function entryKey(category: string, gender: string) {
  return `${category}:${gender}`;
}

/* ───────────────────────── local backend (IndexedDB) ───────────────────── */

const DB_NAME = "sizinghub";
const STORE = "profile";
const VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = run(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        t.onerror = () => reject(t.error);
      })
  );
}

async function localLoad(): Promise<Profile> {
  try {
    const db = await openDb();
    return await new Promise<Profile>((resolve, reject) => {
      const t = db.transaction(STORE, "readonly");
      const store = t.objectStore(STORE);
      const keysReq = store.getAllKeys();
      const valsReq = store.getAll();
      let keys: string[] = [];
      let vals: ProfileEntry[] = [];
      keysReq.onsuccess = () => {
        keys = keysReq.result as string[];
      };
      valsReq.onsuccess = () => {
        vals = valsReq.result as ProfileEntry[];
      };
      t.oncomplete = () => {
        const out: Profile = {};
        keys.forEach((k, i) => {
          if (vals[i]) out[k] = vals[i];
        });
        resolve(out);
      };
      t.onerror = () => reject(t.error);
    });
  } catch {
    return {};
  }
}

async function localSave(key: string, entry: ProfileEntry): Promise<void> {
  try {
    await tx("readwrite", (s) => s.put(entry, key));
  } catch {
    // storage unavailable — no-op
  }
}

async function localRemove(key: string): Promise<void> {
  try {
    await tx("readwrite", (s) => s.delete(key));
  } catch {
    // no-op
  }
}

async function localClear(): Promise<void> {
  try {
    await tx("readwrite", (s) => s.clear());
  } catch {
    // no-op
  }
}

/* ───────────────────────────── auth session ────────────────────────────── */

let authStarted = false;
let firstAuth: Promise<void> | null = null;
let currentUser: User | null = null;

async function firebaseReady(): Promise<boolean> {
  const ok = await initClientFirebase();
  if (!ok) return false;
  if (!authStarted) {
    authStarted = true;
    firstAuth = new Promise((resolve) =>
      onAuthChange((u) => {
        currentUser = u;
        resolve();
      })
    );
  }
  await firstAuth;
  return true;
}

export function currentUserNow(): User | null {
  return currentUser;
}

/** True once we know Firebase is configured (regardless of sign-in). */
export async function firebaseConfigured(): Promise<boolean> {
  return initClientFirebase();
}

/* ─────────────────────────── cloud backend ─────────────────────────────── */

async function cloudProfile(uid: string): Promise<Profile> {
  const { doc, getDoc } = await import("firebase/firestore");
  const fs = clientFs();
  if (!fs) return {};
  const snap = await getDoc(doc(fs, "users", uid));
  if (!snap.exists()) return {};
  return ((snap.data() as { sizeProfile?: Profile }).sizeProfile ?? {}) as Profile;
}

async function cloudWriteMeta(user: User) {
  return {
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    lastSeenAt: Date.now(),
  };
}

/* ───────────────────────────── facade API ──────────────────────────────── */

export async function loadProfile(): Promise<Profile> {
  try {
    const ok = await firebaseReady();
    if (ok && currentUser) {
      const cloud = await cloudProfile(currentUser.uid);
      const local = await localLoad();
      // one-time guest → cloud merge
      if (Object.keys(cloud).length === 0 && Object.keys(local).length > 0) {
        const { doc, setDoc } = await import("firebase/firestore");
        const fs = clientFs();
        if (fs) {
          await setDoc(
            doc(fs, "users", currentUser.uid),
            {
              ...(await cloudWriteMeta(currentUser)),
              createdAt: Date.now(),
              sizeProfile: local,
            },
            { merge: true }
          );
        }
        return local;
      }
      return cloud;
    }
    return await localLoad();
  } catch {
    return localLoad();
  }
}

export async function getEntry(
  category: string,
  gender: string
): Promise<ProfileEntry | null> {
  const p = await loadProfile();
  return p[entryKey(category, gender)] ?? p[entryKey(category, "unisex")] ?? null;
}

export async function saveEntry(
  category: string,
  gender: string,
  entry: Omit<ProfileEntry, "updatedAt">
): Promise<void> {
  const full: ProfileEntry = { ...entry, updatedAt: Date.now() };
  const key = entryKey(category, gender);
  await localSave(key, full);
  try {
    const ok = await firebaseReady();
    if (ok && currentUser) {
      const { doc, setDoc } = await import("firebase/firestore");
      const fs = clientFs();
      if (fs) {
        await setDoc(
          doc(fs, "users", currentUser.uid),
          {
            ...(await cloudWriteMeta(currentUser)),
            [`sizeProfile.${key}`]: full,
          },
          { merge: true }
        );
      }
    }
  } catch {
    // cloud unavailable — local copy already saved
  }
}

export async function removeEntry(key: string): Promise<void> {
  await localRemove(key);
  try {
    const ok = await firebaseReady();
    if (ok && currentUser) {
      const { deleteField, doc, updateDoc } = await import("firebase/firestore");
      const fs = clientFs();
      if (fs) {
        await updateDoc(doc(fs, "users", currentUser.uid), {
          [`sizeProfile.${key}`]: deleteField(),
        });
      }
    }
  } catch {
    // no-op
  }
}

export async function clearProfile(): Promise<void> {
  await localClear();
  try {
    const ok = await firebaseReady();
    if (ok && currentUser) {
      const { doc, updateDoc } = await import("firebase/firestore");
      const fs = clientFs();
      if (fs) {
        await updateDoc(doc(fs, "users", currentUser.uid), { sizeProfile: {} });
      }
    }
  } catch {
    // no-op
  }
}
