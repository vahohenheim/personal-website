import { type Lead, type LeadInput } from "@/lib/models/lead";

/** What a visitor sends through the contact dialog, valid by default. */
export const formBody = (overrides: Record<string, unknown> = {}) => ({
  need: "design-system",
  timeline: "asap",
  message: "We need help with our design system.",
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  locale: "fr",
  source: "linkedin.com",
  website: "",
  // Opened ten seconds ago: past the time trap.
  startedAt: Date.now() - 10_000,
  ...overrides,
});

export const leadInput = (overrides: Partial<LeadInput> = {}): LeadInput => ({
  need: "design-system",
  timeline: "asap",
  message: "We need help with our design system.",
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  locale: "fr",
  source: "linkedin.com",
  ...overrides,
});

/** A stored lead, new and untouched by default. */
export const makeLead = (overrides: Partial<Lead> = {}): Lead => ({
  ...leadInput(),
  id: 1,
  status: "new",
  notes: null,
  amount: null,
  followUpOn: null,
  createdAt: "2026-10-01T10:00:00.000Z",
  ...overrides,
});

export const jsonRequest = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
