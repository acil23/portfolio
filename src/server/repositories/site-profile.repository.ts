import { prisma } from "@/lib/db/prisma";

export async function getSiteProfile() {
  return prisma.siteProfile.findFirst({
    include: {
      avatarMedia: true,
    },
  });
}