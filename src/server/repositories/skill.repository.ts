import { prisma } from "@/lib/db/prisma";

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export async function getSkillsAdmin() {
  return prisma.skill.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSkillById(id: string) {
  return prisma.skill.findUnique({
    where: { id },
  });
}

export async function createSkill(data: {
  name: string;
  category?: string | null;
  level?: number | null;
}) {
  return prisma.skill.create({
    data: {
      name: data.name,
      category: data.category ?? null,
      level: data.level ?? null,
    },
  });
}

export async function updateSkill(
  id: string,
  data: {
    name?: string;
    category?: string | null;
    level?: number | null;
  }
) {
  return prisma.skill.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      level: data.level,
    },
  });
}

export async function deleteSkill(id: string) {
  return prisma.skill.delete({
    where: { id },
  });
}