import { clearAdminSessionCookie } from "@/lib/auth/session";
import { internalError, success } from "@/lib/api/response";

export async function POST() {
  try {
    const response = success({ loggedOut: true }, 200, "Logged out");
    clearAdminSessionCookie(response);
    return response;
  } catch (error) {
    console.error("Failed to logout admin:", error);
    return internalError();
  }
}
