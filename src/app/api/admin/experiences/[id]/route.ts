import {
  deleteExperienceAdmin,
  fetchExperienceAdminById,
  updateExperienceAdmin,
} from "@/server/services/experience.service";
import { updateExperienceSchema } from "@/lib/validations/experience";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import {
  internalError,
  notFound,
  success,
  validationError,
} from "@/lib/api/response";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const experience = await fetchExperienceAdminById(id);

    if (!experience) {
      return notFound("Experience not found");
    }

    return success(experience);
  } catch (error) {
    console.error("Failed to fetch experience:", error);
    return internalError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await fetchExperienceAdminById(id);

    if (!existing) {
      return notFound("Experience not found");
    }

    const body = await request.json();
    const parsed = updateExperienceSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const experience = await updateExperienceAdmin(id, {
      company: parsed.data.company,
      position: parsed.data.position,
      startDate: parsed.data.startDate
        ? new Date(parsed.data.startDate)
        : undefined,
      endDate:
        parsed.data.endDate === undefined
          ? undefined
          : parsed.data.endDate === null
            ? null
            : new Date(parsed.data.endDate),
      detail: parsed.data.detail,
    });

    return success(experience, 200, "Experience updated");
  } catch (error) {
    console.error("Failed to update experience:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await fetchExperienceAdminById(id);

    if (!existing) {
      return notFound("Experience not found");
    }

    const deleted = await deleteExperienceAdmin(id);

    return success(deleted, 200, "Experience deleted");
  } catch (error) {
    console.error("Failed to delete experience:", error);
    return internalError();
  }
}