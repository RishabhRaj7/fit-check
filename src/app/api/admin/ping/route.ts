import { isAdminRequest, unauthorized } from "@/lib/adminAuth";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();
  return Response.json({ ok: true });
}
