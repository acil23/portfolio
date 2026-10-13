import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import { createProjectSchema } from "@/lib/validations/project";
import { createProjectAdmin, fetchProjectsAdmin } from "@/server/services/project.service";
import {
  internalError,
  success,
  validationError,
} from "@/lib/api/response";

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
    console.error("Failed to create project:", error);
    return internalError();
  }
}