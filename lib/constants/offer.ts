import { type DayRateId, type Service, type ServiceId } from "@/lib/models/offer";

/**
 * The services and their prices, in euros excluding VAT. Read by the services page, the
 * offer block of the home page and the structured data, so that a price is written once.
 * The texts of each service are in `locales/offer/`, keyed by the same ids.
 */
export const SERVICES: Service[] = [
  {
    id: "audit",
    options: [
      { id: "express", price: { type: "fixed", amount: 1900 } },
      { id: "full", price: { type: "fixed", amount: 5000 } },
    ],
  },
  { id: "lead", options: [{ id: "day", price: { type: "fixed", amount: 850, unit: "day" } }] },
  { id: "build", options: [{ id: "quote", price: { type: "quote" } }] },
  // Custom websites and apps for small businesses: closed scopes on a reusable base, so
  // fewer days than the day rate would suggest.
  {
    id: "creation",
    options: [
      { id: "landing", price: { type: "fixed", amount: 1200 } },
      { id: "site", price: { type: "fixed", amount: 2500 } },
      { id: "page", price: { type: "fixed", amount: 300 }, addOn: true },
      { id: "shop", price: { type: "from", amount: 5500 } },
      { id: "app", price: { type: "from", amount: 9000 } },
      { id: "care", price: { type: "fixed", amount: 120, unit: "month" }, addOn: true },
    ],
  },
  { id: "launch", options: [{ id: "range", price: { type: "range", min: 3500, max: 7000 } }] },
  {
    id: "retainer",
    options: [{ id: "month", price: { type: "range", min: 2500, max: 4000, unit: "month" } }],
  },
];

/** The four services of the home page, in this order. */
export const HOME_SERVICES: ServiceId[] = ["audit", "lead", "launch", "creation"];

/** Day rates of the rates table. Fixed-price services are billed by scope, not by day. */
export const DAY_RATES: Record<DayRateId, number> = { reference: 800, urgent: 950 };
