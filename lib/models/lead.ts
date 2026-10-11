/** What a prospect needs help with. The values are stored in the database: never rename one. */
export const LEAD_NEEDS = [
  "architecture",
  "design-system",
  "quality",
  "tech-lead",
  "other",
] as const;
export type LeadNeed = (typeof LEAD_NEEDS)[number];

/** When the work would start. Stored in the database: never rename a value. */
export const LEAD_TIMELINES = ["asap", "one-to-three-months", "later", "unsure"] as const;
export type LeadTimeline = (typeof LEAD_TIMELINES)[number];

/** Follow-up state, set from the admin. Stored in the database: never rename a value. */
export const LEAD_STATUSES = ["new", "contacted", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** What the form sends, once validated. */
export type LeadInput = {
  need: LeadNeed;
  timeline: LeadTimeline | null;
  message: string;
  name: string;
  email: string;
  company: string | null;
  /** Language of the page the form was sent from. */
  locale: string;
};

/** A lead as stored. */
export type Lead = LeadInput & {
  id: number;
  status: LeadStatus;
  /** ISO 8601 date. */
  createdAt: string;
};

export const MAX_MESSAGE_LENGTH = 3000;
export const MIN_MESSAGE_LENGTH = 10;
export const MAX_NAME_LENGTH = 80;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_COMPANY_LENGTH = 120;

/** Error codes the API answers with. Each one has a translated toast. */
export type ContactErrorCode =
  | "invalid_body"
  | "need_required"
  | "message_too_short"
  | "name_required"
  | "invalid_email"
  | "forbidden"
  | "unavailable"
  | "server_error";
