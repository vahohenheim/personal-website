import { type HomeContent, type ResumeContent } from "@/lib/models/content";

// Texts of the home page and the resume, word for word from docs/redesign/brief.md.
// `\u00a0` is a non-breaking space: French typography needs one before `:` and `;`.

export const home: HomeContent = {
  title: "Ingénieur front-end senior",
  lead: "Freelance. J’accompagne les équipes produit sur leurs interfaces web\u00a0: architecture front-end, design system, qualité.",
  card: [
    {
      key: "nom",
      value: "Valentin Bourreau",
    },
    {
      key: "rôle",
      value: "Ingénieur front-end senior",
    },
    {
      key: "statut",
      value: "Freelance",
      live: true,
    },
    {
      key: "expérience",
      value: "développeur depuis 2013",
    },
    {
      key: "stack",
      value: "React · Next.js · Angular · GraphQL",
    },
    {
      key: "périmètre",
      value: "architecture · design system · lead technique",
    },
    {
      key: "base",
      value: "Paris, France",
    },
    {
      key: "langues",
      value: "fr natif · en · es",
    },
  ],
  actions: {
    contact: "Prendre contact",
    resume: "Voir le CV",
  },
  brings: {
    title: "ce que j’apporte",
    quote:
      "Le front-end arrive en dernier dans la chaîne de décision. C’est là que je fais le lien entre produit, design, marketing et technique.",
    items: [
      {
        meta: "depuis 2013",
        title: "Ingénierie",
        text: "Recherche, architecture, développement, documentation, tests. Front-end d’abord, avec une formation back-end pour tenir le full-stack.",
      },
      {
        meta: "ep · solo paris",
        title: "Lead technique",
        text: "Une équipe de cinq chez EP, puis un an et demi de lead tech front-end chez SOLO. Pratiques communes, recrutement, onboarding, documentation.",
      },
      {
        meta: "produit · design · marketing · tech",
        title: "Pont entre les services",
        text: "Faire circuler les besoins de chacun pour que les choix de design avancent.",
      },
    ],
  },
  changelog: {
    title: "changelog",
    more: "journal complet →",
    entries: [
      {
        date: "2026.10 → aujourd’hui",
        current: true,
        title: "Ingénieur front-end senior",
        company: "Freelance",
        text: "Statut actuel. Missions front-end\u00a0: architecture, design system, qualité, lead technique.",
      },
      {
        date: "2024.10 → 2026.10",
        title: "Lead tech front-end",
        company: "SOLO Paris",
        text: "Ingénieur puis lead tech front-end pendant un an et demi sur la refonte e-commerce headless\u00a0: Magento monolithique → Next.js + Magento 2 via GraphQL. Algolia, Contentful, Cloudflare.",
      },
      {
        date: "2021.06 → 2024.09",
        title: "Lead tech front-end",
        company: "EP, Nantes",
        text: "Start-up studio dans l’immobilier\u00a0: apps regtech et site de data visualisation. Équipe de cinq, design system en Web Components, migration Next.js 14 et déploiement continu.",
      },
      {
        date: "2020.02 → 2021.06",
        title: "Ingénieur front-end",
        company: "Conserto",
        text: "Mission chez EP Tribe\u00a0: Angular, Meteor, génération statique Node.js.",
      },
      {
        date: "2013 → 2020",
        title: "Front-end, full-stack, UI/UX, formation",
        text: "Troopers, Nantes Métropole, Connexing, Département du Maine-et-Loire, Drouault.",
      },
    ],
  },
  projects: {
    title: "projets",
    status: {
      online: "en ligne",
      starting: "en démarrage",
      archived: "archivé",
    },
    items: [
      {
        id: "brut",
        name: "brut",
        status: "online",
        text: "Food truck BRUT à Tours\u00a0: contenu éditable, newsletter, avis clients.",
        stack: "next.js",
      },
      {
        id: "lotus",
        name: "lotus",
        status: "starting",
        text: "Mon statut d’indépendant, automatisé\u00a0: factures et devis, cotisations, échéances, leads et relances clients.",
        stack: "next.js · drizzle · neon",
      },
      {
        id: "pensee",
        name: "pensee",
        status: "starting",
        text: "App mobile de notes quotidiennes, pensée pour écrire hors ligne\u00a0: éditeur riche, synchronisation, recherche. Recul quotidien par IA.",
        stack: "expo · next.js · api claude",
      },
    ],
    more: "+ 3 archivés\u00a0:",
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
    cta: "Prendre contact →",
  },
};

