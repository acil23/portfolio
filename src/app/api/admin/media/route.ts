import { requireAdminApi } from "@/lib/auth/admin-guard";
import { getSupabaseAdmin, getBucket, publicUrl } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { internalError, success } from "@/lib/api/response";

export const runtime = "nodejs";
const MAX = 5 * 1024 * 1024;

const ALLOWED = new Set(["image/jpeg","image/png","image/webp","image/avif","image/gif"]);
export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const folderRaw = (form.get("folder") as string) || "projects";
    const folder = ["projects","avatar","general"].includes(folderRaw) ? folderRaw : "projects";
    if (!file) return new Response(JSON.stringify({ success: false, message: "No file" }), { status: 400 });
    if (!file.type.startsWith("image/") || !ALLOWED.has(file.type)) return new Response(JSON.stringify({ success: false, message: "Allowed: jpg, png, webp, avif, gif" }), { status: 400 });
    if (file.size > MAX) return new Response(JSON.stringify({ success: false, message: "Max 5MB" }), { status: 400 });
    if (file.size < 1024) return new Response(JSON.stringify({ success: false, message: "File too small" }), { status: 400 });
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0,5).replace(/[^a-z0-9]/g,"") || "jpg";
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 40);
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${safe}.${ext}`.replace("..", ".");
    const buf = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdmin();
    const bucket = getBucket();
    const { error } = await supabase.storage.from(bucket).upload(path, buf, { contentType: file.type, upsert: false });
    if (error) return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    const url = publicUrl(path);
    const media = await prisma.media.create({ data: { name: file.name, url, type: file.type, folder } });
    return success({ ...media, storagePath: path });
  } catch (e) {
    console.error("upload failed", e);
    return internalError();
  }
}

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return success(items);
}
