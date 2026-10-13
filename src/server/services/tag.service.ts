import {
  createTag,
  deleteTag,
  getTagById,
  getTags,
  updateTag,
} from "@/server/repositories/tag.repository";

export async function fetchTags() {
  return getTags();
}

export async function fetchTagAdminById(id: string) {
  return getTagById(id);
}

export async function fetchTagsAdmin() {
  return getTags();
}

export async function createTagAdmin(data: { name: string }) {
  return createTag(data);
}

export async function updateTagAdmin(id: string, data: { name?: string }) {
  return updateTag(id, data);
}

export async function deleteTagAdmin(id: string) {
  return deleteTag(id);
}
