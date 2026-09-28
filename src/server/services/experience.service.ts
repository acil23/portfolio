import { getExperiences } from "@/server/repositories/experience.repository";

export async function fetchExperiences() {
  return getExperiences();
}