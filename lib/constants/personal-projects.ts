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
    id: PersonalProjectId.BLOOM,
    status: PersonalProjectStatus.ACTIVE,
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
