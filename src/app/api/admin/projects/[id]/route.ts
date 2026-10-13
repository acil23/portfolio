import { NextResponse } from "next/server";
import {
  deleteProjectAdmin,
  fetchProjectAdminById,
  updateProjectAdmin,
} from "@/server/services/project.service";
import { updateProjectSchema } from "@/lib/validations/project";
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
    const project = await fetchProjectAdminById(id);

    if (!project) {
      return notFound("Project not found");
    }

    return success(project);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return internalError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const project = await updateProjectAdmin(id, parsed.data);
    return success(project, 200, "Project updated");
  } catch (error) {
    console.error("Failed to update project:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const deleted = await deleteProjectAdmin(id);
    return success(deleted, 200, "Project deleted");
  } catch (error) {
    console.error("Failed to delete project:", error);
    return internalError();
  }
}