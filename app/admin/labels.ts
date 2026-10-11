import { type LeadNeed, type LeadStatus, type LeadTimeline } from "@/lib/models/lead";

// The admin area is for Valentin only, so its texts are in French and live here rather
// than in the dictionaries of the public site.

export const NEED_LABELS: Record<LeadNeed, string> = {
  architecture: "Architecture front-end",
  "design-system": "Design system",
  quality: "Qualité et audit",
  "tech-lead": "Lead technique",
  other: "Autre",
};

export const TIMELINE_LABELS: Record<LeadTimeline, string> = {
  asap: "Dès que possible",
  "one-to-three-months": "Dans 1 à 3 mois",
  later: "Plus tard",
  unsure: "Ne sait pas",
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "à traiter",
  contacted: "contacté",
  closed: "clos",
};
