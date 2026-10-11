// Pure rules of the contact form: no I/O. The API contract is in docs/features/contact-form.md.
import { LOCALES } from "@/lib/i18n/config";
import {
  type ContactErrorCode,
  LEAD_NEEDS,
  LEAD_TIMELINES,
  type LeadInput,
  MAX_COMPANY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MIN_MESSAGE_LENGTH,
} from "@/lib/models/lead";

export type ParseResult = { ok: true; value: LeadInput } | { ok: false; error: ContactErrorCode };

/** A human needs at least this long to fill in three steps. */
const MIN_FILL_TIME_MS = 3000;
/** A form left open longer than this is refused: its timestamp is too easy to replay. */
const MAX_FILL_TIME_MS = 24 * 60 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const oneOf = <T extends string>(value: unknown, allowed: readonly T[]): T | null =>
  allowed.find((candidate) => candidate === value) ?? null;

export const isValidEmail = (value: string) =>
  value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);

/**
 * Honeypot and time trap. `website` is a field hidden from people: only a bot fills it.
 * `startedAt` is the time the dialog was opened, in milliseconds.
 */
export const isLikelyBot = ({
  website,
  startedAt,
  now,
}: {
  website: unknown;
  startedAt: unknown;
  now: number;
}) => {
  if (typeof website === "string" && website.trim() !== "") {
    return true;
  }

  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) {
    return true;
  }

  const elapsed = now - startedAt;

  return elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS;
};

/** Validates what the form sent. Unknown fields are ignored. */
export const parseLead = (body: Record<string, unknown>): ParseResult => {
  const need = oneOf(body.need, LEAD_NEEDS);

  if (!need) {
    return { ok: false, error: "need_required" };
  }

  const message = text(body.message, MAX_MESSAGE_LENGTH);

  if (message.length < MIN_MESSAGE_LENGTH) {
    return { ok: false, error: "message_too_short" };
  }

  const name = text(body.name, MAX_NAME_LENGTH);

  if (!name) {
    return { ok: false, error: "name_required" };
  }

  const email = text(body.email, MAX_EMAIL_LENGTH).toLowerCase();

  if (!isValidEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }

  return {
    ok: true,
    value: {
      need,
      timeline: oneOf(body.timeline, LEAD_TIMELINES),
      message,
      name,
      email,
      company: text(body.company, MAX_COMPANY_LENGTH) || null,
      locale: oneOf(body.locale, LOCALES) ?? LOCALES[0],
    },
  };
};
