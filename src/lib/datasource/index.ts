import { hasFirebaseConfig } from "@/lib/firebase/app";
import { firestoreSource } from "./firestore";
import { postgresSource } from "./postgres";
import type { DataSource } from "./types";

/**
 * Firestore is the primary datasource when the FIREBASE_* web-app env vars
 * are present; the local Postgres implementation is the offline fallback so
 * development and preview keep working without credentials.
 */
export const dataSourceName: "firestore" | "postgres" = hasFirebaseConfig()
  ? "firestore"
  : "postgres";

export const DS: DataSource =
  dataSourceName === "firestore" ? firestoreSource : postgresSource;
