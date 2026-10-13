import {
  deleteEducationAdmin,
  fetchEducationAdminById,
  updateEducationAdmin,
} from "@/server/services/education.service";
import { updateEducationSchema } from "@/lib/validations/education";
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
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const education = await fetchEducationAdminById(id);

    if (!education) {
      return notFound("Education not found");
    }

    return success(education);
  } catch (error) {
    console.error("Failed to fetch education:", error);
    return internalError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await fetchEducationAdminById(id);

    if (!existing) {
      return notFound("Education not found");
    }

    const body = await request.json();
    const parsed = updateEducationSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const education = await updateEducationAdmin(id, {
      school: parsed.data.school,
      degree: parsed.data.degree,
      field: parsed.data.field,
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

    return success(education, 200, "Education updated");
  } catch (error) {
    console.error("Failed to update education:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await context.params;
    const existing = await fetchEducationAdminById(id);

    if (!existing) {
      return notFound("Education not found");
    }

    const deleted = await deleteEducationAdmin(id);

    return success(deleted, 200, "Education deleted");
  } catch (error) {
    console.error("Failed to delete education:", error);
    return internalError();
  }
}