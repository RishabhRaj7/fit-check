import { dataSourceName } from "@/lib/datasource";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (dataSourceName === "postgres") {
      const { db } = await import("@/db");
      const { sql } = await import("drizzle-orm");
      await db.execute(sql`select 1`);
    }
    return Response.json({ ok: true, dataSource: dataSourceName });
  } catch {
    return Response.json({ ok: false, dataSource: dataSourceName }, { status: 500 });
  }
}
