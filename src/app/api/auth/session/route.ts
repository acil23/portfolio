import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { internalError, success, unauthorized } from "@/lib/api/response";

export async function GET(request: Request) {
  try {
    const session = await getAdminSessionFromRequest(request);

    if (!session) {
      return unauthorized();
    }

    return success(session.user, 200, "Session active");
  } catch (error) {
    console.error("Failed to read admin session:", error);
    return internalError();
  }
}
