import { z } from "zod";

const dateString = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid date format",
  });

const optionalDateString = z
  .string()
  .nullable()
  .optional()
  .refine(
    (value) => value == null || value === "" || !Number.isNaN(Date.parse(value)),
    { message: "Invalid date format" }
  );

export const createExperienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: dateString,
  endDate: optionalDateString,
  detail: z.string().nullable().optional(),
});

export const updateExperienceSchema = z.object({
  company: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  startDate: dateString.optional(),
  endDate: optionalDateString,
  detail: z.string().nullable().optional(),
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
