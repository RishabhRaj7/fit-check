"use client";

import { useSyncExternalStore } from "react";
import type { Unsubscribe } from "firebase/firestore";
import { siblingsOf, type CategoryId, type ShopperGender } from "@/lib/categories";
import {
  clientFs,
  initClientFirebase,
  onAuthChange,
  signInGoogle,
  signOutUser,
} from "@/lib/firebase/clientAuth";

/**
 * The size profile — one anchor per "{category}:{gender}".
 *
 *  Signed out → a guest profile in localStorage, on this device only.
 *  Signed in  → users/{uid}.sizeProfile in Firestore, live across devices.
 *
 * On sign-in the guest entries are merged into the account (newer entry wins)
 * and the guest copy is cleared, so the next person to sign in on a shared
 * device never inherits someone else's sizes.
 */

export interface ProfileEntry {
  anchorValue: number;
  /** Brand the anchor came from, or "measured". */
  sourceBrandSlug: string;
  sourceBrandName?: string;
  sourceSizeLabel: string;
  confidence: "exact" | "inferred";
  updatedAt: number;
}

export type Profile = Record<string, ProfileEntry>;

export interface ProfileUser {
  uid: string;
  email: string | null;
  name: string | null;
}

export interface ProfileState {
  /** False until the first load settles (guest store read + auth resolved). */
  ready: boolean;
  /** Firebase is configured, so sign-in / sync is available. */
  syncAvailable: boolean;
  user: ProfileUser | null;
  profile: Profile;
  gender: ShopperGender;
}

export const entryKey = (category: string, gender: string) => `${category}:${gender}`;

const LS_PROFILE = "fitcheck.profile.v1";
const LS_GENDER = "fitcheck.gender";

/* ─────────────────────────────── store core ────────────────────────────── */

const SERVER_STATE: ProfileState = {
  ready: false,
  syncAvailable: false,
  user: null,
  profile: {},
  gender: "men",
};

let state: ProfileState = SERVER_STATE;
const listeners = new Set<() => void>();

function set(patch: Partial<ProfileState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  start();
  return () => listeners.delete(l);
}

/* ──────────────────────────── guest (localStorage) ─────────────────────── */

function readLocal(): Profile {
  try {
    const raw = localStorage.getItem(LS_PROFILE);
    const p = raw ? (JSON.parse(raw) as Profile) : {};
    return p && typeof p === "object" ? p : {};
  } catch {
    return {};
  }
}

function writeLocal(p: Profile) {
  try {
    if (Object.keys(p).length === 0) localStorage.removeItem(LS_PROFILE);
    else localStorage.setItem(LS_PROFILE, JSON.stringify(p));
  } catch {
    // storage blocked — the in-memory state still works for this visit
  }
}

function readGender(): ShopperGender {
  try {
    return localStorage.getItem(LS_GENDER) === "women" ? "women" : "men";
  } catch {
    return "men";
  }
}

/** One-time move of the old IndexedDB guest store ("sizinghub") into localStorage. */
async function migrateLegacy(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    if (localStorage.getItem(LS_PROFILE)) return;
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const req = indexedDB.open("sizinghub");
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
    const found: Profile = {};
    if (db.objectStoreNames.contains("profile")) {
      await new Promise<void>((res) => {
        const store = db.transaction("profile", "readonly").objectStore("profile");
        const cur = store.openCursor();
        cur.onsuccess = () => {
          const c = cur.result;
          if (!c) return res();
          found[String(c.key)] = c.value as ProfileEntry;
          c.continue();
        };
        cur.onerror = () => res();
      });
    }
    db.close();
    indexedDB.deleteDatabase("sizinghub");
    if (Object.keys(found).length) writeLocal(found);
  } catch {
    // nothing to migrate
  }
}

/* ─────────────────────────────── cloud sync ────────────────────────────── */

let started = false;
let stopDoc: Unsubscribe | null = null;

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  void boot();
}

async function boot() {
  await migrateLegacy();
  set({ profile: readLocal(), gender: readGender() });

  const ok = await initClientFirebase();
  if (!ok) {
    set({ ready: true, syncAvailable: false });
    return;
  }
  set({ syncAvailable: true });
  onAuthChange((u) => {
    stopDoc?.();
    stopDoc = null;
    if (!u) {
      set({ user: null, profile: readLocal(), ready: true });
      return;
    }
    set({ user: { uid: u.uid, email: u.email, name: u.displayName } });
    void attach(u.uid);
  });
}

/** Top-level fields older versions wrote that we no longer keep. */
const LEGACY_FIELDS = ["email", "displayName", "lastSeenAt", "createdAt"];

