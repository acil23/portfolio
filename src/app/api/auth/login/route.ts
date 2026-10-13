import { loginSchema } from "@/lib/validations/auth";
import { loginAdmin } from "@/server/services/auth.service";
import {
  internalError,
  success,
  unauthorized,
  validationError,
} from "@/lib/api/response";
import {
  createAdminSessionToken,
  setAdminSessionCookie,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const admin = await loginAdmin(parsed.data.email, parsed.data.password);

    if (!admin) {
      return unauthorized();
    }

    const token = await createAdminSessionToken(admin);
    const response = success(
      {
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      200,
      "Login successful"
    );

    setAdminSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Failed to login admin:", error);
    return internalError();
  }
}
