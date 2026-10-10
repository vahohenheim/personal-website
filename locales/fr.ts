import * as content from "./content/fr";
import type { Dictionary } from "./en";

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
    title: "mentions légales et confidentialité",
    updated: "Dernière mise à jour le {date}.",
    metadata: {
      title: "Mentions légales et confidentialité | valentinbourreau",
      description:
        "Éditeur et hébergeur de valentinbourreau.com, et traitement des données des visiteurs : mesure d’audience, hébergement, cookies et vos droits.",
    },
    sections: [
      {
        heading: "Éditeur",
        paragraphs: [
          "Ce site est édité par Valentin Bourreau, à titre personnel.",
          "Contact : contact@valentinbourreau.com.",
        ],
      },
      {
        heading: "Hébergement",
        paragraphs: [
          "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          "Les textes, le portrait et le code source sont l’œuvre de Valentin Bourreau. Tous droits réservés.",
        ],
      },
      {
        heading: "Données personnelles",
        paragraphs: [
          "Ce site n’a ni compte, ni formulaire, ni publicité. Valentin Bourreau est le responsable des traitements décrits ci-dessous.",
          "Mesure d’audience. Vercel Web Analytics compte les pages vues, pour savoir comment le site est utilisé. D’après Vercel, l’outil ne dépose aucun cookie, reconnaît une visite grâce à une empreinte de la requête supprimée au bout de 24 heures, et enregistre avec chaque page vue la page, le site d’origine, le pays et la région, le navigateur, le système d’exploitation et le type d’appareil. Les statistiques sont agrégées.",
          "Hébergement. Comme tout hébergeur, Vercel traite l’adresse IP et les données techniques de chaque requête pour servir les pages et protéger le service, pendant la durée qu’il fixe.",
          "Base légale. L’intérêt légitime à faire fonctionner le site, à le sécuriser et à connaître son audience.",
          "Destinataires et transferts. Vercel Inc. agit comme sous-traitant. La société est établie aux États-Unis : des données peuvent donc être traitées hors de l’Union européenne, selon les garanties prévues par l’accord de traitement des données de Vercel.",
          "E-mail. Si vous écrivez à l’adresse de contact, votre message et votre adresse ne servent qu’à vous répondre.",
        ],
      },
      {
        heading: "Cookies et stockage local",
        paragraphs: [
          "Le site conserve deux préférences dans votre navigateur, et seulement si vous les modifiez : la langue (un cookie nommé NEXT_LOCALE, conservé un an) et le thème clair ou sombre (stockage local). Elles ne servent pas à vous suivre et ne nécessitent pas de consentement.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          "Conformément au RGPD, vous pouvez demander l’accès à vos données, leur rectification ou leur suppression, ou vous opposer à leur traitement, en écrivant à contact@valentinbourreau.com.",
          "Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).",
        ],
      },
    ],
  },
  header: {
    menu: { resume: "cv", projects: "projets", contact: "contact" },
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
  },
};

export default fr;
