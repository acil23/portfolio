import { fetchContactMessagesAdmin } from "@/server/services/contact.service";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import { internalError, success } from "@/lib/api/response";

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const messages = await fetchContactMessagesAdmin();
    return success(messages);
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return internalError();
  }
}
