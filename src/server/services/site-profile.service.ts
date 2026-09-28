import { getSiteProfile } from "@/server/repositories/site-profile.repository";

export async function fetchSiteProfile() {
  const siteProfile = await getSiteProfile();

  if (!siteProfile) {
    return null;
  }

  return siteProfile;
}