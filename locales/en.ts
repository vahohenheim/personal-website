import * as content from "./content/en";

const en = {
  metadata: {
    title: "Senior front-end engineer · freelance | valentinbourreau",
    description: content.home.lead,
  },
  person: {
    jobTitle: "Senior front-end engineer",
  },
  breadcrumb: {
    home: "Home",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainMenu: "Main menu",
    socialNetworks: "Profiles and contact",
    email: "Email",
    newTab: "(opens in a new tab)",
    portrait: "Portrait of Valentin Bourreau",
    toggleLanguage: "Change language",
    breadcrumb: "Breadcrumb",
    toggleTheme: "Switch between day and night mode",
    otherLanguage: "Version française",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
  },
  legal: {
    title: "legal notice and privacy",
    updated: "Last updated on {date}.",
    metadata: {
      title: "Legal notice and privacy | valentinbourreau",
      description:
        "Publisher and host of valentinbourreau.com, and how the site handles visitor data: audience measurement, hosting, cookies and your rights.",
    },
    sections: [
      {
        heading: "Publisher",
        paragraphs: [
          "This website is published by Valentin Bourreau, in a personal capacity.",
          "Contact: contact@valentinbourreau.com.",
        ],
      },
      {
        heading: "Hosting",
        paragraphs: [
          "The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com).",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "The texts, the portrait and the source code are the work of Valentin Bourreau. All rights reserved.",
        ],
      },
      {
        heading: "Personal data",
        paragraphs: [
          "This site has no account, no form and no advertising. Valentin Bourreau is the controller of the processing described below.",
          "Audience measurement. Vercel Web Analytics counts page views, to know how the site is used. According to Vercel, it sets no cookie, recognises a visit through a hash of the incoming request that is discarded after 24 hours, and records with each page view the page, the referring site, the country and region, the browser, the operating system and the type of device. The statistics are aggregated.",
          "Hosting. Like any host, Vercel processes the IP address and the technical data of each request to deliver the pages and to protect the service, for the period it sets.",
          "Legal basis. The legitimate interest in running the site, keeping it secure and knowing its audience.",
          "Recipients and transfers. Vercel Inc. acts as a processor. It is established in the United States, so data may be processed outside the European Union, under the safeguards set out in Vercel’s data processing agreement.",
          "Email. If you write to the contact address, your message and your address are used only to reply to you.",
        ],
      },
      {
        heading: "Cookies and local storage",
        paragraphs: [
          "The site keeps two preferences in your browser, and only when you change them: the language (a cookie named NEXT_LOCALE, kept for one year) and the light or dark theme (local storage). They are not used to track you and need no consent.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under the GDPR, you can ask to access, correct or delete your data, or object to their processing, by writing to contact@valentinbourreau.com.",
          "You can also lodge a complaint with the French data protection authority, the CNIL (cnil.fr).",
        ],
      },
    ],
  },
  header: {
    menu: { resume: "cv", projects: "projects", contact: "contact" },
  },
  home: content.home,
  resume: {
    ...content.resume,
    metadata: {
      title: "Résumé · Senior front-end engineer | valentinbourreau",
      description:
        "Resume of Valentin Bourreau, senior front-end engineer in Paris: experience, skills and qualifications in React, Next.js, Angular and team leadership.",
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
        name: "Nantes Metropole",
      },
      anjou: {
        name: "Maine-et-Loire Department",
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
        name: "Nantes University",
      },
    },
  },
  roles: {
    "front-end-lead": "lead tech front-end",
    "front-end-engineer": "front-end engineer",
    "front-end-developer": "front-end developer",
    "full-stack-developer": "full-stack developer",
    "ui-ux-designer": "UI/UX Designer",
    "software-developer": "software developer",
    "help-desk": "help desk",
    teacher: "teacher",
  },
  qualifications: {
    title: "qualifications",
    list: {
      "project-manager-in-it": {
        label: "IT project management",
      },
      "analyst-and-webdeveloper": {
        label: "Software Architect",
      },
      "product-designer": {
        label: "UI/UX Designer",
      },
      "software-developer": {
        label: "Software developer",
      },
    },
    level: {
      "rncp-level-i": {
        name: "RNCP Level I",
      },
      "rncp-level-ii": {
        name: "RNCP Level II",
      },
      "university-degree": {
        name: "University degree",
      },
    },
  },
  languages: {
    title: "languages",
    list: {
      en: {
        name: "English",
      },
      fr: {
        name: "French",
      },
      es: {
        name: "Spanish",
      },
    },
    level: {
      native: {
        name: "native",
      },
      professional: {
        name: "professional",
      },
      notion: {
        name: "basics",
      },
    },
  },
  "not-found": {
    title: "Oops, page not found!",
    description: "The page you’re looking for doesn’t exist. It might have been moved or deleted.",
    "back-to-homepage": "back to homepage",
  },
  error: {
    title: "Oops, an error occurred!",
    description:
      "We’re sorry, but there seems to be a problem on our end. Please try again later or contact me directly by <1>linkedin</1> if the issue persists.",
    retry: "try again",
    "back-to-homepage": "back to homepage",
  },
  footer: {
    legal: "legal notice",
  },
};

export type Dictionary = typeof en;

export default en;
