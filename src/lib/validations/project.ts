import { z } from "zod";

const imageInput = z.object({
  url: z.string().trim().min(1).max(2048),
  alt: z.string().trim().max(200).nullable().optional(),
  order: z.number().int().min(0).max(1000).optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  tagIds: z.array(z.string().min(1)).optional(),
  images: z.array(imageInput).max(20).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  tagIds: z.array(z.string().min(1)).optional(),
  images: z.array(imageInput).max(20).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;