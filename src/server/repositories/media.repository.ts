import { prisma } from "@/lib/db/prisma";
export async function listMedia(limit = 100) {
  return prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}
export async function getMediaById(id: string) {
  return prisma.media.findUnique({ where: { id } });
}
export async function getMediaByUrl(url: string) {
  return prisma.media.findFirst({ where: { url } });
}
export async function deleteMediaById(id: string) {
  return prisma.media.delete({ where: { id } });
}
export async function deleteMediaByUrls(urls: string[]) {
  if (!urls.length) return { count: 0 };
  return prisma.media.deleteMany({ where: { url: { in: urls } } });
}
