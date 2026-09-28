import { getSkills } from "@/server/repositories/skill.repository";

export async function fetchSkills() {
  return getSkills();
}