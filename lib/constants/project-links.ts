import { PERSONAL_PROJECTS } from "./personal-projects";

/** URL of each personal project that has a public address, by project id. */
export const PROJECT_LINKS: Partial<Record<string, string>> = Object.fromEntries(
  PERSONAL_PROJECTS.filter((project) => project.link).map((project) => [project.id, project.link]),
);
