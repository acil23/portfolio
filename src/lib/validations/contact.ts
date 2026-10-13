import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(200).nullable().optional(),
  message: z.string().trim().min(10).max(5000),
});

export const updateContactMessageSchema = z.object({
  isRead: z.boolean(),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;
