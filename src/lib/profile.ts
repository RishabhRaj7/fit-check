"use client";

/**
 * Guest size profile, persisted in IndexedDB (no sign-in friction).
 * Store: sizinghub / profile — key: "{category}:{gender}", value: ProfileEntry.
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

const DB_NAME = "sizinghub";
const STORE = "profile";
const VERSION = 1;

export function entryKey(category: string, gender: string) {
  return `${category}:${gender}`;
}

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

export async function loadProfile(): Promise<Profile> {
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

export async function getEntry(
  category: string,
  gender: string
): Promise<ProfileEntry | null> {
  try {
    const exact = await tx<ProfileEntry | undefined>("readonly", (s) =>
      s.get(entryKey(category, gender))
    );
    if (exact) return exact;
    const unisex = await tx<ProfileEntry | undefined>("readonly", (s) =>
      s.get(entryKey(category, "unisex"))
    );
    return unisex ?? null;
  } catch {
    return null;
  }
}

export async function saveEntry(
  category: string,
  gender: string,
  entry: Omit<ProfileEntry, "updatedAt">
): Promise<void> {
  try {
    await tx("readwrite", (s) =>
      s.put({ ...entry, updatedAt: Date.now() }, entryKey(category, gender))
    );
  } catch {
    // storage unavailable — profile simply won't persist
  }
}

export async function removeEntry(key: string): Promise<void> {
  try {
    await tx("readwrite", (s) => s.delete(key));
  } catch {
    // no-op
  }
}

export async function clearProfile(): Promise<void> {
  try {
    await tx("readwrite", (s) => s.clear());
  } catch {
    // no-op
  }
}
