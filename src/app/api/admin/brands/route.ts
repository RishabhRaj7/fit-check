import { DS } from "@/lib/datasource";
import { isAdminRequest, unauthorized } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();
  const body = (await req.json()) as {
    name?: string;
    categories?: string[];
    priority?: number;
    logoUrl?: string;
  };
  const name = (body.name ?? "").trim();
  if (!name) return Response.json({ error: "name required" }, { status: 400 });
  const result = await DS.createBrand({
    name,
    categories: body.categories ?? [],
    priority: body.priority ?? 0,
    logoUrl: body.logoUrl,
  });
  if (result.error) {
    return Response.json({ error: result.error }, { status: 409 });
  }
  return Response.json({ brand: result.brand });
}
