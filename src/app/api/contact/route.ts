import { createContactMessageSchema } from "@/lib/validations/contact";
import { createContact } from "@/server/services/contact.service";
import { internalError, success, validationError } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createContactMessageSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const contact = await createContact({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });

    return success({ id: contact.id }, 201, "Message sent successfully");
  } catch (error) {
    console.error("Failed to create contact message:", error);
    return internalError();
  }
}
