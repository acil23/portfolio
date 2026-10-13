import {
  createEducationAdmin,
  fetchEducationsAdmin,
} from "@/server/services/education.service";
import { createEducationSchema } from "@/lib/validations/education";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import {
  internalError,
  success,
  validationError,
} from "@/lib/api/response";

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;

  try {
    const educations = await fetchEducationsAdmin();
    return success(educations);
  } catch (error) {
    console.error("Failed to fetch admin educations:", error);
    return internalError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const parsed = createEducationSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const education = await createEducationAdmin({
      school: parsed.data.school,
      degree: parsed.data.degree,
      field: parsed.data.field,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      detail: parsed.data.detail,
    });

    return success(education, 201, "Education created");
  } catch (error) {
    console.error("Failed to create education:", error);
    return internalError();
  }
}