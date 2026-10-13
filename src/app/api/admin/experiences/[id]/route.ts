import {
  deleteExperienceAdmin,
  fetchExperienceAdminById,
  updateExperienceAdmin,
} from "@/server/services/experience.service";
import { updateExperienceSchema } from "@/lib/validations/experience";
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
  const auth = await requireAdminApi(request);
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
      startDate: parsed.data.startDate ? parseRequiredDate(parsed.data.startDate) : undefined,
      endDate: parseOptionalDate(parsed.data.endDate),
      detail: parsed.data.detail,
    });

    return success(experience, 200, "Experience updated");
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid date") {
      return validationError({ formErrors: ["Invalid date format"], fieldErrors: {} });
    }
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Experience not found");
    if (code === "P2002") return apiError("Duplicate value", 409);
    console.error("Failed to update experience:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
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
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Experience not found");
    console.error("Failed to delete experience:", error);
    return internalError();
  }
}