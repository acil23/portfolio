import { z } from "zod";

export const createExperienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
});

export const updateExperienceSchema = z.object({
  company: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  startDate: z.string().min(1).optional(),
  endDate: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
