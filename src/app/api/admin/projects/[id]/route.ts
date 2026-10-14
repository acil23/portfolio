import {
  deleteProjectAdmin,
  fetchProjectAdminById,
  updateProjectAdmin,
} from "@/server/services/project.service";
import { updateProjectSchema } from "@/lib/validations/project";
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
  const auth = await requireAdminApi(request);
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
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Project not found");
    if (code === "P2002") return apiError("Slug already exists", 409);
    console.error("Failed to update project:", error);
    return internalError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await context.params;
    const existing = await fetchProjectAdminById(id);
    if (!existing) return notFound("Project not found");
    const supaUrls = (existing.projectImages ?? []).map((im) => im.url).filter(Boolean);
    const deleted = await deleteProjectAdmin(id);
    // best-effort: remove associated Media + storage objects (only our Supabase bucket)
    try {
      const { getSupabaseAdmin, getBucket, urlToStoragePath } = await import("@/lib/supabase/server");
      const { prisma } = await import("@/lib/db/prisma");
      const paths = supaUrls.map((u) => urlToStoragePath(u)).filter(Boolean) as string[];
      if (paths.length) {
        const supabase = getSupabaseAdmin();
        await supabase.storage.from(getBucket()).remove(paths);
      }
      if (supaUrls.length) {
        await prisma.media.deleteMany({ where: { url: { in: supaUrls } } });
      }
    } catch (e) { console.warn("cleanup storage/media after delete failed", e); }
    return success(deleted, 200, "Project deleted");
  } catch (error) {
    const code = getPrismaCode(error);
    if (code === "P2025") return notFound("Project not found");
    console.error("Failed to delete project:", error);
    return internalError();
  }
}