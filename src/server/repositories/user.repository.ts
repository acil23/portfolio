import { prisma } from "@/lib/db/prisma";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(input: {
  name?: string | null;
  email: string;
  passwordHash: string;
  role?: "ADMIN";
}) {
  return prisma.user.create({
    data: {
      name: input.name ?? null,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? "ADMIN",
    },
  });
}