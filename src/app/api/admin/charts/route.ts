import { DS } from "@/lib/datasource";
import { isAdminRequest, unauthorized } from "@/lib/adminAuth";
import type { ChartRowRec } from "@/lib/datasource/types";

export async function PUT(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();
  const body = (await req.json()) as {
    brandSlug?: string;
    category?: string;
    gender?: string;
    needsData?: boolean;
    updatedBy?: string;
    rows?: Partial<ChartRowRec>[];
  };
  if (!body.brandSlug || !body.category || !body.gender) {
    return Response.json(
      { error: "brandSlug, category, gender required" },
      { status: 400 }
    );
  }
  const rows: ChartRowRec[] = (body.rows ?? [])
    .filter((r) => Number.isFinite(Number(r.anchorValue)))
    .map((r) => ({
      anchorValue: Number(r.anchorValue),
      eu: r.eu ?? null,
      uk: r.uk ?? null,
      us: r.us ?? null,
      jpn: r.jpn ?? null,
      ind: r.ind ?? null,
      label: r.label ?? null,
    }));

  try {
    const result = await DS.upsertChart({
      brandSlug: body.brandSlug,
      category: body.category,
      gender: body.gender,
      needsData: body.needsData ?? false,
      updatedBy: body.updatedBy ?? "admin",
      rows,
    });
    return Response.json({ ok: true, ...result });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Save failed" },
      { status: 400 }
    );
  }
}
