import { PersonalProjectId } from "@/lib/models/personal-project";
import { type Post } from "@/lib/models/post";

/**
 * Every post of the site, most recent first: posts published the same day keep this
 * order everywhere. To publish one: write `content/posts/<slug>/<locale>.mdx`, add an
 * entry here and its loader in post-bodies.ts. See docs/features/posts.md.
 *
 * Plain data only: proxy.ts reads this list to know which posts are protected, and must
 * not pull in the bodies.
 */
export const POSTS: Post[] = [
  {
    slug: "brut",
    publishedAt: "2026-10-14",
    updatedAt: "2026-10-14",
    cover: { src: "/posts/brut/accueil.webp", width: 1440, height: 900 },
    images: [
      { src: "/posts/brut/perf-scores-jour.webp", width: 2080, height: 1200 },
      { src: "/posts/brut/perf-lcp-jour.webp", width: 2080, height: 1200 },
      { src: "/posts/brut/perf-poids-jour.webp", width: 2080, height: 1200 },
      { src: "/posts/brut/perf-video-jour.webp", width: 2080, height: 1200 },
    ],
    project: {
      name: "BRUT",
      type: "WebSite",
      url: "https://www.mangezbrut.fr",
      personalProjectId: PersonalProjectId.BRUT,
    },
    versions: {
      fr: {
        title: "BRUT, le site d’un camion qui change d’adresse chaque semaine",
        description:
          "Le site d’un food truck à Tours\u00a0: pages pré-rendues, contenu modifiable par le client, tableau de bord des avis, et une passation sans développeur.",
        lead: "Le site de BRUT, un food truck de bouchées à Tours\u00a0: dire où trouver le camion, donner faim, récolter des inscrits et des avis. Et surtout, un site que son fondateur modifie seul, sans développeur, même quand je suis à l’autre bout du monde.",
        tags: [
          "next.js 16",
          "cache components",
          "shadcn/ui",
          "neon",
          "vercel botid",
          "brevo",
          "performance",
          "lighthouse",
        ],
        coverAlt:
          "Accueil du site de BRUT\u00a0: logo, accroche « C’est bon parce que c’est vrai » et bouton « Où on est cette semaine », sur l’image d’attente de la vidéo.",
      },
    },
  },
  {
    slug: "lotus",
    publishedAt: "2026-10-14",
    updatedAt: "2026-10-14",
    cover: { src: "/posts/lotus/ecran-tableau-jour.webp", width: 2560, height: 1800 },
    project: {
      name: "lotus",
      type: "WebApplication",
      applicationCategory: "BusinessApplication",
      personalProjectId: PersonalProjectId.LOTUS,
    },
    versions: {
      fr: {
        title: "lotus, l’app qui gère ma micro-entreprise",
        description:
          "Comptabilité, échéances URSSAF dans Google Calendar, factures et prospects\u00a0: l’app web qui gère ma micro-entreprise, et comment elle est construite.",
        lead: "Comptabilité, échéances URSSAF dans mon agenda, factures, clients, prospects venus de mon site\u00a0: un seul outil, taillé pour un freelance qui part travailler un an à l’étranger. Ce qu’il calcule, et comment il est construit.",
        tags: [
          "next.js 16",
          "server actions",
          "shadcn/ui",
          "drizzle",
          "neon",
          "vercel blob",
          "google calendar",
        ],
        coverAlt:
          "Tableau de bord de lotus\u00a0: chiffre d’affaires encaissé, reste à encaisser, montant à mettre de côté pour l’URSSAF, tâches du moment et derniers prospects.",
      },
    },
  },
  {
    slug: "headless-commerce",
    publishedAt: "2026-10-14",
    updatedAt: "2026-10-14",
    // Listed nowhere, readable with the password only. Remove this line to make it public.
    visibility: "protected",
    cover: {
      src: "/posts/headless-commerce/schema-architecture-jour.webp",
      width: 2080,
      height: 1200,
    },
    versions: {
      fr: {
        title: "Refondre un e-commerce en headless, côté front et côté équipe",
        description:
          "Next.js, GraphQL et types inférés, CMS headless, passerelle d’API\u00a0: l’architecture d’un e-commerce B2B refondu, et mon rôle de lead front-end.",
        lead: "Un e-commerce B2B monolithique coupé en deux\u00a0: un back qui garde le métier et l’expose en GraphQL, un front Next.js qui rend six vitrines. Comment ce front est construit, et ce que j’y ai fait comme lead technique pendant un an et demi.",
        tags: [
          "next.js 16",
          "graphql",
          "gql.tada",
          "contentful",
          "gravitee",
          "algolia",
          "cloudflare",
          "lead tech",
        ],
        coverAlt:
          "Architecture du front\u00a0: le navigateur passe par Cloudflare (WAF, CDN), puis par l’application Next.js sur Vercel, qui assemble côté serveur quatre sources\u00a0: le back e-commerce et le CMS en GraphQL, Algolia pour la recherche, et une passerelle Gravitee devant l’ERP. Le CMS rappelle le front par webhook à chaque publication.",
      },
    },
  },
  {
    slug: "pensee",
    publishedAt: "2026-10-13",
    updatedAt: "2026-10-13",
    cover: { src: "/posts/pensee/schema-architecture-jour.webp", width: 2080, height: 1200 },
    project: {
      name: "pensee",
      type: "MobileApplication",
      operatingSystem: "iOS",
      applicationCategory: "LifestyleApplication",
      personalProjectId: PersonalProjectId.PENSEE,
    },
    versions: {
      fr: {
        title: "pensee, un carnet hors ligne qui prend du recul",
        description:
          "Une app iPhone pour écrire ses notes sans réseau, et une IA qui les relit chaque semaine\u00a0: produit, architecture local-first, pipeline du Recul.",
        lead: "Une app iPhone pour écrire mes notes du jour sans réseau, synchronisées en arrière-plan, et relues chaque semaine par une IA qui en tire un bulletin. Comment je l’ai pensée, comment elle fonctionne, et comment je l’ai construite en deux jours, depuis mon téléphone.",
        tags: [
          "expo",
          "react native",
          "next.js",
          "sqlite",
          "postgres",
          "api claude",
          "local-first",
        ],
        coverAlt:
          "Architecture de pensee\u00a0: sur l’iPhone, l’éditeur écrit dans SQLite chiffrée, le moteur de synchro pousse et tire les notes vers l’API Next.js sur Vercel, qui range les notes dans Postgres, rédige le Recul avec l’API Claude sur déclenchement horaire de GitHub Actions, et copie chaque jour vers Notion.",
      },
    },
  },
  {
    slug: "example-draft",
    publishedAt: "2026-10-11",
    updatedAt: "2026-10-11",
    // A template showing what a post can contain. It is not meant to be published.
    draft: true,
    versions: {
      fr: {
        title: "Exemple\u00a0: la forme d’un article",
        description:
          "Un brouillon qui montre ce qu’un article peut contenir\u00a0: intertitres, listes, citation, code. Jamais visible sur le site en production.",
        lead: "Un brouillon qui montre ce qu’un article peut contenir. Il ne sera jamais publié.",
        tags: ["exemple"],
      },
      en: {
        title: "Example: what a post looks like",
        description:
          "A draft showing what a post can contain: headings, lists, a quote, code. Never visible on the production site.",
        lead: "A draft showing what a post can contain. It will never be published.",
        tags: ["example"],
      },
    },
  },
];
