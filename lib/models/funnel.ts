/**
 * Steps of the contact form that are counted, in order. The values are stored in the
 * database: add one, never rename one.
 */
export const FUNNEL_EVENTS = [
  "contact_open",
  "contact_step_details",
  "contact_step_identity",
  "contact_sent",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export const isFunnelEvent = (value: unknown): value is FunnelEvent =>
  FUNNEL_EVENTS.includes(value as FunnelEvent);
