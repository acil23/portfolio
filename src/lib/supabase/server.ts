import { createClient } from "@supabase/supabase-js";
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key);
}
export function getBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "portfolio";
}
export function publicUrl(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const bucket = getBucket();
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}
export function urlToStoragePath(url: string): string | null {
  try {
    const bucket = getBucket();
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.slice(idx + marker.length).split("?")[0];
  } catch { return null; }
}
