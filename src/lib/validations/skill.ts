import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().nullable().optional(),
  level: z.number().int().min(0).max(5).nullable().optional(),
});

export const updateSkillSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().nullable().optional(),
  level: z.number().int().min(0).max(5).nullable().optional(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
