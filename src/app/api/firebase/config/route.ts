import { getFirebaseConfig } from "@/lib/firebase/app";

/**
 * Serves the public web-app config to the browser so /admin can bootstrap
 * Firebase Auth (Google sign-in) without NEXT_PUBLIC_* duplication.
 * The values are public identifiers by design.
 */
export async function GET() {
  const cfg = getFirebaseConfig();
  if (!cfg) return Response.json({ configured: false });
  return Response.json({ configured: true, config: cfg });
}
