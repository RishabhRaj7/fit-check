import { getCatalog, stats } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cat = await getCatalog();
    return Response.json({ ok: true, dataSource: "firestore", ...stats(cat) });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "unavailable" },
      { status: 503 }
    );
  }
}
