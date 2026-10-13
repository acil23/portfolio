import { prisma } from "@/lib/db/prisma";

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function getExperiencesAdmin() {
  return prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function getExperienceById(id: string) {
  return prisma.experience.findUnique({
    where: { id },
  });
}

export async function createExperience(data: {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  detail?: string | null;
}) {
  return prisma.experience.create({
    data: {
      company: data.company,
      position: data.position,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      detail: data.detail ?? null,
    },
  });
}

export async function updateExperience(
  id: string,
  data: {
    company?: string;
    position?: string;
    startDate?: Date;
    endDate?: Date | null;
    detail?: string | null;
  }
) {
  return prisma.experience.update({
    where: { id },
    data,
  });
}

export async function deleteExperience(id: string) {
  return prisma.experience.delete({
    where: { id },
  });
}