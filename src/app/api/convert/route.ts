import { convertSize } from "@/lib/convert";
import { isCategory } from "@/lib/categories";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const category = String(body.category ?? "");
  const gender = String(body.gender ?? "men");
  const brandSlug = String(body.brandSlug ?? "");
  const anchorValue = Number(body.anchorValue);

  if (!isCategory(category)) {
    return Response.json({ error: "Unknown category" }, { status: 400 });
  }
  if (!brandSlug) {
    return Response.json({ error: "brandSlug required" }, { status: 400 });
  }
  if (!Number.isFinite(anchorValue) || anchorValue < 10 || anchorValue > 250) {
    return Response.json({ error: "anchorValue out of range" }, { status: 400 });
  }

  const result = await convertSize({ category, gender, anchorValue, brandSlug });
  return Response.json(result);
}
