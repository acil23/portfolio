import {
  createEducationAdmin,
  fetchEducationsAdmin,
} from "@/server/services/education.service";
import { createEducationSchema } from "@/lib/validations/education";
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

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const educations = await fetchEducationsAdmin();
    return success(educations);
  } catch (error) {
    console.error("Failed to fetch admin educations:", error);
    return internalError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const parsed = createEducationSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const education = await createEducationAdmin({
      school: parsed.data.school,
      degree: parsed.data.degree,
      field: parsed.data.field,
      startDate: parseRequiredDate(parsed.data.startDate),
      endDate: parseOptionalDate(parsed.data.endDate),
      detail: parsed.data.detail,
    });

    return success(education, 201, "Education created");
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid date") {
      return validationError({ formErrors: ["Invalid date format"], fieldErrors: {} });
    }
    const code = getPrismaCode(error);
    if (code === "P2002") return apiError("Duplicate value", 409);
    console.error("Failed to create education:", error);
    return internalError();
  }
}