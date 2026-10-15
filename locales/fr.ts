import * as content from "./content/fr";
import type { Dictionary } from "./en";
import { cgv } from "./legal/cgv.fr";
import * as notice from "./legal/notice.fr";

const fr: Dictionary = {
  metadata: {
    title: "Ingénieur front-end senior · freelance | valentinbourreau",
    description: content.home.lead,
  },
  person: {
    jobTitle: "Ingénieur front-end senior",
  },
  breadcrumb: {
    home: "Accueil",
  },
  a11y: {
    skipToContent: "Aller au contenu",
    mainMenu: "Menu principal",
    socialNetworks: "Profils et contact",
    email: "E-mail",
    newTab: "(s’ouvre dans un nouvel onglet)",
    portrait: "Portrait de Valentin Bourreau",
    toggleLanguage: "Changer de langue",
    breadcrumb: "Fil d’Ariane",
    toggleTheme: "Passer en mode jour ou nuit",
    otherLanguage: "English version",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
  },
  legal: {
    title: "Mentions légales et confidentialité",
    updated: "dernière mise à jour le {date}",
    toc: {
      label: "sommaire",
      summary: "sommaire · {count} sections",
      navLabel: "Sommaire des mentions légales",
    },
    anchor: "Lien vers la section {title}",
    metadata: {
      title: "Mentions légales et confidentialité | valentinbourreau",
      description:
        "Éditeur et hébergeur de valentinbourreau.com, et traitement des données des visiteurs et des clients\u00a0: mesure d’audience, cookies, vos droits.",
    },
    sections: notice.sections,
  },
  cgv: {
    title: "Conditions générales de prestation",
    version: "version {version} · en vigueur au {date}",
    download: "télécharger en PDF",
    // Shown on the English page only, where the terms are a translation.
    notice: "",
    metadata: {
      title: "Conditions générales de prestation | valentinbourreau",
      description:
        "Conditions générales de prestation de Valentin Bourreau, ingénieur front-end freelance\u00a0: devis, exécution, prix, paiement, propriété intellectuelle.",
    },
    terms: cgv,
  },
  contact: {
    title: "Prendre contact",
    description: "Trois questions pour comprendre votre besoin. Je vous réponds par e-mail.",
    close: "fermer",
    step: "étape {current} / {total}",
    need: {
      title: "De quoi avez-vous besoin\u00a0?",
      options: {
        architecture: "Architecture front-end",
        "design-system": "Design system",
        quality: "Qualité et audit",
        "tech-lead": "Lead technique",
        other: "Autre chose",
      },
    },
    details: {
      title: "Parlez-moi du projet",
      message: "votre message",
      placeholder: "Contexte, équipe, objectifs…",
      timeline: "démarrage souhaité",
      timelines: {
        asap: "Dès que possible",
        "one-to-three-months": "Dans 1 à 3 mois",
        later: "Plus tard",
        unsure: "Je ne sais pas encore",
      },
    },
    identity: {
      title: "Comment vous répondre\u00a0?",
      name: "nom",
      email: "e-mail",
      company: "entreprise",
      optional: "facultatif",
    },
    actions: {
      next: "Continuer",
      back: "Retour",
      send: "Envoyer",
      sending: "Envoi…",
    },
    privacy: "Vos réponses servent uniquement à vous répondre.",
    privacyLink: "Mentions légales et confidentialité",
    success: {
      status: "envoyé",
      title: "Message envoyé",
      text: "Merci {name}. J’ai bien reçu votre message et je vous réponds par e-mail.",
      recap: {
        need: "besoin",
        timeline: "démarrage",
        email: "e-mail",
      },
      back: "Retour à l’accueil",
    },
    sent: {
      text: "Message envoyé. Je vous réponds par e-mail.",
      again: "nouveau message",
    },
    errors: {
      need_required: "Choisissez un besoin pour continuer.",
      message_too_short: "Votre message est trop court\u00a0: quelques mots de contexte suffisent.",
      name_required: "Indiquez votre nom.",
      invalid_email: "Cette adresse e-mail n’est pas valide.",
      invalid_body: "Le formulaire n’a pas pu être lu. Rechargez la page et réessayez.",
      forbidden:
        "L’envoi a été bloqué par la protection anti-robots. Réessayez, ou écrivez à {email}.",
      unavailable: "Le formulaire est momentanément indisponible. Écrivez à {email}.",
      server_error: "Une erreur est survenue de notre côté. Réessayez dans un instant.",
      network: "Connexion impossible. Vérifiez votre réseau et réessayez.",
    },
  },
  header: {
    menu: { resume: "cv", projects: "projets", posts: "articles", contact: "contact" },
  },
  posts: {
    title: "Articles",
    breadcrumb: "articles",
    lead: "Mes projets racontés de bout en bout, et des notes sur l’architecture front-end, les design systems et la qualité.",
    feed: "flux rss →",
    draft: "brouillon",
    published: "Publié le {date}",
    updated: "Mis à jour le {date}",
    back: "← tous les articles",
    readingTime: "{minutes}\u00a0min de lecture",
    toc: "sommaire",
    tags: "Mots-clés",
    next: "article suivant →",
    section: "Projets",
    readPost: "lire l’article",
    home: {
      title: "articles",
      all: "tous les articles →",
    },
    unlock: {
      title: "Article protégé",
      text: "Cet article n’est pas public. Saisissez le mot de passe qui vous a été communiqué pour le lire.",
      password: "mot de passe",
      submit: "Lire l’article",
      sending: "Vérification…",
      shareLabel: "article protégé",
      metadata: {
        title: "Article protégé | valentinbourreau",
        description: "Un article lisible avec un mot de passe seulement.",
      },
      errors: {
        refused: "Ce mot de passe n’ouvre pas l’article.",
        invalid_body: "Le formulaire n’a pas pu être lu. Rechargez la page et réessayez.",
        network: "Connexion impossible. Vérifiez votre réseau et réessayez.",
      },
    },
    metadata: {
      title: "Articles · architecture front-end, design systems, qualité | valentinbourreau",
      description:
        "Projets et notes de Valentin Bourreau, ingénieur front-end senior\u00a0: architecture front-end, design systems, qualité et lead technique.",
    },
  },
  home: content.home,
  resume: {
    ...content.resume,
    metadata: {
      title: "CV · Ingénieur front-end senior | valentinbourreau",
      description:
        "CV de Valentin Bourreau, ingénieur front-end senior à Paris : expériences, compétences et diplômes en React, Next.js, Angular et management d’équipe.",
    },
  },
  companies: {
    list: {
      solo: {
        name: "SOLO Paris",
      },
      ep: {
        name: "EP",
      },
      conserto: {
        name: "Conserto",
      },
      troopers: {
        name: "Troopers",
      },
      connexing: {
        name: "Connexing",
      },
      "nantes-metropole": {
        name: "Nantes Métropole",
      },
      anjou: {
        name: "Département du Maine-et-Loire",
      },
      drouault: {
        name: "Drouault",
      },
    },
  },
  schools: {
    list: {
      imie: {
        name: "IMIE",
      },
      "nantes-university": {
        name: "Université de Nantes",
      },
    },
  },
  roles: {
    "front-end-lead": "lead tech front-end",
    "front-end-engineer": "ingénieur front-end",
    "front-end-developer": "développeur front-end",
    "full-stack-developer": "développeur full-stack",
    "ui-ux-designer": "UI/UX Designer",
    "software-developer": "développeur logiciel",
    "help-desk": "support informatique",
    teacher: "formateur",
  },
  qualifications: {
    title: "qualifications",
    list: {
      "project-manager-in-it": {
        label: "Gestion de projet informatique",
      },
      "analyst-and-webdeveloper": {
        label: "Architecte logiciel",
      },
      "product-designer": {
        label: "UI/UX Designer",
      },
      "software-developer": {
        label: "Développeur logiciel",
      },
    },
    level: {
      "rncp-level-i": {
        name: "RNCP niveau I",
      },
      "rncp-level-ii": {
        name: "RNCP niveau II",
      },
      "university-degree": {
        name: "Licence universitaire",
      },
    },
  },
  languages: {
    title: "langues",
    list: {
      en: {
        name: "Anglais",
      },
      fr: {
        name: "Français",
      },
      es: {
        name: "Espagnol",
      },
    },
    level: {
      native: {
        name: "natif",
      },
      professional: {
        name: "professionnel",
      },
      notion: {
        name: "notions",
      },
    },
  },
  "not-found": {
    title: "Oups, la page n’a pas été trouvée !",
    description:
      "La page que vous recherchez n’existe pas. Il se peut qu’elle ait été déplacée ou supprimée.",
    "back-to-homepage": "retour à la page d’accueil",
    metadata: {
      title: "Page introuvable | valentinbourreau",
    },
  },
  error: {
    title: "Oups, une erreur est survenue !",
    description:
      "Nous sommes désolés, il semble qu’une erreur soit survenue de notre côté. Veuillez réessayer plus tard ou contactez-moi directement par <1>linkedin</1> si le problème persiste.",
    retry: "réessayer",
    "back-to-homepage": "retour à la page d’accueil",
  },
  footer: {
    legal: "mentions légales",
    cgv: "cgv",
  },
};

export default fr;
