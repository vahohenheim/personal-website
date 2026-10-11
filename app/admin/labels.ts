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
  quoted: "devis envoyé",
  won: "gagné",
  lost: "perdu",
  closed: "sans suite",
};

export const FUNNEL_LABELS = {
  visits: "Visites",
  contact_open: "Formulaire ouvert",
  contact_step_details: "Étape 2 : le projet",
  contact_step_identity: "Étape 3 : les coordonnées",
  contact_sent: "Message envoyé",
} as const;

export const PERIOD_LABELS = {
  "30": "30 jours",
  "90": "90 jours",
  "365": "12 mois",
  all: "tout",
} as const;

const DEVICE_LABELS: Record<string, string> = {
  desktop: "Ordinateur",
  mobile: "Mobile",
  tablet: "Tablette",
};

const regionNames = new Intl.DisplayNames("fr", { type: "region" });

const countryLabel = (code: string) => {
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
};

/** Readable name of a breakdown value. Vercel groups the tail under "Others". */
export const breakdownLabel = (dimension: string, value: string) => {
  if (value === "Others") {
    return "Autres";
  }

  if (value === "") {
    return dimension === "referrer" ? "Accès direct" : dimension === "page" ? "/" : "Inconnu";
  }

  if (dimension === "country") {
    return countryLabel(value);
  }

  if (dimension === "device") {
    return DEVICE_LABELS[value.toLowerCase()] ?? value;
  }

  return value;
};
