import { prisma } from "@/lib/db/prisma";

export async function getEducations() {
  return prisma.education.findMany({
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function getEducationsAdmin() {
  return prisma.education.findMany({
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function getEducationById(id: string) {
  return prisma.education.findUnique({
    where: { id },
  });
}

export async function createEducation(data: {
  school: string;
  degree?: string | null;
  field?: string | null;
  startDate: Date;
  endDate?: Date | null;
  detail?: string | null;
}) {
  return prisma.education.create({
    data: {
      school: data.school,
      degree: data.degree ?? null,
      field: data.field ?? null,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      detail: data.detail ?? null,
    },
  });
}

export async function updateEducation(
  id: string,
  data: {
    school?: string;
    degree?: string | null;
    field?: string | null;
    startDate?: Date;
    endDate?: Date | null;
    detail?: string | null;
  }
) {
  return prisma.education.update({
    where: { id },
    data,
  });
}

export async function deleteEducation(id: string) {
  return prisma.education.delete({
    where: { id },
  });
}