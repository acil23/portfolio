import {
  fetchSiteProfile,
  updateSiteProfileById,
} from "@/server/services/site-profile.service";
import {
  updateSiteProfileSchema,
} from "@/lib/validations/site-profile";
import { requireAdminApi } from "@/lib/auth/admin-guard";
import {
  internalError,
  notFound,
  success,
  validationError,
} from "@/lib/api/response";

export async function GET() {
  try {
    const siteProfile = await fetchSiteProfile();

    if (!siteProfile) {
      return notFound("Site profile not found");
    }

    return success(siteProfile);
  } catch (error) {
    console.error("Failed to fetch site profile:", error);
    return internalError();
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi(request);
  if (!auth.ok) return auth.response;
  try {
    const existing = await fetchSiteProfile();

    if (!existing) {
      return notFound("Site profile not found");
    }

    const body = await request.json();
    const parsed = updateSiteProfileSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const updated = await updateSiteProfileById(existing.id, parsed.data);

    return success(updated, 200, "Site profile updated");
  } catch (error) {
    console.error("Failed to update site profile:", error);
    return internalError();
  }
}