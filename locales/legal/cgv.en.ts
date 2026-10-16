import { type TermsDocument } from "@/lib/models/legal";

// The general terms of service, version 1.1, in English: a translation of the French
// original (cgv.fr.ts), which prevails (article 20). Word for word from
// docs/legal-handoff/content/cgv.en.md, the single source lotus reuses for English quotes,
// with non-breaking spaces between numbers and units, narrow ones in the SIREN and SIRET, and
// the internal references turned into links. Same sections, subsections and anchors as the
// French text; a test compares both with their source (tests/unit/legal-content.test.ts).

export const cgv: TermsDocument = {
  identity: [
    { key: "provider", value: "Valentin Bourreau, sole proprietor (entrepreneur individuel, EI)" },
    { key: "trading as", value: "valentinbourreau" },
    { key: "siren", value: "130\u202f933\u202f922" },
    { key: "siret", value: "130\u202f933\u202f922\u202f00010" },
    { key: "ape code", value: "62.02A" },
    { key: "address", value: "520 route de Voivres, 72210 Fillé, France" },
    {
      key: "contact",
      value: "[contact@valentinbourreau.com](mailto:contact@valentinbourreau.com)",
    },
  ],
  designation: "Hereinafter “the Provider”.",
  toc: {
    label: "contents",
    summary: "contents · {count} articles",
    navLabel: "Contents of the terms",
  },
  anchor: "Link to article {n}",
  sections: [
    {
      id: "art-01",
      number: "01",
      title: "Purpose and scope",
      blocks: [
        {
          type: "p",
          text: "These general terms of service (the “Terms”) govern the software development, front-end engineering, website and web application creation, maintenance, consulting, audit and technical support services provided by the Provider.",
        },
        {
          type: "p",
          text: "They are intended exclusively for professional customers (the “Client”) and apply to every order, unless otherwise agreed in a document signed by both parties.",
        },
        {
          type: "p",
          text: "Placing an order constitutes acceptance of the Terms. The Client’s general terms of purchase apply only if the Provider has accepted them in writing.",
        },
      ],
    },
    {
      id: "art-02",
      number: "02",
      title: "Contractual documents",
      blocks: [
        {
          type: "p",
          text: "The contract consists of the following documents, in decreasing order of precedence:",
        },
        {
          type: "ol",
          items: [
            "the quote signed by the Client and any amendments to it;",
            "these Terms, in the version attached to or referred to in the quote;",
            "where applicable, a data processing agreement ([article 14](#art-14)).",
          ],
        },
        {
          type: "p",
          text: "In the event of any inconsistency, the higher-ranking document prevails.",
        },
      ],
    },
    {
      id: "art-03",
      number: "03",
      title: "Quotes and orders",
      blocks: [
        {
          type: "p",
          text: "Each service is the subject of a quote setting out its scope, its delivery model (fixed price or time and materials), its price, its provisional schedule and its payment terms.",
        },
        {
          type: "p",
          text: "A quote is valid for 30\u00a0days from its date of issue, unless stated otherwise.",
        },
        {
          type: "p",
          text: "An order becomes binding upon receipt of the signed quote, bearing the words “Bon pour accord” (approved) and the acceptance of the Terms, and, where provided for, upon payment of the deposit. The Provider begins work on that date.",
        },
      ],
    },
    {
      id: "art-04",
      number: "04",
      title: "Delivery models",
      blocks: [
        {
          type: "subsection",
          id: "art-04-1",
          number: "4.1",
          title: "Fixed price",
          blocks: [
            {
              type: "p",
              text: "The Provider undertakes to deliver the items described in the quote, for a price set in advance. Any request outside the agreed scope is subject to an additional quote or an amendment ([article 7](#art-07)).",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-04-2",
          number: "4.2",
          title: "Time and materials",
          blocks: [
            {
              type: "p",
              text: "The Provider makes its skills available to the Client for an estimated number of days, invoiced on the basis of the time actually spent, at the daily rate stated in the quote. One day corresponds to 7\u00a0hours of actual work and may be split into half-days. The Provider keeps a record of the days worked, which is sent with each invoice.",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-04-3",
          number: "4.3",
          title: "Independence",
          blocks: [
            {
              type: "p",
              text: "The Provider acts with full independence. It freely organises its work, its working hours and its place of performance, including remotely and from abroad, and is not subject to any relationship of subordination to the Client. Meetings and milestones are set by mutual agreement.",
            },
            {
              type: "p",
              text: "The Provider is bound by an obligation of means (obligation de moyens).",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-04-4",
          number: "4.4",
          title: "Monthly maintenance",
          blocks: [
            {
              type: "p",
              text: "Monthly maintenance is a fixed-price subscription whose content is set out in the quote: hosting, updates, included intervention time. It starts on the date set in the quote, for a term of one month, and is then tacitly renewed from month to month.",
            },
            {
              type: "p",
              text: "Either party may terminate it in writing, with 30\u00a0days’ notice. The current month remains payable. Included intervention time not used in a month is not carried over; beyond it, work is quoted or invoiced at the daily rate stated in the quote.",
            },
            {
              type: "p",
              text: "The Provider may revise the price once a year, by giving written notice at least 30\u00a0days before the effective date. The Client may then terminate the maintenance before that date, without notice.",
            },
            {
              type: "p",
              text: "When the maintenance includes hosting, the website or application remains deployed on the Provider’s accounts for its whole term. The domain name is registered in the Client’s name. The Provider does not guarantee an availability higher than that of the chosen host. At the end of the maintenance, or at any time on the Client’s written request, the Provider transfers the code, the accounts and the deployment to the Client within a reasonable time.",
            },
          ],
        },
      ],
    },
    {
      id: "art-05",
      number: "05",
      title: "Client obligations",
      blocks: [
        {
          type: "p",
          text: "The Client undertakes to:",
        },
        {
          type: "ul",
          items: [
            "provide in good time the information, content, designs, access and environments required;",
            "appoint a contact person with decision-making authority;",
            "respond to requests for approval within the agreed time limits;",
            "hold the rights to the content and materials it provides, and indemnify the Provider against any claim in that respect.",
          ],
        },
        {
          type: "p",
          text: "Any delay attributable to the Client postpones the schedule accordingly, without the Provider incurring any liability.",
        },
      ],
    },
    {
      id: "art-06",
      number: "06",
      title: "Delivery and acceptance",
      blocks: [
        {
          type: "p",
          text: "For fixed-price services, the Provider notifies the Client of each delivery. The Client then has 10\u00a0working days to report in writing any defects found with respect to the quote.",
        },
        {
          type: "p",
          text: "The Provider corrects any confirmed defects within a reasonable time, then submits a new delivery under the same procedure.",
        },
        {
          type: "p",
          text: "Acceptance is deemed given on the earliest of the following dates: the Client’s written approval, the expiry of the 10-working-day period without written reservations, or the putting into production of the deliverables by the Client.",
        },
        {
          type: "p",
          text: "For a website or an application, the quote states the number of feedback rounds included. A feedback round gathers, in a single written message, the Client’s change requests on one delivery. Additional rounds and requests outside the scope fall under [article 7](#art-07).",
        },
      ],
    },
    {
      id: "art-07",
      number: "07",
      title: "Changes to the scope",
      blocks: [
        {
          type: "p",
          text: "Any change to the scope, the schedule or the deliverables requested by the Client is subject to an additional quote or an amendment, accepted in writing before it is carried out.",
        },
      ],
    },
    {
      id: "art-08",
      number: "08",
      title: "Prices",
      blocks: [
        {
          type: "p",
          text: "Prices are stated in euros, exclusive of tax. VAT not applicable, article 293\u00a0B of the French General Tax Code (CGI), for as long as the Provider benefits from the VAT franchise scheme (franchise en base). If that scheme ends, VAT at the applicable rate is added to the prices from that date.",
        },
        {
          type: "p",
          text: "Travel and accommodation expenses and third-party licences or services are not included, unless stated in the quote. They are recharged at cost, subject to the Client’s prior approval.",
        },
      ],
    },
    {
      id: "art-09",
      number: "09",
      title: "Invoicing and payment",
      blocks: [
        {
          type: "p",
          text: "Unless otherwise stated in the quote:",
        },
        {
          type: "ul",
          items: [
            "**fixed price**: a 30% deposit on order, the balance on acceptance; for projects lasting more than two months, interim invoices follow the milestones set out in the quote;",
            "**time and materials**: monthly invoicing, at the end of each month, of the days actually worked;",
            "**monthly maintenance**: monthly invoicing, at the start of each month.",
          ],
        },
        {
          type: "p",
          text: "Invoices are payable within 30\u00a0days of their date of issue, by bank transfer to the account stated on the invoice. No discount is granted for early payment.",
        },
      ],
    },
    {
      id: "art-10",
      number: "10",
      title: "Late payment",
      blocks: [
        {
          type: "p",
          text: "Any late payment automatically gives rise, without prior reminder, to:",
        },
        {
          type: "ul",
          items: [
            "late payment penalties calculated at the rate applied by the European Central Bank to its most recent refinancing operation, plus 10\u00a0percentage points, from the day following the due date;",
            "a fixed indemnity of €40 for recovery costs (articles L441-10 and D441-5 of the French Commercial Code), without prejudice to additional compensation upon presentation of supporting documents.",
          ],
        },
        {
          type: "p",
          text: "Late payment of any invoice makes all sums due under the contract immediately payable.",
        },
      ],
    },
    {
      id: "art-11",
      number: "11",
      title: "Suspension",
      blocks: [
        {
          type: "p",
          text: "If an invoice remains unpaid on its due date, the Provider sends the Client a formal notice in writing (registered letter or email with acknowledgement of receipt).",
        },
        {
          type: "p",
          text: "If the formal notice remains without effect for 15\u00a0days, the Provider may, without any compensation being due to the Client:",
        },
        {
          type: "ul",
          items: [
            "suspend the performance of all its ongoing services;",
            "withdraw the provisional licence of use provided for in [article 12.2](#art-12-2);",
            "interrupt access to the environments, code repositories and deployments it operates under its own accounts.",
          ],
        },
        {
          type: "p",
          text: "Suspension never affects the Client’s data, which remains intact. Services resume within a reasonable time after full payment of the sums due, including penalties. The schedule is postponed by the duration of the suspension.",
        },
      ],
      emphasis: true,
    },
    {
      id: "art-12",
      number: "12",
      title: "Intellectual property",
      blocks: [
        {
          type: "subsection",
          id: "art-12-1",
          number: "12.1",
          title: "Assignment of rights",
          blocks: [
            {
              type: "p",
              text: "Subject to full payment of the price, the Provider assigns to the Client, on an exclusive basis, the economic rights of copyright in the deliverables specifically created for it and identified in the quote: the rights of reproduction, representation, adaptation, modification, translation and distribution, on any medium, worldwide and for the entire legal term of protection, for the purposes of exploitation described in the quote.",
            },
            {
              type: "p",
              text: "The price of this assignment is included in the price of the service.",
            },
            {
              type: "p",
              text: "The assignment takes effect on the date of full payment. The code repositories, accounts and deployments operated by the Provider are then transferred to the Client, except during a monthly maintenance that includes hosting, where the transfer follows [article 4.4](#art-04-4).",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-2",
          number: "12.2",
          title: "Before full payment",
          blocks: [
            {
              type: "p",
              text: "Until full payment, the Client holds a non-exclusive, non-transferable and revocable licence to use the deliverables, limited to the needs of acceptance and of the exploitation provided for in the quote. This licence may be withdrawn under the conditions of [article 11](#art-11).",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-3",
          number: "12.3",
          title: "Pre-existing materials and generic tools",
          blocks: [
            {
              type: "p",
              text: "The Provider retains ownership of the materials it created independently of the engagement or that are not specific to the Client: components, libraries, utilities, configurations, code templates, methods and know-how. Where they are incorporated into the deliverables, the Provider grants the Client, from full payment, a non-exclusive, royalty-free, worldwide licence for the duration of the rights, limited to the exploitation of the deliverables. The Provider remains free to reuse them.",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-4",
          number: "12.4",
          title: "Open-source software and third-party services",
          blocks: [
            {
              type: "p",
              text: "The open-source components and third-party services incorporated into the deliverables remain subject to their own licences and terms, which the Client undertakes to comply with.",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-5",
          number: "12.5",
          title: "References",
          blocks: [
            {
              type: "p",
              text: "Unless the Client objects in writing or a confidentiality undertaking applies, the Provider may mention the Client’s name and logo, and present the work carried out as a reference, once that work has been made public.",
            },
          ],
        },
      ],
      emphasis: true,
    },
    {
      id: "art-13",
      number: "13",
      title: "Confidentiality",
      blocks: [
        {
          type: "p",
          text: "Each party keeps confidential the non-public information disclosed by the other party in connection with the contract, and uses it solely for the performance of the contract. This obligation applies for the term of the contract and for three years after it ends.",
        },
      ],
    },
    {
      id: "art-14",
      number: "14",
      title: "Personal data",
      blocks: [
        {
          type: "p",
          text: "Where performing the service leads the Provider to process personal data on the Client’s behalf, it acts as a processor within the meaning of article 28 of the GDPR: it processes such data only on the Client’s documented instructions, ensures its security and confidentiality, and deletes or returns it at the end of the engagement. Where necessary, the parties enter into a data processing agreement.",
        },
        {
          type: "p",
          text: "The data of the Client and of its contacts collected by the Provider to manage the business relationship is processed in accordance with the policy described in the [legal notice of valentinbourreau.com](/en/legal/#sec-05).",
        },
      ],
    },
    {
      id: "art-15",
      number: "15",
      title: "Liability",
      blocks: [
        {
          type: "p",
          text: "The Provider is bound by an obligation of means. Its liability may be incurred only in the event of proven fault.",
        },
        {
          type: "p",
          text: "The Provider is not liable for:",
        },
        {
          type: "ul",
          items: [
            "indirect damage, such as loss of revenue, customers, data or reputation;",
            "malfunctions caused by content, infrastructure, hosting or third-party services chosen or provided by the Client;",
            "changes made to the deliverables by the Client or by a third party.",
          ],
        },
        {
          type: "p",
          text: "The Client remains responsible for backing up its data and its environments.",
        },
        {
          type: "p",
          text: "In any event, the total liability of the Provider is limited to the amount, exclusive of tax, actually paid by the Client under the quote concerned over the previous twelve months.",
        },
      ],
    },
    {
      id: "art-16",
      number: "16",
      title: "Force majeure",
      blocks: [
        {
          type: "p",
          text: "Neither party is liable for any failure caused by an event of force majeure within the meaning of article 1218 of the French Civil Code. The obligations concerned are suspended for its duration. If the force majeure event lasts more than 30\u00a0days, either party may terminate the contract in writing, the services already performed remaining payable.",
        },
      ],
    },
    {
      id: "art-17",
      number: "17",
      title: "Term and termination",
      blocks: [
        {
          type: "p",
          text: "The contract ends upon completion of the services provided for in the quote.",
        },
        {
          type: "ul",
          items: [
            "**Time and materials**: either party may terminate it in writing, with 15\u00a0days’ notice. The days worked until the end of the notice period are payable.",
            "**Fixed price**: if the Client terminates the contract before its term, it pays for the work carried out up to the date of termination, pro rata to the quote. The deposit remains with the Provider.",
            "**Monthly maintenance**: either party may terminate it under [article 4.4](#art-04-4).",
            "**Serious breach**: if a breach by a party is not remedied 30\u00a0days after formal notice, the other party may terminate the contract in writing, without prejudice to any damages.",
          ],
        },
        {
          type: "p",
          text: "Articles [10](#art-10), [12](#art-12), [13](#art-13) and [15](#art-15) survive the end of the contract.",
        },
      ],
    },
    {
      id: "art-18",
      number: "18",
      title: "Subcontracting",
      blocks: [
        {
          type: "p",
          text: "The Provider may use a subcontractor, with the Client’s written consent. It then remains responsible for the proper performance of the services.",
        },
      ],
    },
    {
      id: "art-19",
      number: "19",
      title: "Governing law and disputes",
      blocks: [
        {
          type: "p",
          text: "The contract is governed by French law.",
        },
        {
          type: "p",
          text: "In the event of a dispute, the parties first seek an amicable solution, for 30\u00a0days from the written notification of the dispute.",
        },
        {
          type: "p",
          text: "Failing agreement, and to the extent permitted by law, the dispute is brought before the competent courts within the jurisdiction of the Court of Appeal of Angers.",
        },
      ],
    },
    {
      id: "art-20",
      number: "20",
      title: "General provisions",
      blocks: [
        {
          type: "p",
          text: "If any clause is held to be void, the other clauses remain in force. A party’s failure to invoke a clause does not constitute a waiver of its right to invoke it later.",
        },
        {
          type: "p",
          text: "The Terms are drafted in French. In the event of a translation, the French version prevails.",
        },
        {
          type: "p",
          text: "The Provider may amend the Terms. The applicable version is the one attached to or referred to in the signed quote.",
        },
      ],
    },
  ],
};
