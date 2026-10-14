// prisma/clean.ts — kosongkan semua data (tidak hapus migration)
// Dipakai via: npm run db:clean
import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";
import { getSupabaseAdmin, getBucket } from "../src/lib/supabase/server";

async function main() {
  console.log("🧹 Cleaning database — deleting in FK-safe order...");

  // Urutan penting karena FK
  const countsBefore = {
    projectImage: await prisma.projectImage.count(),
    project: await prisma.project.count(),
    tag: await prisma.tag.count(),
    post: await prisma.post.count(),
    skill: await prisma.skill.count(),
    experience: await prisma.experience.count(),
    education: await prisma.education.count(),
    contactMessage: await prisma.contactMessage.count(),
    siteProfile: await prisma.siteProfile.count(),
    media: await prisma.media.count(),
    user: await prisma.user.count(),
  };
  console.log("Before:", countsBefore);

  // FK-safe delete order (mirip seed.ts tapi lengkap)
  await prisma.projectImage.deleteMany();
  // join table Project<->Tag dibersihkan via disconnect di deleteMany project, tapi explicit:
  // Prisma hapus relation saat project/tag dihapus, jadi cukup:
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.siteProfile.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  const countsAfter = {
    projectImage: await prisma.projectImage.count(),
    project: await prisma.project.count(),
    tag: await prisma.tag.count(),
    post: await prisma.post.count(),
    skill: await prisma.skill.count(),
    experience: await prisma.experience.count(),
    education: await prisma.education.count(),
    contactMessage: await prisma.contactMessage.count(),
    siteProfile: await prisma.siteProfile.count(),
    media: await prisma.media.count(),
    user: await prisma.user.count(),
  };
  console.log("After:", countsAfter);

  const allZero = Object.values(countsAfter).every((v) => v === 0);
  if (allZero) console.log("✅ Database kosong total (0 rows semua tabel).");
  else console.warn("⚠️ Masih ada sisa data:", countsAfter);

  // Opsional: bersihkan Supabase Storage (portfolio/*)
  try {
    const supabase = getSupabaseAdmin();
    const bucket = getBucket();
    console.log(`\n🗑️ Cleaning Supabase Storage bucket: ${bucket} ...`);
    const folders = ["projects", "avatar", "general", "branding"];
    for (const folder of folders) {
      const { data, error } = await supabase.storage.from(bucket).list(folder, { limit: 1000 });
      if (error) {
        console.log(`  ${folder}: skip (${error.message})`);
        continue;
      }
      if (!data || data.length === 0) {
        console.log(`  ${folder}: kosong`);
        continue;
      }
      const paths = data.map((f) => `${folder}/${f.name}`);
      console.log(`  ${folder}: hapus ${paths.length} file(s) ->`, paths.slice(0, 3));
      const { error: delErr } = await supabase.storage.from(bucket).remove(paths);
      if (delErr) console.warn(`  ${folder} delete error:`, delErr.message);
      else console.log(`  ${folder}: ✅ terhapus`);
      // handle subfolders recursively (list tidak recursive, jadi cek 1 level lagi)
      for (const item of data) {
        // jika item bukan file tapi folder (supabase list tidak bedakan jelas), coba list subfolder
        if (!item.name.includes(".")) {
          const sub = await supabase.storage.from(bucket).list(`${folder}/${item.name}`, { limit: 1000 });
          if (sub.data && sub.data.length > 0) {
            const subPaths = sub.data.map((f) => `${folder}/${item.name}/${f.name}`);
            console.log(`    sub ${folder}/${item.name}: hapus ${subPaths.length}`);
            await supabase.storage.from(bucket).remove(subPaths);
          }
        }
      }
    }
    console.log("✅ Storage clean selesai (cek Dashboard Supabase > Storage jika masih ada subfolder nested).");
  } catch (e: any) {
    console.warn("Storage clean skip:", e?.message ?? e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
