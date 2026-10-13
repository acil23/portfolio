import { requireAdminApi } from "@/lib/auth/admin-guard";
import { createProjectSchema } from "@/lib/validations/project";
import { createProjectAdmin, fetchProjectsAdmin } from "@/server/services/project.service";
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
    const projects = await fetchProjectsAdmin();
    return success(projects);
  } catch (error) {
    console.error("Failed to fetch admin projects:", error);
    return internalError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const project = await createProjectAdmin(parsed.data);
    return success(project, 201, "Project created");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2002") return apiError("Slug already exists", 409);
    console.error("Failed to create project:", error);
    return internalError();
  }
}