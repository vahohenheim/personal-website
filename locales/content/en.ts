import { type HomeContent, type ResumeContent } from "@/lib/models/content";

// English mirror of locales/content/fr.ts: same structure, same order.

export const home: HomeContent = {
  title: "Senior front-end engineer",
  lead: "Freelance. I help product teams with their web interfaces: front-end architecture, design systems, quality.",
  card: [
    {
      key: "name",
      value: "Valentin Bourreau",
    },
    {
      key: "role",
      value: "Senior front-end engineer",
    },
    {
      key: "status",
      value: "Freelance",
      live: true,
    },
    {
      key: "experience",
      value: "developer since 2013",
    },
    {
      key: "stack",
      value: "React · Next.js · Angular · GraphQL",
    },
    {
      key: "scope",
      value: "architecture · design system · technical lead",
    },
    {
      key: "based in",
      value: "Paris, France",
    },
    {
      key: "languages",
      value: "fr native · en · es",
    },
  ],
  actions: {
    contact: "Get in touch",
    resume: "View résumé",
  },
  brings: {
    title: "what i bring",
    quote:
      "Front-end comes last in the decision chain. That is where I connect product, design, marketing and engineering.",
    items: [
      {
        meta: "since 2013",
        title: "Engineering",
        text: "Research, architecture, development, documentation, testing. Front-end first, with a back-end background to cover the full stack.",
      },
      {
        meta: "ep · solo paris",
        title: "Technical lead",
        text: "A team of five at EP, then a year and a half as front-end tech lead at SOLO. Shared practices, hiring, onboarding, documentation.",
      },
      {
        meta: "product · design · marketing · tech",
        title: "Bridge between teams",
        text: "Getting everyone’s needs across so that design decisions move forward.",
      },
    ],
  },
  changelog: {
    title: "changelog",
    more: "full changelog →",
    entries: [
      {
        date: "2026.10 → today",
        current: true,
        title: "Senior front-end engineer",
        company: "Freelance",
        text: "Current status. Front-end assignments: architecture, design system, quality, technical lead.",
      },
      {
        date: "2024.10 → 2026.10",
        title: "Front-end tech lead",
        company: "SOLO Paris",
        text: "Engineer, then front-end tech lead for a year and a half on the headless e-commerce rebuild: monolithic Magento → Next.js + Magento 2 through GraphQL. Algolia, Contentful, Cloudflare.",
      },
      {
        date: "2021.06 → 2024.09",
        title: "Front-end tech lead",
        company: "EP, Nantes",
        text: "Start-up studio in real estate: regtech apps and a data visualisation site. Team of five, design system in Web Components, migration to Next.js 14 and continuous deployment.",
      },
      {
        date: "2020.02 → 2021.06",
        title: "Front-end engineer",
        company: "Conserto",
        text: "Assignment at EP Tribe: Angular, Meteor, static generation with Node.js.",
      },
      {
        date: "2013 → 2020",
        title: "Front-end, full-stack, UI/UX, teaching",
        text: "Troopers, Nantes Métropole, Connexing, Maine-et-Loire Department, Drouault.",
      },
    ],
  },
  projects: {
    title: "projects",
    status: {
      online: "online",
      starting: "starting",
      archived: "archived",
    },
    items: [
      {
        id: "brut",
        name: "brut",
        status: "online",
        text: "BRUT food truck in Tours: editable content, newsletter, customer reviews.",
        stack: "next.js",
      },
      {
        id: "lotus",
        name: "lotus",
        status: "starting",
        text: "My freelance status, automated: invoices and quotes, social contributions, deadlines, leads and client follow-ups.",
        stack: "next.js · drizzle · neon",
      },
      {
        id: "pensee",
        name: "pensee",
        status: "starting",
        text: "Mobile app for daily notes, built for writing offline: rich editor, sync, search. A nightly AI review.",
        stack: "expo · next.js · claude api",
      },
    ],
    more: "+ 3 archived:",
    moreItems: [
      {
        id: "editorials",
        name: "editorials",
      },
      {
        id: "notion-blog",
        name: "notion-blog",
      },
      {
        id: "finance",
        name: "finance",
      },
    ],
  },
  contact: {
    title: "contact",
    cta: "Get in touch →",
  },
};

