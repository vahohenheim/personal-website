import { type LeadFilter } from "@/lib/admin/stats";
import { type LotusState } from "@/lib/lotus/config";
import { getSyncDisplay, type SyncDisplay } from "@/lib/lotus/state";
import { LOTUS_RETRY_DAYS } from "@/lib/lotus/sync";
import {
  type ContactErrorCode,
  type Lead,
  type LeadNeed,
  type LeadStatus,
  type LeadTimeline,
} from "@/lib/models/lead";

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

/** Toasts of the lead form, when the server refuses a field. */
export const LEAD_FORM_ERRORS: Record<
  "invalid_body" | "invalid_amount" | "invalid_date" | ContactErrorCode,
  string
> = {
  invalid_body: "La demande n’a pas pu être lue. Rechargez la page et réessayez.",
  invalid_amount: "Le montant doit être un nombre entier d’euros.",
  invalid_date: "La date de relance n’est pas valide.",
  need_required: "Choisissez un besoin.",
  message_too_short: "Écrivez au moins un mot dans le message.",
  name_required: "Le nom est obligatoire.",
  invalid_email: "L’adresse e-mail n’est pas valide.",
  forbidden: "Accès refusé.",
  unavailable: "La base de données n’est pas configurée.",
  server_error: "L’opération a échoué. Rechargez la page et réessayez.",
};

export const FILTER_LABELS: Record<LeadFilter, string> = {
  all: "toutes",
  new: "à traiter",
  due: "à relancer",
  ongoing: "en cours",
  closed: "closes",
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "à traiter",
  contacted: "contacté",
  quoted: "devis envoyé",
  won: "gagné",
  lost: "perdu",
  closed: "sans suite",
};

/** Forwarding of a lead to lotus, as a word. */
export const SYNC_LABELS: Record<SyncDisplay, string> = {
  synced: "transmis",
  pending: "en attente",
  rejected: "refusé",
  expired: "non transmis",
};

const shortDayFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "Europe/Paris",
});

/**
 * Forwarding of a lead to lotus, in a few words: the state, then what explains it (the
 * day lotus confirmed, the code of the last failure and the number of attempts).
 */
export const describeSync = (lead: Lead, now: Date) => {
  const display = getSyncDisplay(lead, now);
  const label = SYNC_LABELS[display];
  const attempts = `${lead.lotusAttempts} essai${lead.lotusAttempts > 1 ? "s" : ""}`;

  if (display === "synced") {
    return lead.lotusSyncedAt
      ? `${label} le ${shortDayFormat.format(new Date(lead.lotusSyncedAt))}`
      : label;
  }

  if (display === "expired") {
    return `${label} · plus de ${LOTUS_RETRY_DAYS} jours`;
  }

  if (display === "rejected") {
    return `${label} · ${lead.lotusError ?? "sans code"}`;
  }

  return lead.lotusAttempts > 0
    ? `${label} · ${lead.lotusError ?? "sans code"} · ${attempts}`
    : label;
};

/** Whether leads are being forwarded, and why not when they are not. */
export const LOTUS_STATE_LABELS: Record<LotusState["status"], string> = {
  active:
    "actif : chaque demande est envoyée à lotus, puis renvoyée chaque nuit tant que lotus n’a pas confirmé.",
  unconfigured:
    "inactif : LOTUS_WEBHOOK_URL ou LOTUS_WEBHOOK_SECRET est absent. Rien n’est envoyé.",
  invalid: "inactif : LOTUS_WEBHOOK_URL n’est pas une adresse HTTPS utilisable. Rien n’est envoyé.",
  blocked:
    "bloqué : les demandes sont en mémoire, leurs numéros repartent de 1 et se confondraient avec de vraies demandes dans lotus.",
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
