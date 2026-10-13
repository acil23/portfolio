import {
  createEducation,
  deleteEducation,
  getEducationById,
  getEducations,
  getEducationsAdmin,
  updateEducation,
} from "@/server/repositories/education.repository";

export async function fetchEducations() {
  return getEducations();
}

export async function fetchEducationsAdmin() {
  return getEducationsAdmin();
}

export async function fetchEducationAdminById(id: string) {
  return getEducationById(id);
}

export async function createEducationAdmin(data: {
  school: string;
  degree?: string | null;
  field?: string | null;
  startDate: Date;
  endDate?: Date | null;
  detail?: string | null;
}) {
  return createEducation(data);
}

export async function updateEducationAdmin(
  id: string,
  data: {
    school?: string;
    degree?: string | null;
    field?: string | null;
    startDate?: Date;
    endDate?: Date | null;
    detail?: string | null;
  }
) {
  return updateEducation(id, data);
}

export async function deleteEducationAdmin(id: string) {
  return deleteEducation(id);
}