import { deleteTagAdmin, fetchTagAdminById, updateTagAdmin } from "@/server/services/tag.service";
import { updateTagSchema } from "@/lib/validations/tag";
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
    const tag = await fetchTagAdminById(id);
    if (!tag) return notFound("Tag not found");
    return success(tag);
  } catch (error) {
    console.error("Failed to fetch tag:", error);
    return internalError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await context.params;
    const existing = await fetchTagAdminById(id);
    if (!existing) return notFound("Tag not found");

    const body = await request.json();
    const parsed = updateTagSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const tag = await updateTagAdmin(id, parsed.data);
    return success(tag, 200, "Tag updated");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Tag not found");
    if (code === "P2002") return apiError("Tag already exists", 409);
    console.error("Failed to update tag:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await context.params;
    const existing = await fetchTagAdminById(id);
    if (!existing) return notFound("Tag not found");

    const deleted = await deleteTagAdmin(id);
    return success(deleted, 200, "Tag deleted");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Tag not found");
    console.error("Failed to delete tag:", error);
    return internalError();
  }
}
