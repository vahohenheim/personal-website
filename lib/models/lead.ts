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
export const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost", "closed"] as const;
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
  /** Where the visitor came from: a referrer host or a `utm_source`. Null for a direct visit. */
  source: string | null;
};

/** What the admin records while following a lead up. */
export type LeadFollowUp = {
  status: LeadStatus;
  notes: string | null;
  /** Estimated amount of the work, in euros. */
  amount: number | null;
  /** Day to get back to the lead, as `YYYY-MM-DD`. */
  followUpOn: string | null;
};

/** A lead as stored. */
export type Lead = LeadInput &
  LeadFollowUp & {
    id: number;
    /** ISO 8601 date. */
    createdAt: string;
  };

export const MAX_MESSAGE_LENGTH = 3000;
export const MIN_MESSAGE_LENGTH = 10;
export const MAX_NAME_LENGTH = 80;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_COMPANY_LENGTH = 120;
export const MAX_SOURCE_LENGTH = 80;
export const MAX_NOTES_LENGTH = 4000;

/** Statuses of a lead that is no longer being worked on. */
export const CLOSED_STATUSES: readonly LeadStatus[] = ["won", "lost", "closed"];

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
