import {
  createSkillAdmin,
  fetchSkillsAdmin,
} from "@/server/services/skill.service";
import { createSkillSchema } from "@/lib/validations/skill";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import {
  internalError,
  success,
  validationError,
} from "@/lib/api/response";

export async function GET(request: Request) {
  const auth = requireAdminApi(request);
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
  const auth = requireAdminApi(request);
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
    console.error("Failed to create skill:", error);
    return internalError();
  }
}