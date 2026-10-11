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
          "This site has no account and no advertising. Valentin Bourreau is the controller of the processing described below.",
          "Contact form. When you send a request, the site stores what you entered: your need, the preferred start, your message, your name, your email address, your company if you give it, the language of the page and, when it is known, the site you came from (its domain name, or the origin given in the link you followed). As we talk, follow-up notes may be added: status of the request, estimated amount, date to get back to you. This data is used only to reply to you and to follow up on your request. It is kept for at most three years after our last exchange, then deleted. You can ask for its deletion at any time.",
          "Bot protection. When the form is sent, Vercel BotID analyses technical signals from your browser to tell a person from a bot. None of these signals is stored with your request.",
          "Audience measurement. Vercel Web Analytics counts page views, to know how the site is used. According to Vercel, it sets no cookie, recognises a visit through a hash of the incoming request that is discarded after 24 hours, and records with each page view the page, the referring site, the country and region, the browser, the operating system and the type of device. Every day, the site copies anonymous totals to its database (number of visits and page views per day, per page, per referring site, per country and per type of device) and keeps them with no time limit. These totals cannot identify anyone.",
          "Form usage. The site counts, per day, how many times the contact form is opened, how many times each step is reached and how many messages are sent. These are plain counters: no identifier, no IP address and nothing you typed is attached to them, and they cannot identify anyone.",
          "Hosting. Like any host, Vercel processes the IP address and the technical data of each request to deliver the pages and to protect the service, for the period it sets.",
          "Legal basis. For the form: steps taken at your request before a possible contract. For the rest: the legitimate interest in running the site, keeping it secure and knowing its audience.",
          "Recipients and transfers. Vercel Inc. (hosting, audience measurement, bot protection) and Neon Inc. (the database where requests are stored) act as processors. They are established in the United States, so data may be processed outside the European Union, under the safeguards set out in their data processing agreements. Nobody but Valentin Bourreau reads the requests.",
          "Email. If you write to the contact address, your message and your address are used only to reply to you.",
        ],
      },
      {
        heading: "Cookies and local storage",
        paragraphs: [
          "The site keeps in your browser, and only when you act: the language you chose (a cookie named NEXT_LOCALE, kept for one year), the light or dark theme (local storage) and, after you send the form, the date it was sent (local storage), to confirm that your message has gone. None of this is used to track you or needs consent.",
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
  contact: {
    title: "Get in touch",
    description: "Three questions to understand what you need. I reply by email.",
    close: "close",
    step: "step {current} / {total}",
    need: {
      title: "What do you need?",
      options: {
        architecture: "Front-end architecture",
        "design-system": "Design system",
        quality: "Quality and audit",
        "tech-lead": "Technical lead",
        other: "Something else",
      },
    },
    details: {
      title: "Tell me about the project",
      message: "your message",
      placeholder: "Context, team, goals…",
      timeline: "preferred start",
      timelines: {
        asap: "As soon as possible",
        "one-to-three-months": "In 1 to 3 months",
        later: "Later",
        unsure: "Not sure yet",
      },
    },
    identity: {
      title: "How can I reply?",
      name: "name",
      email: "email",
      company: "company",
      optional: "optional",
    },
    actions: {
      next: "Continue",
      back: "Back",
      send: "Send",
      sending: "Sending…",
    },
    privacy: "Your answers are only used to reply to you.",
    privacyLink: "Legal notice and privacy",
    success: {
      status: "sent",
      title: "Message sent",
      text: "Thank you {name}. I have received your message and will reply by email.",
      recap: {
        need: "need",
        timeline: "start",
        email: "email",
      },
      back: "Back to the home page",
    },
    sent: {
      text: "Message sent. I will reply by email.",
      again: "new message",
    },
    errors: {
      need_required: "Choose a need to continue.",
      message_too_short: "Your message is too short: a few words of context are enough.",
      name_required: "Enter your name.",
      invalid_email: "This email address is not valid.",
      invalid_body: "The form could not be read. Reload the page and try again.",
      forbidden: "The message was blocked by the bot protection. Try again, or write to {email}.",
      unavailable: "The form is temporarily unavailable. Write to {email}.",
      server_error: "Something went wrong on our side. Try again in a moment.",
      network: "Could not connect. Check your network and try again.",
    },
  },
  header: {
    menu: { resume: "cv", projects: "projects", posts: "posts", contact: "contact" },
  },
  posts: {
    title: "Posts",
    breadcrumb: "posts",
    lead: "Retrospectives and notes on front-end architecture, design systems and quality.",
    feed: "rss feed →",
    draft: "draft",
    published: "Published on {date}",
    updated: "Updated on {date}",
    back: "← all posts",
    metadata: {
      title: "Posts · front-end architecture, design systems, quality | valentinbourreau",
      description:
        "Retrospectives and notes by Valentin Bourreau, senior front-end engineer: front-end architecture, design systems, quality and team leadership.",
    },
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
