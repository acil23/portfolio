import { createTagSchema } from "@/lib/validations/tag";
import { createTagAdmin, fetchTagsAdmin } from "@/server/services/tag.service";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import {
  error as apiError,
  internalError,
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

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const tags = await fetchTagsAdmin();
    return success(tags);
  } catch (error) {
    console.error("Failed to fetch admin tags:", error);
    return internalError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const parsed = createTagSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const tag = await createTagAdmin(parsed.data);
    return success(tag, 201, "Tag created");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2002") return apiError("Tag already exists", 409);
    console.error("Failed to create tag:", error);
    return internalError();
  }
}
