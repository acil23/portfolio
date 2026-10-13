import { z } from "zod";

export const updateSiteProfileSchema = z.object({
  displayName: z.string().min(1).optional(),
  headline: z.string().min(1).optional(),
  shortBio: z.string().min(1).optional(),
  longBio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  avatarMediaId: z.string().nullable().optional(),
  emailPublic: z.string().email().nullable().optional(),
  whatsappNumber: z.string().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  cvUrl: z.string().url().nullable().optional(),
  heroCtaPrimaryLabel: z.string().nullable().optional(),
  heroCtaPrimaryHref: z.string().nullable().optional(),
  heroCtaSecondaryLabel: z.string().nullable().optional(),
  heroCtaSecondaryHref: z.string().nullable().optional(),
});

export type UpdateSiteProfileInput = z.infer<typeof updateSiteProfileSchema>;