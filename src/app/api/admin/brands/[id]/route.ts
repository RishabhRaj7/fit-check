import { DS } from "@/lib/datasource";
import { isAdminRequest, unauthorized } from "@/lib/adminAuth";
import type { BrandPatch } from "@/lib/datasource/types";

type Ctx = { params: Promise<{ id: string }> };

/** [id] carries the brand slug. */
export async function PATCH(req: Request, ctx: Ctx) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id } = await ctx.params;
  const body = (await req.json()) as BrandPatch;
  const updated = await DS.updateBrand(id, body);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ brand: updated });
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id } = await ctx.params;
  await DS.deleteBrand(id);
  return Response.json({ ok: true });
}
