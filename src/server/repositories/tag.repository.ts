import { prisma } from "@/lib/db/prisma";

export async function getTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function getTagById(id: string) {
  return prisma.tag.findUnique({ where: { id } });
}

export async function createTag(data: { name: string }) {
  return prisma.tag.create({ data: { name: data.name } });
}

export async function updateTag(id: string, data: { name?: string }) {
  return prisma.tag.update({ where: { id }, data });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}
