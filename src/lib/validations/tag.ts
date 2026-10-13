import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(50),
});

export const updateTagSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