async function attach(uid: string) {
  const { deleteField, doc, onSnapshot, setDoc, updateDoc, FieldPath } = await import(
    "firebase/firestore"
  );
  const fs = clientFs();
  if (!fs) return;
  const ref = doc(fs, "users", uid);

  let merged = false;
  stopDoc = onSnapshot(
    ref,
    (snap) => {
      const data = snap.data() ?? {};
      const cloud = (data.sizeProfile ?? {}) as Profile;
      if (merged) {
        set({ profile: cloud, ready: true });
        return;
      }
      merged = true;

      // Entries to carry into the account: this device's guest profile, plus
      // entries an earlier version stranded under literal "sizeProfile.x" keys.
      const carry: Profile = {};
      const offer = (k: string, e: ProfileEntry) => {
        if (!e || typeof e.anchorValue !== "number") return;
        if (!cloud[k] || cloud[k].updatedAt < e.updatedAt) carry[k] = e;
      };
      const stale: string[] = [];
      for (const [field, value] of Object.entries(data)) {
        if (field.startsWith("sizeProfile.")) {
          offer(field.slice("sizeProfile.".length), value as ProfileEntry);
          stale.push(field);
        } else if (LEGACY_FIELDS.includes(field)) {
          stale.push(field);
        }
      }
      for (const [k, e] of Object.entries(readLocal())) offer(k, e);
      writeLocal({});

      if (Object.keys(carry).length) {
        set({ profile: { ...cloud, ...carry }, ready: true });
        void setDoc(ref, { sizeProfile: carry, updatedAt: Date.now() }, { merge: true });
      } else {
        set({ profile: cloud, ready: true });
      }
      if (stale.length) {
        const pairs = stale.flatMap((f) => [new FieldPath(f), deleteField()]);
        const [f0, v0, ...rest] = pairs;
        void updateDoc(ref, f0 as InstanceType<typeof FieldPath>, v0, ...rest).catch(() => {});
      }
    },
    () => set({ ready: true })
  );
}

/* ─────────────────────────────── public API ────────────────────────────── */

export async function saveEntry(
  category: CategoryId,
  gender: ShopperGender,
  entry: Omit<ProfileEntry, "updatedAt">
): Promise<void> {
  const key = entryKey(category, gender);
  const full: ProfileEntry = { ...entry, updatedAt: Date.now() };
  const next = { ...state.profile, [key]: full };
  set({ profile: next });
  setGender(gender);

  if (!state.user) {
    writeLocal(next);
    return;
  }
  const { doc, setDoc } = await import("firebase/firestore");
  const fs = clientFs();
  if (!fs) return;
  // A nested object + merge deep-merges the map (a dotted key would not).
  await setDoc(
    doc(fs, "users", state.user.uid),
    { sizeProfile: { [key]: full }, updatedAt: Date.now() },
    { merge: true }
  );
}

export async function removeEntry(key: string): Promise<void> {
  const next = { ...state.profile };
  delete next[key];
  set({ profile: next });

  if (!state.user) {
    writeLocal(next);
    return;
  }
  const { deleteField, doc, FieldPath, updateDoc } = await import("firebase/firestore");
  const fs = clientFs();
  if (!fs) return;
  await updateDoc(
    doc(fs, "users", state.user.uid),
    new FieldPath("sizeProfile", key),
    deleteField(),
    "updatedAt",
    Date.now()
  );
}

export function setGender(g: ShopperGender) {
  if (state.gender === g) return;
  set({ gender: g });
  try {
    localStorage.setItem(LS_GENDER, g);
  } catch {
    // ignore
  }
}

export const signIn = () => signInGoogle();
export const signOut = () => signOutUser();

/**
 * The anchor to use for a category. An entry saved for that exact category
 * wins (it captures personal preference — e.g. running shoes worn half a
 * size up). Otherwise the most recent entry from any category sharing the
 * same body measurement is used: an Air Force 1 size tells us your foot
 * length, which then reads straight into a running-shoe chart.
 * Preferred gender first, then the other one.
 */
export function entryFor(
  profile: Profile,
  category: CategoryId,
  gender: ShopperGender
): { entry: ProfileEntry; gender: ShopperGender; from: CategoryId } | null {
  const other: ShopperGender = gender === "men" ? "women" : "men";
  for (const g of [gender, other]) {
    const own = profile[entryKey(category, g)];
    if (own) return { entry: own, gender: g, from: category };
    let best: { entry: ProfileEntry; from: CategoryId } | null = null;
    for (const c of siblingsOf(category)) {
      const e = profile[entryKey(c, g)];
      if (e && (!best || e.updatedAt > best.entry.updatedAt)) best = { entry: e, from: c };
    }
    if (best) return { ...best, gender: g };
  }
  return null;
}

export function useProfile(): ProfileState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
}
