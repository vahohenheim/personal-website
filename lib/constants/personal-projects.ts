import {
  type PersonalProject,
  PersonalProjectId,
  PersonalProjectStatus,
} from "@/lib/models/personal-project";

export const PERSONAL_PROJECTS: PersonalProject[] = [
  {
    id: PersonalProjectId.BRUT,
    status: PersonalProjectStatus.ACTIVE,
    link: "https://www.mangezbrut.fr",
  },
  {
    id: PersonalProjectId.LOTUS,
    status: PersonalProjectStatus.COMING_SOON,
  },
  {
    id: PersonalProjectId.LYS,
    status: PersonalProjectStatus.COMING_SOON,
  },
  {
    id: PersonalProjectId.IRIS,
    status: PersonalProjectStatus.COMING_SOON,
  },
  {
    id: PersonalProjectId.EDITORIALS,
    status: PersonalProjectStatus.ARCHIVED,
    link: "https://github.com/vahohenheim/editorials",
  },
  {
    id: PersonalProjectId.NOTION_BLOG,
    status: PersonalProjectStatus.ARCHIVED,
    link: "https://github.com/vahohenheim/notion-blog",
  },
  {
    id: PersonalProjectId.FINANCE,
    status: PersonalProjectStatus.ARCHIVED,
    link: "https://github.com/vahohenheim/personal-finance",
  },
];
