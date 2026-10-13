import {
  createSkillAdmin,
  fetchSkillsAdmin,
} from "@/server/services/skill.service";
import { createSkillSchema } from "@/lib/validations/skill";
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
    const skills = await fetchSkillsAdmin();
    return success(skills);
  } catch (error) {
    console.error("Failed to fetch admin skills:", error);
    return internalError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const parsed = createSkillSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const skill = await createSkillAdmin(parsed.data);
    return success(skill, 201, "Skill created");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2002") return apiError("Skill already exists", 409);
    console.error("Failed to create skill:", error);
    return internalError();
  }
}