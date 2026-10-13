import { forbidden, unauthorized } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth/session";

export async function requireAdminApi(request: Request) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return {
      ok: false,
      response: unauthorized(),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      ok: false,
      response: forbidden(),
    };
  }

  return { ok: true as const };
}