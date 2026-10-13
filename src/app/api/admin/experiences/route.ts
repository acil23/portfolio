import {
  createExperienceAdmin,
  fetchExperiencesAdmin,
} from "@/server/services/experience.service";
import { createExperienceSchema } from "@/lib/validations/experience";
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
    const experiences = await fetchExperiencesAdmin();
    return success(experiences);
  } catch (error) {
    console.error("Failed to fetch admin experiences:", error);
    return internalError();
  }
}

export async function POST(request: Request) {
  const auth = requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const parsed = createExperienceSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const experience = await createExperienceAdmin({
      company: parsed.data.company,
      position: parsed.data.position,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      detail: parsed.data.detail,
    });

    return success(experience, 201, "Experience created");
  } catch (error) {
    console.error("Failed to create experience:", error);
    return internalError();
  }
}