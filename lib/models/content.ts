/** Shapes of the page contents written in `locales/`. */

export type ProfileRow = {
  key: string;
  value: string;
  /** Shows the accent dot before the value. */
  live?: boolean;
};

export type ChangelogEntry = {
  /** Written `YYYY.MM → YYYY.MM`. */
  date: string;
  /** The ongoing entry: its date takes the accent colour. */
  current?: boolean;
  duration?: string;
  title: string;
  company?: string;
  /** Successive roles in the same company, with their duration. */
  roles?: string[];
  text?: string;
  achievements?: string[];
  /** Older positions, one per line. */
  earlier?: { label: string; years: string }[];
};

export type ProjectStatus = "online" | "ongoing" | "archived";

export type ProjectContent = {
  /** Identifier used to find the project URL. */
  id: string;
  name: string;
  status: ProjectStatus;
  text: string;
  stack: string;
};

export type HomeContent = {
  title: string;
  lead: string;
  card: ProfileRow[];
  actions: { contact: string; resume: string };
  brings: {
    title: string;
    quote: string;
    items: { meta: string; title: string; text: string }[];
  };
  changelog: { title: string; more: string; entries: ChangelogEntry[] };
  projects: {
    title: string;
    status: Record<ProjectStatus, string>;
    items: ProjectContent[];
    /** Text before the list of projects not shown as cards. */
    more: string;
    moreItems: { id: string; name: string }[];
  };
  contact: { title: string; cta: string };
};

export type ResumeContent = {
  title: string;
  /** Last segment of the breadcrumb. */
  breadcrumb: string;
  meta: { status: string; since: string; location: string };
  summary: string;
  actions: { download: string; contact: string };
  stack: { title: string; rows: ProfileRow[] };
  changelog: { title: string; entries: ChangelogEntry[] };
  education: { title: string; rows: ProfileRow[] };
  languages: { title: string; rows: ProfileRow[] };
  /** Link back to the home page, written as a shell command. */
  home: string;
};
