export type PersonalProject = {
  id: PersonalProjectId;
  status: PersonalProjectStatus;
  link?: string;
};

export enum PersonalProjectStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  COMPLETED = "completed",
}

export enum PersonalProjectId {
  BRUT = "brut",
  LOTUS = "lotus",
  PENSEE = "pensee",
  EDITORIALS = "editorials",
  NOTION_BLOG = "notion-blog",
  FINANCE = "finance",
}
