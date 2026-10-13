import { prisma } from "@/lib/db/prisma";

export async function getSiteProfile() {
  return prisma.siteProfile.findFirst({
    include: {
      avatarMedia: true,
    },
  });
}

export async function updateSiteProfile(
  id: string,
  data: {
    displayName?: string;
    headline?: string;
    shortBio?: string;
    longBio?: string | null;
    location?: string | null;
    avatarMediaId?: string | null;
    emailPublic?: string | null;
    whatsappNumber?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    instagramUrl?: string | null;
    cvUrl?: string | null;
    heroCtaPrimaryLabel?: string | null;
    heroCtaPrimaryHref?: string | null;
    heroCtaSecondaryLabel?: string | null;
    heroCtaSecondaryHref?: string | null;
  }
) {
  return prisma.siteProfile.update({
    where: { id },
    data,
    include: {
      avatarMedia: true,
    },
  });
}