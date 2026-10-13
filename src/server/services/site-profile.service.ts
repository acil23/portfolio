import {
  getSiteProfile,
  updateSiteProfile,
} from "@/server/repositories/site-profile.repository";

export async function fetchSiteProfile() {
  const siteProfile = await getSiteProfile();

  if (!siteProfile) {
    return null;
  }

  return siteProfile;
}

export async function updateSiteProfileById(
  id: string,
  data: Parameters<typeof updateSiteProfile>[1]
) {
  return updateSiteProfile(id, data);
}