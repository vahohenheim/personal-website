import { type OfferTexts } from "@/lib/models/offer";

// The services page (`/offre/`) and the offer block of the home page, from Valentin's brief
// of 16 October 2026. Prices are not written here: they come from lib/constants/offer.ts.
// English mirror: offer.en.ts.

export const offer: OfferTexts = {
  title: "Offre",
  breadcrumb: "offre",
  lead: "Ingénieur web senior, spécialiste des plateformes headless et de Next.js. Audit, lead technique, développement, création de sites et mise en production, à distance et en asynchrone.",
  meta: { status: "freelance", remote: "100 % à distance", vat: "prix HT" },
  actions: { contact: "Prendre contact", resume: "Voir le CV" },
  toc: {
    label: "sommaire",
    summary: "sommaire · {count} sections",
    navLabel: "Sommaire de l’offre",
  },
  anchor: "Lien vers la section {title}",
  sections: {
    positioning: { label: "positionnement", title: "Positionnement" },
    services: { label: "offres", title: "Les offres" },
    rates: { label: "tarifs", title: "Tarifs" },
    method: { label: "méthode", title: "Façon de travailler" },
    contact: { label: "contact", title: "Prendre contact" },
  },
  positioning: {
    text: "Je suis ingénieur web senior, spécialiste des plateformes headless et de Next.js. En huit ans, dont un an et demi de lead tech front-end sur une plateforme e-commerce headless, j’ai travaillé du rendu jusqu’à la mise en production. Je couvre aussi le back et l’infra, en prolongement du web.",
    card: [
      { key: "spécialité", value: "plateformes headless · Next.js" },
      { key: "périmètre", value: "front · back · infra web" },
      { key: "expérience", value: "8 ans, dont 1 an ½ de lead tech front-end" },
      {
        key: "stack",
        value:
          "Next.js App Router · Magento · Contentful · Algolia · Vercel · Cloudflare · OpenTelemetry",
      },
      { key: "mode", value: "100 % à distance, en asynchrone" },
    ],
  },
  services: {
    audit: {
      code: "audit",
      billing: "forfait",
      title: "Audit performance & architecture",
      summary: "Core Web Vitals, cache et CDN, rendu, observabilité",
      text: "Un état des lieux de votre plateforme : Core Web Vitals, cache et CDN, stratégie de rendu, observabilité.",
      deliverables: ["Rapport d’audit", "Feuille de route priorisée"],
      prices: { express: "express · 2 j", full: "complet · 5 j" },
    },
    lead: {
      code: "lead",
      billing: "au jour",
      title: "Lead technique à temps partiel",
      summary: "1 à 3 j par semaine : cadrage, revue de code, architecture",
      text: "Un lead technique dans votre équipe, de 1 à 3 jours par semaine.",
      deliverables: [
        "Cadrage des sujets techniques",
        "Revue de code",
        "Arbitrages d’architecture",
        "Lien avec produit et design",
      ],
      detail: { label: "rythme", value: "1 à 3 j par semaine" },
      prices: { day: "tarif" },
    },
    build: {
      code: "build",
      billing: "forfait",
      title: "Développement headless au forfait",
      summary: "Front Next.js, CMS ou e-commerce, API et BFF Node",
      text: "Un périmètre défini ensemble, livré au forfait.",
      deliverables: ["Front Next.js", "Intégration CMS ou e-commerce", "API et BFF Node"],
      detail: { label: "durée", value: "selon le périmètre" },
      prices: { quote: "prix" },
    },
    creation: {
      code: "création",
      billing: "prix fixe",
      title: "Création de site ou d’application sur mesure",
      summary: "Landing page, site vitrine, boutique ou application, à prix fixe",
      text: "Un site ou une application dessinés pour vous, sur une base technique éprouvée\u00a0: Next.js, contenus modifiables par vous, mise en ligne sur Vercel. Un périmètre écrit et un prix fixe\u00a0; une boutique headless ou une application plus large se chiffre sur devis.",
      deliverables: [
        "Design sur mesure, sans thème acheté",
        "Contenus modifiables sans développeur",
        "Performance et SEO de base",
        "Deux tours de retours inclus",
        "Textes et images fournis par vous",
      ],
      prices: {
        landing: "landing page · 1 page",
        site: "site vitrine · 5 pages",
        page: "page supplémentaire",
        shop: "boutique en ligne · Shopify",
        app: "application web · 1 parcours",
        care: "maintenance · hébergement, mises à jour, 1\u00a0h",
      },
    },
    launch: {
      code: "mise en prod",
      billing: "forfait",
      title: "Mise en production web",
      summary: "CI/CD, Vercel, Cloudflare, OpenTelemetry",
      text: "La chaîne de livraison et l’observabilité de votre plateforme, mises en place.",
      deliverables: [
        "CI/CD",
        "Déploiement sur Vercel",
        "Cloudflare",
        "Observabilité OpenTelemetry",
      ],
      detail: { label: "durée", value: "selon le périmètre" },
      prices: { range: "prix" },
    },
    retainer: {
      code: "run",
      billing: "mensuel",
      title: "Forfait mensuel conseil et maintenance",
      summary: "Des jours réservés chaque mois",
      text: "Des jours réservés chaque mois pour le conseil et la maintenance de votre plateforme.",
      deliverables: ["Jours réservés chaque mois", "Conseil", "Maintenance"],
      detail: { label: "format", value: "jours réservés chaque mois" },
      prices: { month: "prix" },
    },
  },
  rates: {
    columns: { plan: "formule", rate: "tarif", billing: "facturation" },
    days: {
      reference: { label: "Référence", billing: "Au jour" },
      urgent: { label: "Mission courte ou urgence", billing: "Au jour" },
    },
    packages: {
      label: "Forfaits",
      value: "au périmètre",
      billing: "Au périmètre convenu, pas au temps passé",
    },
    vat: "Tous les prix sont hors taxes. TVA non applicable, article 293 B du CGI.",
  },
  method: [
    { title: "À distance.", text: "Toutes les missions se font à distance." },
    { title: "En asynchrone.", text: "Les échanges passent d’abord par l’écrit." },
    {
      title: "Horaires flexibles.",
      text: "Le travail avance sur la semaine, pas sur un créneau fixe.",
    },
    {
      title: "Documentation écrite.",
      text: "Décisions, choix d’architecture et livrables sont consignés.",
    },
    { title: "Points réguliers.", text: "Un rythme de points fixé ensemble au démarrage." },
  ],
  contact: {
    text: "Décrivez votre plateforme et votre besoin : je reviens vers vous avec une proposition.",
    cta: "Prendre contact →",
  },
  price: {
    from: "dès {price}",
    range: "{min} à {max}",
    day: "{price}/j",
    month: "{price}/mois",
    quote: "sur devis",
  },
  home: {
    title: "offre",
    lead: "Ingénieur web senior, spécialiste des plateformes headless et de Next.js. Je couvre aussi le back et l’infra, et je crée des sites et des applications sur mesure, à prix fixe.",
    more: "Voir l’offre complète →",
    vat: "prix HT",
  },
  metadata: {
    title: "Offre · audit, lead technique, mise en production | valentinbourreau",
    description:
      "Offre de Valentin Bourreau, ingénieur web senior : audit de performance, lead technique, développement headless et mise en production Next.js.",
  },
};
