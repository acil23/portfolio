import {
  createExperienceAdmin,
  fetchExperiencesAdmin,
} from "@/server/services/experience.service";
import { createExperienceSchema } from "@/lib/validations/experience";
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
    const experiences = await fetchExperiencesAdmin();
    return success(experiences);
  } catch (error) {
    console.error("Failed to fetch admin experiences:", error);
    return internalError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
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
      startDate: parseRequiredDate(parsed.data.startDate),
      endDate: parseOptionalDate(parsed.data.endDate),
      detail: parsed.data.detail,
    });

    return success(experience, 201, "Experience created");
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid date") {
      return validationError({ formErrors: ["Invalid date format"], fieldErrors: {} });
    }
    const code = getPrismaCode(error);
    if (code === "P2002") return apiError("Duplicate value", 409);
    console.error("Failed to create experience:", error);
    return internalError();
  }
}