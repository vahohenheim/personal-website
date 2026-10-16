import * as content from "./content/en";
import { cgv } from "./legal/cgv.en";
import * as notice from "./legal/notice.en";

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
    pageNav: "Related pages",
  },
  legal: {
    title: "Legal notice and privacy",
    updated: "last updated on {date}",
    toc: {
      label: "contents",
      summary: "contents · {count} sections",
      navLabel: "Contents of the legal notice",
    },
    anchor: "Link to the section {title}",
    metadata: {
      title: "Legal notice and privacy | valentinbourreau",
      description:
        "Publisher and host of valentinbourreau.com, and how the site handles the data of visitors and clients: audience measurement, cookies, your rights.",
    },
    sections: notice.sections,
  },
  cgv: {
    title: "General terms of service",
    version: "version {version} · effective from {date}",
    download: "download as PDF",
    // Shown on the English page only: the English terms are a translation.
    notice:
      "These Terms are a translation of the French original. In the event of any discrepancy, the French version prevails ([article 20](#art-20)).",
    metadata: {
      title: "General terms of service | valentinbourreau",
      description:
        "General terms of service of Valentin Bourreau, freelance front-end engineer: quotes, delivery, prices, payment, intellectual property, liability.",
    },
    terms: cgv,
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
    lead: "My projects told end to end, and notes on front-end architecture, design systems and quality.",
    feed: "rss feed →",
    draft: "draft",
    published: "Published on {date}",
    updated: "Updated on {date}",
    back: "← all posts",
    readingTime: "{minutes}\u00a0min read",
    toc: "contents",
    tocSummary: "contents · {count} sections",
    tags: "Keywords",
    next: "next post →",
    section: "Projects",
    readPost: "read the post",
    home: {
      title: "posts",
      all: "all posts →",
    },
    unlock: {
      title: "Protected post",
      text: "This post is not public. Enter the password you were given to read it.",
      password: "password",
      submit: "Read the post",
      sending: "Checking…",
      shareLabel: "protected post",
      metadata: {
        title: "Protected post | valentinbourreau",
        description: "A post readable with a password only.",
      },
      errors: {
        refused: "This password does not open the post.",
        invalid_body: "The form could not be read. Reload the page and try again.",
        network: "Cannot connect. Check your network and try again.",
      },
    },
    metadata: {
      title: "Posts · front-end architecture, design systems, quality | valentinbourreau",
      description:
        "Projects and notes by Valentin Bourreau, senior front-end engineer: front-end architecture, design systems, quality and team leadership.",
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
    metadata: {
      title: "Page not found | valentinbourreau",
    },
  },
  error: {
    title: "Oops, an error occurred!",
    description:
      "We’re sorry, but there seems to be a problem on our end. Please try again later or contact me directly by <1>linkedin</1> if the issue persists.",
    retry: "try again",
    "back-to-homepage": "back to homepage",
  },
  footer: {
    seeAlso: "see also",
    legal: "legal notice",
    cgv: "terms",
  },
};

export type Dictionary = typeof en;

export default en;
