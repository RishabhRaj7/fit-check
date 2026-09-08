export function isAdminRequest(req: Request): boolean {
  const key = req.headers.get("x-admin-key");
  const expected = process.env.ADMIN_KEY || "sizing-admin";
  return !!key && key === expected;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
