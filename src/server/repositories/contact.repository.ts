import { prisma } from "@/lib/db/prisma";

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}) {
  return prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message,
    },
  });
}

export async function getContactMessagesAdmin() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getContactMessageById(id: string) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

export async function updateContactMessage(id: string, data: { isRead: boolean }) {
  return prisma.contactMessage.update({
    where: { id },
    data,
  });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}
