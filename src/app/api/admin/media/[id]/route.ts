import { requireAdminApi } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/db/prisma";
import { getSupabaseAdmin, getBucket, urlToStoragePath } from "@/lib/supabase/server";
import { internalError, notFound, success } from "@/lib/api/response";
export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };
export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await ctx.params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return notFound("Media not found");
    const path = urlToStoragePath(media.url);
    if (path) {
      try { await getSupabaseAdmin().storage.from(getBucket()).remove([path]); } catch (e) { console.warn("storage remove failed", e); }
    }
    await prisma.media.delete({ where: { id } });
    // also remove any projectImages referencing this url (orphan cleanup)
    await prisma.projectImage.deleteMany({ where: { url: media.url } });
    return success({ id }, 200, "Media deleted");
  } catch (e) { console.error(e); return internalError(); }
}
