import { NextResponse } from "next/server";

export function requireAdminApi(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!process.env.ADMIN_API_TOKEN) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Admin API token is not configured" },
        { status: 500 }
      ),
    };
  }

  if (token !== process.env.ADMIN_API_TOKEN) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return { ok: true as const };
}