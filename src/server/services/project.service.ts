import {
  getPublishedProjects,
  getProjectBySlug,
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