import { DS } from "@/lib/datasource";
import { isAdminRequest, unauthorized } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();
  const body = (await req.json()) as {
    brandSlug?: string;
    category?: string;
    name?: string;
    priceInr?: number;
    imageUrl?: string;
  };
  if (!body.brandSlug || !body.category || !body.name) {
    return Response.json(
      { error: "brandSlug, category, name required" },
      { status: 400 }
    );
  }
  try {
    const product = await DS.createProduct({
      brandSlug: body.brandSlug,
      category: body.category,
      name: body.name,
      priceInr: body.priceInr ?? null,
      imageUrl: body.imageUrl ?? null,
    });
    return Response.json({ product });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Create failed" },
      { status: 400 }
    );
  }
}
