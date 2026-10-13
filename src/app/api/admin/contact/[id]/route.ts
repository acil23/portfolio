import {
  deleteContactAdmin,
  fetchContactMessageAdminById,
  updateContactAdmin,
} from "@/server/services/contact.service";
import { updateContactMessageSchema } from "@/lib/validations/contact";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import {
  error as apiError,
  internalError,
  notFound,
  success,
  validationError,
} from "@/lib/api/response";

function getPrismaCode(error: unknown): string | null {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const message = await fetchContactMessageAdminById(id);
    if (!message) return notFound("Contact message not found");
    return success(message);
  } catch (error) {
    console.error("Failed to fetch contact message:", error);
    return internalError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await fetchContactMessageAdminById(id);
    if (!existing) return notFound("Contact message not found");

    const body = await request.json();
    const parsed = updateContactMessageSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const updated = await updateContactAdmin(id, parsed.data);
    return success(updated, 200, "Contact message updated");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Contact message not found");
    if (code === "P2002") return apiError("Duplicate value", 409);
    console.error("Failed to update contact message:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await fetchContactMessageAdminById(id);
    if (!existing) return notFound("Contact message not found");

    const deleted = await deleteContactAdmin(id);
    return success(deleted, 200, "Contact message deleted");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Contact message not found");
    console.error("Failed to delete contact message:", error);
    return internalError();
  }
}