export const resume: ResumeContent = {
  title: "Senior front-end engineer",
  breadcrumb: "cv",
  meta: {
    status: "freelance",
    since: "developer since 2013",
    location: "Paris, France",
  },
  summary:
    "More than ten years of web development, including two roles as front-end tech lead, at EP then at SOLO. Now freelance, I work on front-end architecture, design systems and quality, bridging product, design and engineering.",
  actions: {
    download: "Download cv.pdf",
    contact: "Get in touch",
  },
  stack: {
    title: "stack",
    rows: [
      {
        key: "front",
        value:
          "react · next.js · angular · redux · rxjs · graphql · web components · d3.js · mapbox",
      },
      {
        key: "platform",
        value: "magento 2 · contentful · algolia · cloudflare · knock · nx · node.js · laravel",
      },
      {
        key: "quality",
        value: "jest · cypress · playwright · documentation · guidelines",
      },
      {
        key: "team",
        value: "lead · hiring · onboarding · product / design / tech liaison",
      },
      {
        key: "design",
        value: "ui/ux · design systems · sketch · adobe suite",
      },
    ],
  },
  changelog: {
    title: "changelog",
    entries: [
      {
        date: "2026.10 → today",
        current: true,
        duration: "current status",
        title: "Senior front-end engineer",
        company: "Freelance",
        text: "Front-end assignments: architecture, design system, quality, technical lead.",
      },
      {
        date: "2024.10 → 2026.10",
        duration: "2 years",
        title: "Front-end tech lead",
        company: "SOLO Paris",
        roles: ["front-end tech lead · 1½ years", "front-end engineer · 6 months"],
        text: "E-commerce rebuild in a team of ten: monolithic Magento → headless Next.js + Magento 2, with GraphQL as the interface layer.",
        achievements: [
          "Custom Algolia integration: search performance and relevance",
          "Contentful architecture for editorial content, with Marketing",
          "Security: Cloudflare WAF",
          "Quality processes and technical guidelines",
          "Knock notifications, PDFs with PDFKit, Gravitee API",
        ],
      },
      {
        date: "2021.06 → 2024.09",
        duration: "3 years 3 months",
        title: "Front-end tech lead",
        company: "EP, Nantes",
        roles: ["front-end tech lead · 1 year", "front-end engineer · 2 years 2 months"],
        text: "Start-up studio in real estate: building regtech apps and a data visualisation site.",
        achievements: [
          "Managing five developers: hiring, onboarding, skills development",
          "Owner of the design system in Web Components, d3.js and Mapbox facades",
          "Migration from JAMStack to Next.js 14, continuous deployment, new Next.js + Redux Toolkit app",
          "Angular 5, 12 and 17 projects; NX monorepo; editorial SEO (JSON-LD, sitemaps)",
          "Bridge between multidisciplinary teams on product and quality goals",
        ],
      },
      {
        date: "2020.02 → 2021.06",
        title: "Front-end engineer",
        company: "Conserto, Nantes",
        text: "Assignment at EP Tribe: Angular, full-stack Meteor, static generation with Node.js, Adobe Campaign emails.",
      },
      {
        date: "2018.06 → 2020.01",
        title: "Front-end developer",
        company: "Troopers, Nantes",
        text: "React, Redux, RxJS; Expo and React Native; JSX and Twig style guides with Tailwind and Ant Design.",
      },
      {
        date: "2013.09 → 2018.09",
        title: "Earlier versions",
        earlier: [
          {
            label: "Teacher · Nantes Métropole",
            years: "2018",
          },
          {
            label: "Full-stack & UI/UX designer · Connexing",
            years: "2016–2018",
          },
          {
            label: "Full-stack · Maine-et-Loire Department",
            years: "2015–2016",
          },
          {
            label: "Software & support · Drouault",
            years: "2013–2015",
          },
        ],
      },
    ],
  },
  education: {
    title: "education",
    rows: [
      {
        key: "2019",
        value: "IT project management · RNCP I, IMIE",
      },
      {
        key: "2018",
        value: "Software architect · RNCP II, IMIE",
      },
      {
        key: "2018",
        value: "UI/UX Designer · RNCP II, IMIE",
      },
      {
        key: "2017",
        value: "Bachelor’s degree in software development · Nantes University",
      },
    ],
  },
  languages: {
    title: "languages",
    rows: [
      {
        key: "fr",
        value: "French · native",
      },
      {
        key: "en",
        value: "English · professional",
      },
      {
        key: "es",
        value: "Spanish · basics",
      },
    ],
  },
  home: "cd ~/",
};
