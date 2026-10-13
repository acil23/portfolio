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

export const createEducationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().nullable().optional(),
  field: z.string().nullable().optional(),
  startDate: dateString,
  endDate: optionalDateString,
  detail: z.string().nullable().optional(),
});

export const updateEducationSchema = z.object({
  school: z.string().min(1).optional(),
  degree: z.string().nullable().optional(),
  field: z.string().nullable().optional(),
  startDate: dateString.optional(),
  endDate: optionalDateString,
  detail: z.string().nullable().optional(),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
