import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectBySlug,
  getProjectsAdmin,
  getPublishedProjects,
  updateProject,
} from "@/server/repositories/project.repository";

export async function fetchPublishedProjects() {
  return getPublishedProjects();
}

export async function fetchProjectBySlug(slug: string) {
  const project = await getProjectBySlug(slug);

  if (!project) {
    return null;
  }

  return project;
}

export async function fetchProjectsAdmin() {
  return getProjectsAdmin();
}

export async function fetchProjectAdminById(id: string) {
  return getProjectById(id);
}

export async function createProjectAdmin(data: {
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  isPublished?: boolean;
  tagIds?: string[];
  images?: { url: string; alt?: string | null; order?: number }[];
}) {
  return createProject(data);
}

export async function updateProjectAdmin(
  id: string,
  data: {
    title?: string;
    slug?: string;
    summary?: string;
    description?: string | null;
    isPublished?: boolean;
    tagIds?: string[];
    images?: { url: string; alt?: string | null; order?: number }[];
  }
) {
  return updateProject(id, data);
}

export async function deleteProjectAdmin(id: string) {
  return deleteProject(id);
}