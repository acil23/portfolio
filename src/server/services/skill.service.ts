import {
  createSkill,
  deleteSkill,
  getSkillById,
  getSkills,
  getSkillsAdmin,
  updateSkill,
} from "@/server/repositories/skill.repository";

export async function fetchSkills() {
  return getSkills();
}

export async function fetchSkillsAdmin() {
  return getSkillsAdmin();
}

export async function fetchSkillAdminById(id: string) {
  return getSkillById(id);
}

export async function createSkillAdmin(data: {
  name: string;
  category?: string | null;
  level?: number | null;
}) {
  return createSkill(data);
}

export async function updateSkillAdmin(
  id: string,
  data: {
    name?: string;
    category?: string | null;
    level?: number | null;
  }
) {
  return updateSkill(id, data);
}

export async function deleteSkillAdmin(id: string) {
  return deleteSkill(id);
}