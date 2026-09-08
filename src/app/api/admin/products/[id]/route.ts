import { DS } from "@/lib/datasource";
import { isAdminRequest, unauthorized } from "@/lib/adminAuth";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, ctx: Ctx) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id } = await ctx.params;
  await DS.deleteProduct(id);
  return Response.json({ ok: true });
}