export const resume: ResumeContent = {
  title: "Ingénieur front-end senior",
  breadcrumb: "cv",
  meta: {
    status: "freelance",
    since: "développeur depuis 2013",
    location: "Paris, France",
  },
  summary:
    "Plus de dix ans de développement web, dont deux expériences de lead tech front-end, chez EP puis chez SOLO. Aujourd’hui freelance, j’interviens sur l’architecture front-end, les design systems et la qualité, en faisant le pont entre produit, design et technique.",
  actions: {
    download: "Télécharger cv.pdf",
    contact: "Prendre contact",
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
        key: "plateforme",
        value: "magento 2 · contentful · algolia · cloudflare · knock · nx · node.js · laravel",
      },
      {
        key: "qualité",
        value: "jest · cypress · playwright · documentation · guidelines",
      },
      {
        key: "équipe",
        value: "lead · recrutement · onboarding · lien produit / design / tech",
      },
      {
        key: "design",
        value: "ui/ux · design systems · sketch · suite adobe",
      },
    ],
  },
  changelog: {
    title: "changelog",
    entries: [
      {
        date: "2026.10 → aujourd’hui",
        current: true,
        duration: "statut actuel",
        title: "Ingénieur front-end senior",
        company: "Freelance",
        text: "Missions front-end\u00a0: architecture, design system, qualité, lead technique.",
      },
      {
        date: "2024.10 → 2026.10",
        duration: "2\u00a0ans",
        title: "Lead tech front-end",
        company: "SOLO Paris",
        roles: ["lead tech front-end · 1\u00a0an\u00a0½", "ingénieur front-end · 6\u00a0mois"],
        text: "Refonte e-commerce dans une équipe de dix\u00a0: Magento monolithique → headless Next.js + Magento 2, GraphQL en couche d’interface.",
        achievements: [
          "Intégration Algolia sur mesure\u00a0: performance et pertinence de la recherche",
          "Architecture Contentful pour le contenu éditorial, avec le Marketing",
          "Sécurité\u00a0: WAF Cloudflare",
          "Processus qualité et guidelines techniques",
          "Notifications Knock, PDF avec PDFKit, API Gravitee",
        ],
      },
      {
        date: "2021.06 → 2024.09",
        duration: "3\u00a0ans 3\u00a0mois",
        title: "Lead tech front-end",
        company: "EP, Nantes",
        roles: ["lead tech front-end · 1\u00a0an", "ingénieur front-end · 2\u00a0ans 2\u00a0mois"],
        text: "Start-up studio dans l’immobilier\u00a0: création d’apps regtech et d’un site de data visualisation.",
        achievements: [
          "Management de cinq développeurs\u00a0: recrutement, onboarding, montée en compétence",
          "Garant du design system en Web Components, façades d3.js et Mapbox",
          "Migration JAMStack → Next.js 14, déploiement continu, nouvelle app Next.js + Redux Toolkit",
          "Projets Angular 5, 12 et 17\u00a0; monorepo NX\u00a0; SEO éditorial (JSON-LD, sitemaps)",
          "Pont entre équipes pluridisciplinaires sur la cible produit et qualité",
        ],
      },
      {
        date: "2020.02 → 2021.06",
        title: "Ingénieur front-end",
        company: "Conserto, Nantes",
        text: "Mission chez EP Tribe\u00a0: Angular, Meteor full-stack, génération statique Node.js, e-mails Adobe Campaign.",
      },
      {
        date: "2018.06 → 2020.01",
        title: "Développeur front-end",
        company: "Troopers, Nantes",
        text: "React, Redux, RxJS\u00a0; Expo et React Native\u00a0; styleguides JSX et Twig avec Tailwind et Ant Design.",
      },
      {
        date: "2013.09 → 2018.09",
        title: "Versions antérieures",
        earlier: [
          {
            label: "Formateur · Nantes Métropole",
            years: "2018",
          },
          {
            label: "Full-stack & UI/UX designer · Connexing",
            years: "2016–2018",
          },
          {
            label: "Full-stack · Département du Maine-et-Loire",
            years: "2015–2016",
          },
          {
            label: "Logiciel & support · Drouault",
            years: "2013–2015",
          },
        ],
      },
    ],
  },
  education: {
    title: "formation",
    rows: [
      {
        key: "2019",
        value: "Gestion de projet informatique · RNCP I, IMIE",
      },
      {
        key: "2018",
        value: "Architecte logiciel · RNCP II, IMIE",
      },
      {
        key: "2018",
        value: "UI/UX Designer · RNCP II, IMIE",
      },
      {
        key: "2017",
        value: "Licence développeur logiciel · Université de Nantes",
      },
    ],
  },
  languages: {
    title: "langues",
    rows: [
      {
        key: "fr",
        value: "Français · natif",
      },
      {
        key: "en",
        value: "Anglais · professionnel",
      },
      {
        key: "es",
        value: "Espagnol · notions",
      },
    ],
  },
  home: "cd ~/",
};
