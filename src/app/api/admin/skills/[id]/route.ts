import {
  deleteSkillAdmin,
  fetchSkillAdminById,
  updateSkillAdmin,
} from "@/server/services/skill.service";
import { updateSkillSchema } from "@/lib/validations/skill";
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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const skill = await fetchSkillAdminById(id);

    if (!skill) {
      return notFound("Skill not found");
    }

    return success(skill);
  } catch (error) {
    console.error("Failed to fetch skill:", error);
    return internalError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await fetchSkillAdminById(id);

    if (!existing) {
      return notFound("Skill not found");
    }

    const body = await request.json();
    const parsed = updateSkillSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const skill = await updateSkillAdmin(id, parsed.data);

    return success(skill, 200, "Skill updated");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Skill not found");
    if (code === "P2002") return apiError("Skill already exists", 409);
    console.error("Failed to update skill:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await fetchSkillAdminById(id);

    if (!existing) {
      return notFound("Skill not found");
    }

    const deleted = await deleteSkillAdmin(id);

    return success(deleted, 200, "Skill deleted");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Skill not found");
    console.error("Failed to delete skill:", error);
    return internalError();
  }
}