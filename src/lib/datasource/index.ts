import { hasFirebaseCreds } from "@/lib/firebase/admin";
import { firestoreSource } from "./firestore";
import { postgresSource } from "./postgres";
import type { DataSource } from "./types";

/**
 * Firestore is the primary datasource when the FIREBASE_* service account
 * env vars are present; the local Postgres implementation is the offline
 * fallback so development and preview keep working without credentials.
 */
export const dataSourceName: "firestore" | "postgres" = hasFirebaseCreds()
  ? "firestore"
  : "postgres";

export const DS: DataSource =
  dataSourceName === "firestore" ? firestoreSource : postgresSource;
