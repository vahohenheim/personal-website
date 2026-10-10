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
          "The logos of the companies mentioned belong to their owners. They are shown only to indicate where he worked.",
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
  "personal-projects": {
    title: "latest personal projects",
    list: {
      brut: {
        title: "brut",
        description:
          "Website of the BRUT food truck in Tours, built with Next.js 16: editable content, newsletter and customer reviews.",
      },
      bloom: {
        title: "bloom",
        description: "Next.js 15 personal assistant.",
      },
      editorials: {
        title: "editorials",
        description: "NX monorepo for editorial websites, with Next.js and a Notion adapter.",
      },
      "notion-blog": {
        title: "notion-blog",
        description: "Next.js starter connected to the Notion API.",
      },
      finance: {
        title: "finance",
        description: "React app to manage personal finances: budgets, expenses, etc.",
      },
    },
    status: {
      "coming-soon": "coming soon",
      active: "active",
      archived: "archived",
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
  experiences: {
    title: "experiences",
    roles: {
      "solo-engineer-front-end": {
        content:
          "Joined a team of ten developers to rebuild the e-commerce website: migration from a monolithic Magento architecture to a headless solution based on Next.js 16 and Magento 2, with a GraphQL API as the interface layer.<br/>· Development of a custom Algolia integration to optimise search performance and result relevance.<br/>· Architecture and implementation of Contentful CMS for centralised management of editorial content, working closely with the Marketing team to fit it into their workflows.<br/>· Handling of security concerns through the configuration and tuning of Cloudflare (WAF).<br/>· Definition and documentation of quality processes, development best practices and technical guidelines.<br/>· Evolutive and corrective maintenance of the project, with continuous technology watch.<br/>· Architecture and implementation of a notification solution with Knock.<br/>· Industrialisation of PDF generation with PDFKit.<br/>· Consumption of a Gravitee API.",
      },
      "ep-lead-front-end": {
        content:
          "· I managed a team of 5 front-end developers, including recruitment, onboarding and training. I was the guarantor of good practices around the Design system and front-end usage, and I ran the tech team ceremonies: dev retro, full-stack dev retro.<br/>· I improved the JAMStack by migrating to Next.js 14 and setting up continuous deployment. On this stack, I also led a new web app in Next.js 14 and Redux Toolkit.<br/>· I was the bridge between multidisciplinary teams to keep product and quality first.<br/>· I kept working as a front-end engineer alongside.",
      },
      "ep-engineer-front-end": {
        content:
          "· Guarantor and improvement of a design system in web components: a web component rendering engine library (life cycle, property management, rendering), and feature, GUI and utility libraries.<br/>· Integration within the Design system of a facade to d3js for charts/dataviz, as well as a Mapbox facade.<br/>· Development and architecture choices on Angular 5, 12 and 17 projects over 2 years.<br/>· Collaboration and process set-up with the Audience/SEO team for editorial sites, on content integration and SEO improvement (JSON-LD, internal linking, sitemaps).<br/>· Collaboration and process set-up with the Design team on product evolutions and the Design system.<br/>· Continuous improvement of a Meteor product (full-stack) and of a custom static generation stack in Node.js.<br/>· Email templating on Adobe Campaign.<br/>· Library testing with Jest (unit + visual and DOM snapshots), Cypress and Playwright for e2e.<br/>· Research and set-up of an NX monorepo.",
      },
      "conserto-engineer-front-end": {
        content:
          "Service mission within the EP Tribe:<br/>· Integration into the agile front-end development processes on products built with Angular.<br/>· Continuous improvement of a Meteor product (full-stack) and of a custom static generation stack in Node.js.<br/>· Email templating on Adobe Campaign.<br/>· Library testing with Jest (unit + visual and DOM snapshots), Cypress and Playwright for e2e.",
      },
      "troopers-engineer-front-end": {
        content:
          "Joined a liberated, agile web agency to work on various projects: web applications in React, Redux and RxJS. Hybrid applications with Expo and React Native. Integration and style guides in JSX and Twig with Tailwind and Ant Design.",
      },
      "connexing-full-stack-developer-ui-ux-designer": {
        content:
          "Joined the Marketing department of a trading company for the following missions: zoning, wireframing and mock-ups with Sketch for a UX audit and a website redesign. Development of an application in Laravel. Creation of visuals for marketing materials with Illustrator, Photoshop and InDesign for social media, packaging and catalogues.",
      },
      "nantes-metropole-teacher": {
        content:
          "I taught a class of 20 people in professional retraining: the basics of HTML, CSS, JavaScript, React, Git and GitHub, as well as the basics of design and user experience.",
      },
      "anjou-full-stack-developer": {
        content:
          "Joined a public administration to carry out a UX analysis and audit, then to develop a printer fleet manager in Perl, Angular 1.6 and CakePHP, then Laravel, Polymer and Sass.",
      },
      "drouault-software-developer-help-desk": {
        content:
          "Joined the IT department of an industrial company:<br/>· Computer network maintenance (Windows Server 2003).<br/>· Software development (ERP Silog, Crystal Reports, SQL Server, Visual Basic).<br/>· User support.",
      },
    },
  },
  roles: {
    "front-end-lead": "lead tech front-end",
    "senior-front-end-engineer": "senior front-end engineer",
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
    // {year} is replaced by the current year in the footer component.
    copyright: "Copyright © {year}. All rights reserved, Valentin Bourreau.",
  },
};

export type Dictionary = typeof en;

export default en;
