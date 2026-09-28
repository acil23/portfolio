import { getEducations } from "@/server/repositories/education.repository";

export async function fetchEducations() {
  return getEducations();
}