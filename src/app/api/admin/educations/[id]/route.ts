import {
  deleteEducationAdmin,
  fetchEducationAdminById,
  updateEducationAdmin,
} from "@/server/services/education.service";
import { updateEducationSchema } from "@/lib/validations/education";
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

function parseRequiredDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  return date;
}

function parseOptionalDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  return date;
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
      startDate: parsed.data.startDate ? parseRequiredDate(parsed.data.startDate) : undefined,
      endDate: parseOptionalDate(parsed.data.endDate),
      detail: parsed.data.detail,
    });

    return success(education, 200, "Education updated");
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid date") {
      return validationError({ formErrors: ["Invalid date format"], fieldErrors: {} });
    }
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Education not found");
    if (code === "P2002") return apiError("Duplicate value", 409);
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
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Education not found");
    console.error("Failed to delete education:", error);
    return internalError();
  }
}