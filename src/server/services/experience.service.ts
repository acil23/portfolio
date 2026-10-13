import {
  createExperience,
  deleteExperience,
  getExperienceById,
  getExperiences,
  getExperiencesAdmin,
  updateExperience,
} from "@/server/repositories/experience.repository";

export async function fetchExperiences() {
  return getExperiences();
}

export async function fetchExperiencesAdmin() {
  return getExperiencesAdmin();
}

export async function fetchExperienceAdminById(id: string) {
  return getExperienceById(id);
}

export async function createExperienceAdmin(data: {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  detail?: string | null;
}) {
  return createExperience(data);
}

export async function updateExperienceAdmin(
  id: string,
  data: {
    company?: string;
    position?: string;
    startDate?: Date;
    endDate?: Date | null;
    detail?: string | null;
  }
) {
  return updateExperience(id, data);
}

export async function deleteExperienceAdmin(id: string) {
  return deleteExperience(id);
}