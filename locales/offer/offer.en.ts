import { type OfferTexts } from "@/lib/models/offer";

// English mirror of offer.fr.ts, entry for entry. Prices come from lib/constants/offer.ts.

export const offer: OfferTexts = {
  title: "Services",
  breadcrumb: "services",
  lead: "Senior web engineer, specialised in headless platforms and Next.js. Audit, technical leadership, development and production launch, remote and asynchronous.",
  meta: { status: "freelance", remote: "100% remote", vat: "prices excl. VAT" },
  actions: { contact: "Get in touch", resume: "View résumé" },
  toc: {
    label: "contents",
    summary: "contents · {count} sections",
    navLabel: "Contents of the services page",
  },
  anchor: "Link to the section {title}",
  sections: {
    positioning: { label: "positioning", title: "Positioning" },
    services: { label: "services", title: "Services" },
    rates: { label: "rates", title: "Rates" },
    method: { label: "method", title: "How I work" },
    contact: { label: "contact", title: "Get in touch" },
  },
  positioning: {
    text: "I am a senior web engineer, specialised in headless platforms and Next.js. Over eight years, including a year and a half as front-end tech lead on a headless e-commerce platform, I have worked from rendering all the way to production. I also cover the back end and the infrastructure, as an extension of the web.",
    card: [
      { key: "specialty", value: "headless platforms · Next.js" },
      { key: "scope", value: "front end · back end · web infrastructure" },
      { key: "experience", value: "8 years, including 1½ years as front-end tech lead" },
      {
        key: "stack",
        value:
          "Next.js App Router · Magento · Contentful · Algolia · Vercel · Cloudflare · OpenTelemetry",
      },
      { key: "mode", value: "100% remote, asynchronous" },
    ],
  },
  services: {
    audit: {
      code: "audit",
      billing: "fixed price",
      title: "Performance & architecture audit",
      summary: "Core Web Vitals, cache and CDN, rendering, observability",
      text: "A review of your platform: Core Web Vitals, cache and CDN, rendering strategy, observability.",
      deliverables: ["Audit report", "Prioritised roadmap"],
      prices: { express: "express · 2 days", full: "full · 5 days" },
    },
    lead: {
      code: "lead",
      billing: "daily",
      title: "Part-time technical lead",
      summary: "1 to 3 days a week: scoping, code review, architecture",
      text: "A technical lead in your team, 1 to 3 days a week.",
      deliverables: [
        "Scoping of technical topics",
        "Code review",
        "Architecture decisions",
        "Link with product and design",
      ],
      detail: { label: "pace", value: "1 to 3 days a week" },
      prices: { day: "rate" },
    },
    build: {
      code: "build",
      billing: "fixed price",
      title: "Fixed-price headless development",
      summary: "Next.js front end, CMS or e-commerce, Node API and BFF",
      text: "A scope defined together, delivered at a fixed price.",
      deliverables: ["Next.js front end", "CMS or e-commerce integration", "Node API and BFF"],
      detail: { label: "duration", value: "depends on the scope" },
      prices: { quote: "price" },
    },
    launch: {
      code: "launch",
      billing: "fixed price",
      title: "Web production launch",
      summary: "CI/CD, Vercel, Cloudflare, OpenTelemetry",
      text: "The delivery pipeline and the observability of your platform, set up.",
      deliverables: ["CI/CD", "Deployment on Vercel", "Cloudflare", "OpenTelemetry observability"],
      detail: { label: "duration", value: "depends on the scope" },
      prices: { range: "price" },
    },
    retainer: {
      code: "run",
      billing: "monthly",
      title: "Monthly advice and maintenance retainer",
      summary: "Days booked every month",
      text: "Days booked every month for advice on and maintenance of your platform.",
      deliverables: ["Days booked every month", "Advice", "Maintenance"],
      detail: { label: "format", value: "days booked every month" },
      prices: { month: "price" },
    },
  },
  rates: {
    columns: { plan: "plan", rate: "rate", billing: "billing" },
    days: {
      reference: { label: "Standard", billing: "Per day" },
      urgent: { label: "Short or urgent assignment", billing: "Per day" },
    },
    packages: {
      label: "Fixed-price services",
      value: "by scope",
      billing: "By the agreed scope, not by the time spent",
    },
    vat: "All prices exclude taxes. VAT not applicable, article 293 B of the French tax code.",
  },
  method: [
    { title: "Remote.", text: "Every assignment is carried out remotely." },
    { title: "Asynchronous.", text: "Exchanges go through writing first." },
    { title: "Flexible hours.", text: "Work moves forward over the week, not in a fixed slot." },
    {
      title: "Written documentation.",
      text: "Decisions, architecture choices and deliverables are written down.",
    },
    { title: "Regular check-ins.", text: "A pace of check-ins agreed together at the start." },
  ],
  contact: {
    text: "Describe your platform and what you need: I will come back to you with a proposal.",
    cta: "Get in touch →",
  },
  price: {
    from: "from {price}",
    range: "{min} to {max}",
    day: "{price}/day",
    month: "{price}/month",
    quote: "on quote",
  },
  home: {
    title: "services",
    lead: "Senior web engineer, specialised in headless platforms and Next.js. I also cover the back end and the infrastructure, remote and asynchronous.",
    more: "See all services →",
    vat: "prices excl. VAT",
  },
  metadata: {
    title: "Services · audit, technical leadership, production launch | valentinbourreau",
    description:
      "Services of Valentin Bourreau, senior web engineer: performance audit, technical leadership, headless development and Next.js production launch.",
  },
};
