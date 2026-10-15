import { type LegalSection } from "@/lib/models/legal";

// English mirror of notice.fr.ts: same sections, same order, same anchors. The passages
// added on 15 October 2026 (services, fonts and third-party names, clients, legal basis for
// clients, e-invoicing platform, data the law requires to keep) are translations awaiting
// Valentin's proofreading; see docs/features/legal-pages.md.

export const sections: LegalSection[] = [
  {
    id: "sec-01",
    number: "01",
    title: "Publisher",
    blocks: [
      {
        type: "p",
        text: "This website is published by Valentin Bourreau, sole proprietor (entrepreneur individuel, EI), trading as valentinbourreau. Business: freelance software development and front-end engineering.",
      },
      {
        type: "identity",
        rows: [
          { key: "siren", value: "130\u202f933\u202f922" },
          { key: "siret (head office)", value: "130\u202f933\u202f922\u202f00010" },
          { key: "ape code", value: "62.02A, IT systems and software consulting" },
          { key: "vat", value: "not applicable, article 293\u00a0B of the French tax code (CGI)" },
          { key: "address", value: "520 route de Voivres, 72210 Fillé, France" },
          { key: "publication", value: "Valentin Bourreau, publication director" },
          {
            key: "contact",
            value: "[contact@valentinbourreau.com](mailto:contact@valentinbourreau.com)",
          },
        ],
      },
    ],
  },
  {
    id: "sec-02",
    number: "02",
    title: "Hosting",
    blocks: [
      {
        type: "p",
        text: "The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com).",
      },
    ],
  },
  {
    id: "sec-03",
    number: "03",
    title: "Services",
    blocks: [
      {
        type: "p",
        text: "Valentin Bourreau’s services are reserved for businesses and governed by his [general terms of service](/en/cgv/) (in French), attached to every quote. This notice applies to the website only.",
      },
    ],
  },
  {
    id: "sec-04",
    number: "04",
    title: "Intellectual property",
    blocks: [
      {
        type: "p",
        text: "The texts, the portrait and the source code are the work of Valentin Bourreau. All rights reserved.",
      },
      {
        type: "p",
        text: "The Geist and Geist Mono fonts are distributed by Vercel under the SIL Open Font License 1.1. The logos and names of clients or technologies mentioned belong to their respective owners.",
      },
    ],
  },
  {
    id: "sec-05",
    number: "05",
    title: "Personal data",
    blocks: [
      {
        type: "p",
        text: "This site has no account and no advertising. Valentin Bourreau is the controller of the processing described below.",
      },
      {
        type: "processing",
        items: [
          {
            title: "Contact form",
            retention: "3 years after the last exchange",
            text: "When you send a request, the site stores what you entered: your need, the preferred start, your message, your name, your email address, your company if you give it, the language of the page and, when it is known, the site you came from (its domain name, or the origin given in the link you followed). As we talk, follow-up notes may be added: status of the request, estimated amount, date to get back to you. This data is used only to reply to you and to follow up on your request. It is kept for at most three years after our last exchange, then deleted. You can ask for its deletion at any time.",
          },
          {
            title: "Clients",
            retention: "quotes, invoices: 10 years · follow-up: 3 years",
            text: "If your request leads to a quote, the data of your company and of your contacts (company name, SIREN number, address, name, email, job title) are used to draw up quotes and invoices, to carry out the service and to keep the accounts. Quotes and invoices are kept for ten years from the end of the financial year, as the French Commercial Code requires. Other follow-up data follow the rule of three years after our last exchange.",
          },
          {
            title: "Bot protection",
            retention: "nothing stored",
            text: "When the form is sent, Vercel BotID analyses technical signals from your browser to tell a person from a bot. None of these signals is stored with your request.",
          },
          {
            title: "Audience measurement",
            retention: "request hash: 24\u00a0h · anonymous totals: no limit",
            text: "Vercel Web Analytics counts page views, to know how the site is used. According to Vercel, it sets no cookie, recognises a visit through a hash of the incoming request that is discarded after 24 hours, and records with each page view the page, the referring site, the country and region, the browser, the operating system and the type of device. Every day, the site copies anonymous totals to its database (number of visits and page views per day, per page, per referring site, per country and per type of device) and keeps them with no time limit. These totals cannot identify anyone.",
          },
          {
            title: "Form usage",
            retention: "anonymous counters",
            text: "The site counts, per day, how many times the contact form is opened, how many times each step is reached and how many messages are sent. These are plain counters: no identifier, no IP address and nothing you typed is attached to them, and they cannot identify anyone.",
          },
          {
            title: "Hosting",
            retention: "period set by Vercel",
            text: "Like any host, Vercel processes the IP address and the technical data of each request to deliver the pages and to protect the service, for the period it sets.",
          },
          {
            title: "Email",
            retention: "replies only",
            text: "If you write to the contact address, your message and your address are used only to reply to you.",
          },
        ],
      },
      {
        type: "p",
        text: "**Legal basis.** For the form: steps taken at your request before a possible contract. For clients: the performance of the contract and legal accounting and tax obligations. For the rest: the legitimate interest in running the site, keeping it secure and knowing its audience.",
      },
      {
        type: "p",
        text: "**Recipients and transfers.** Vercel Inc. (hosting, audience measurement, bot protection) and Neon Inc. (the database where requests are stored) act as processors. They are established in the United States, so data may be processed outside the European Union, under the safeguards set out in their data processing agreements. Invoices go through the approved e-invoicing platform [[to be completed]] and may be passed on to the tax authorities, as the law requires. Nobody but Valentin Bourreau reads the requests.",
      },
    ],
  },
  {
    id: "sec-06",
    number: "06",
    title: "Cookies and local storage",
    blocks: [
      {
        type: "p",
        text: "The site keeps in your browser, and only when you act: the language you chose (a cookie named `NEXT_LOCALE`, kept for one year), the light or dark theme (local storage) and, after you send the form, the date it was sent (local storage), to confirm that your message has gone. A post protected by a password sets, once the right password is entered, a cookie named `post_access_` followed by the name of the post, kept for 30 days: it only proves that this browser may read that post, and is strictly necessary to open it. None of this is used to track you or needs consent.",
      },
    ],
  },
  {
    id: "sec-07",
    number: "07",
    title: "Your rights",
    blocks: [
      {
        type: "p",
        text: "Under the GDPR, you can ask to access, correct or delete your data, or object to their processing, by writing to [contact@valentinbourreau.com](mailto:contact@valentinbourreau.com). Data the law requires to be kept, such as invoices, cannot be deleted before the end of their legal retention period.",
      },
      {
        type: "p",
        text: "You can also lodge a complaint with the French data protection authority, the CNIL (cnil.fr).",
      },
    ],
  },
];
