import type {
  Blog,
  BlogPosting,
  BreadcrumbList,
  EducationalOccupationalCredential,
  EducationalOrganization,
  Graph,
  ImageObject,
  ItemList,
  Offer,
  OfferCatalog,
  Organization,
  Person,
  ProfilePage,
  Thing,
  WebPage,
  WebSite,
} from "schema-dts";
import { EXPERIENCES } from "@/lib/constants/experiences";
import { USER_LANGUAGES } from "@/lib/constants/languages";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { SERVICES } from "@/lib/constants/offer";
import { PAGES, type PageId } from "@/lib/constants/pages";
import { PROJECT_LINKS } from "@/lib/constants/project-links";
import { QUALIFICATIONS, SCHOOLS } from "@/lib/constants/qualifications";
import { AVATAR_SIZE, AVATAR_URL, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { SKILLS } from "@/lib/constants/skills";
import { SOCIAL_NETWORKS } from "@/lib/constants/social-network";
import { getPageTexts, getPageUrl } from "@/lib/helpers/metadata";
import { getPostImageUrl, getPosts, getPostUrl, toIsoDuration } from "@/lib/helpers/posts";
import { type Locale } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/dictionaries";
import { type Company } from "@/lib/models/company";
import { type Experience } from "@/lib/models/experience";
import { type Price } from "@/lib/models/offer";
import { type LocalizedPost, type PostProject } from "@/lib/models/post";
import { type School } from "@/lib/models/school";
import { getPostOutline } from "@/lib/posts/source";
import en, { type Dictionary } from "@/locales/en";
import fr from "@/locales/fr";

type Context = { locale: Locale; dictionary: Dictionary };

// Read directly rather than through the request, so that the graph of any page in any
// language can be built, and tested, outside a request.
const DICTIONARIES: Record<Locale, Dictionary> = { en, fr };

const getContext = (locale: Locale): Context => ({ locale, dictionary: DICTIONARIES[locale] });

/** Size of the generated sharing images (opengraph-image.tsx). */
const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

// Every page describes the same person and the same site: nodes are linked by these ids.
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const [GIVEN_NAME, FAMILY_NAME] = SITE_NAME.split(" ");

const getOrganization = (company: Company, { dictionary }: Context): Organization => ({
  "@type": "Organization",
  name: dictionary.companies.list[company.id].name,
  url: company.url,
  address: company.location,
});

const getSchool = (school: School, { dictionary }: Context): EducationalOrganization => ({
  "@type": "EducationalOrganization",
  name: dictionary.schools.list[school.id].name,
  address: school.location,
});

/** One role per mission, with the dates of the mission or, failing that, of the experience. */
const getRoles = (experience: Experience, context: Context) =>
  experience.missions.map((mission) => {
    const endDate = mission.endDate ?? experience.endDate;

    return {
      roleName: mission.roles.map((role) => context.dictionary.roles[role]).join(" & "),
      startDate: mission.startDate ?? experience.startDate,
      ...(endDate !== "today" && { endDate }),
      organization: getOrganization(experience.company, context),
    };
  });

const getCredentials = (context: Context): EducationalOccupationalCredential[] =>
  QUALIFICATIONS.map((qualification) => ({
    "@type": "EducationalOccupationalCredential",
    name: context.dictionary.qualifications.list[qualification.id].label,
    credentialCategory: context.dictionary.qualifications.level[qualification.level].name,
    dateCreated: qualification.obtainDate,
    recognizedBy: getSchool(qualification.school, context),
  }));

/**
 * The person the site is about. `summary` is enough to identify them (home page);
 * `full` adds the work history, schools and credentials (resume).
 */
const getPerson = (detail: "summary" | "full", context: Context): Person => {
  const { dictionary } = context;
  const current = EXPERIENCES.filter((experience) => experience.endDate === "today");
  const past = EXPERIENCES.filter((experience) => experience.endDate !== "today");

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    givenName: GIVEN_NAME,
    familyName: FAMILY_NAME,
    url: SITE_URL,
    image: AVATAR_URL,
    email: MAIL_ADDRESS,
    jobTitle: dictionary.person.jobTitle,
    description: dictionary.metadata.description,
    address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
    sameAs: SOCIAL_NETWORKS.map((socialNetwork) => socialNetwork.link),
    knowsAbout: [...SKILLS],
    knowsLanguage: USER_LANGUAGES.map((language) => ({
      "@type": "Language",
      name: dictionary.languages.list[language.id].name,
      alternateName: language.id,
    })),
    // Omitted while freelance: there is no current employer.
    ...(current.length > 0 && {
      worksFor: current.flatMap((experience) =>
        getRoles(experience, context).map(({ organization, ...role }) => ({
          "@type": "EmployeeRole" as const,
          ...role,
          worksFor: organization,
        })),
      ),
    }),
    ...(detail === "full" && {
      alumniOf: [
        ...past.flatMap((experience) =>
          getRoles(experience, context).map(({ organization, ...role }) => ({
            "@type": "OrganizationRole" as const,
            ...role,
            alumniOf: organization,
          })),
        ),
        ...Object.values(SCHOOLS).map((school) => getSchool(school, context)),
      ],
      hasCredential: getCredentials(context),
    }),
  };
};

/** Sets the site name in search results. Google reads it on the home page only. */
const getWebSite = ({ locale }: Context): WebSite => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  alternateName: SITE_NAME.toLowerCase().replace(" ", ""),
  url: getPageUrl("home", locale),
  inLanguage: locale,
  publisher: { "@id": PERSON_ID },
});

/**
 * The page itself. A page about the person is a `ProfilePage` whose main entity is the
 * person; any other page is a plain `WebPage`.
 */
const getWebPage = (
  page: PageId,
  type: "ProfilePage" | "WebPage",
  { locale, dictionary }: Context,
): ProfilePage | WebPage => {
  const url = getPageUrl(page, locale);
  const { title, description } = getPageTexts(page, dictionary);

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    dateCreated: PAGES[page].createdAt,
    dateModified: PAGES[page].updatedAt,
    // The home page lists the latest posts: the blog is part of it, described on its own page.
    ...(page === "home" &&
      getPosts(locale).length > 0 && { hasPart: { "@id": getBlogId(locale) } }),
    ...(type === "ProfilePage"
      ? {
          mainEntity: { "@id": PERSON_ID },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: AVATAR_URL,
            width: `${AVATAR_SIZE}`,
            height: `${AVATAR_SIZE}`,
          },
        }
      : { publisher: { "@id": PERSON_ID } }),
    ...(page !== "home" && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
  };
};

/** Trail from the home page to `page`. Google needs at least two items, so not for the home page. */
const getBreadcrumb = (
  page: Exclude<PageId, "home">,
  name: string,
  { locale, dictionary }: Context,
): BreadcrumbList => ({
  "@type": "BreadcrumbList",
  "@id": `${getPageUrl(page, locale)}#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: dictionary.breadcrumb.home,
      item: getPageUrl("home", locale),
    },
    { "@type": "ListItem", position: 2, name, item: getPageUrl(page, locale) },
  ],
});

const getPersonalProjects = ({ locale, dictionary }: Context): ItemList => {
  const { projects } = dictionary.home;
  // The cards first, then the projects only listed by name: same order as on the page.
  const items = [
    ...projects.items.map(({ id, name, text }) => ({ id, name, text })),
    ...projects.moreItems.map(({ id, name }) => ({ id, name, text: undefined })),
  ];

  return {
    "@type": "ItemList",
    "@id": `${getPageUrl("home", locale)}#projects`,
    name: projects.title,
    itemListElement: items.map((project, index) => {
      const url = PROJECT_LINKS[project.id];
      const isRepository = url?.includes("github.com") ?? false;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": isRepository ? "SoftwareSourceCode" : "CreativeWork",
          name: project.name,
          creator: { "@id": PERSON_ID },
          ...(project.text && { description: project.text }),
          ...(url && { url }),
          ...(isRepository && { codeRepository: url }),
        },
      };
    }),
  };
};

const getBlogId = (locale: Locale) => `${getPageUrl("posts", locale)}#blog`;

/** What a post is about: an application or a website of the project list. */
const getProject = (project: PostProject): Thing =>
  project.type === "WebSite"
    ? { "@type": "WebSite", name: project.name, ...(project.url && { url: project.url }) }
    : {
        "@type": project.type,
        name: project.name,
        ...(project.applicationCategory && { applicationCategory: project.applicationCategory }),
        ...(project.operatingSystem && { operatingSystem: project.operatingSystem }),
        ...(project.url && { url: project.url }),
      };

/** The cover of a post, then its generated sharing image, then the images of its body. */
const getPostImages = (post: LocalizedPost): ImageObject[] => [
  ...(post.cover
    ? [
        {
          "@type": "ImageObject" as const,
          url: `${SITE_URL}${post.cover.src}`,
          width: `${post.cover.width}`,
          height: `${post.cover.height}`,
          ...(post.coverAlt && { caption: post.coverAlt }),
        },
      ]
    : []),
  {
    "@type": "ImageObject",
    url: getPostImageUrl(post.slug, post.locale),
    width: `${SHARE_IMAGE_SIZE.width}`,
    height: `${SHARE_IMAGE_SIZE.height}`,
  },
  ...(post.images ?? []).map((image): ImageObject => ({
    "@type": "ImageObject",
    url: `${SITE_URL}${image.src}`,
    width: `${image.width}`,
    height: `${image.height}`,
  })),
];

/** A post, written by the person the site is about. `summary` is the form used in lists. */
const getBlogPosting = (
  post: LocalizedPost,
  detail: "summary" | "full",
  { dictionary }: Context,
): BlogPosting => {
  const url = getPostUrl(post.slug, post.locale);

  if (detail === "summary") {
    return {
      "@type": "BlogPosting",
      "@id": `${url}#post`,
      url,
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: post.locale,
      author: { "@id": PERSON_ID },
    };
  }

  const { words, minutes } = getPostOutline(post.slug, post.locale);

  return {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    url,
    headline: post.title,
    description: post.description,
    abstract: post.lead,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: post.locale,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": getBlogId(post.locale) },
    image: getPostImages(post),
    articleSection: dictionary.posts.section,
    keywords: post.tags.join(", "),
    wordCount: words,
    timeRequired: toIsoDuration(minutes),
    ...(post.project && { about: getProject(post.project) }),
  };
};

/** The list of posts of one language. */
const getBlog = (context: Context): Blog => {
  const { locale, dictionary } = context;

  return {
    "@type": "Blog",
    "@id": getBlogId(locale),
    url: getPageUrl("posts", locale),
    name: dictionary.posts.title,
    description: dictionary.posts.metadata.description,
    inLanguage: locale,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    blogPost: getPosts(locale).map((post) => getBlogPosting(post, "summary", context)),
  };
};

// UN/CEFACT codes of the price units, as schema.org expects them in `unitCode`.
const UNIT_CODES = { day: "DAY", month: "MON" } as const;

/** The price of an offer, excluding VAT. A price on quote has none. */
const getPriceSpecification = (price: Price): Offer["priceSpecification"] => {
  if (price.type === "quote") {
    return undefined;
  }

  return {
    "@type": "UnitPriceSpecification",
    priceCurrency: "EUR",
    valueAddedTaxIncluded: false,
    ...(price.type === "fixed"
      ? { price: price.amount }
      : { minPrice: price.min, maxPrice: price.max }),
    ...(price.unit && { unitCode: UNIT_CODES[price.unit] }),
  };
};

/**
 * The services of the services page, one offer per way to buy one (the express and the
 * full audit are two offers), each with its price as shown on the page.
 */
const getServiceCatalog = ({ locale, dictionary }: Context): OfferCatalog => {
  const { offre } = dictionary;
  const url = getPageUrl("offre", locale);

  return {
    "@type": "OfferCatalog",
    "@id": `${url}#services`,
    name: offre.sections.services.title,
    itemListElement: SERVICES.flatMap((service) => {
      const texts = offre.services[service.id];

      return service.options.map((option): Offer => {
        const priceSpecification = getPriceSpecification(option.price);

        return {
          "@type": "Offer",
          name:
            service.options.length > 1
              ? `${texts.title} · ${texts.prices[option.id] ?? option.id}`
              : texts.title,
          url: `${url}#sec-02`,
          seller: { "@id": PERSON_ID },
          itemOffered: {
            "@type": "Service",
            name: texts.title,
            description: texts.text,
            provider: { "@id": PERSON_ID },
          },
          ...(priceSpecification && { priceSpecification }),
        };
      });
    }),
  };
};

/**
 * Structured data of each page. The record is keyed by `PageId`, so adding a page
 * to `PAGES` without describing it here fails the type check.
 */
const PAGE_GRAPHS: Record<PageId, (context: Context) => Thing[]> = {
  home: (context) => [
    getWebSite(context),
    getWebPage("home", "ProfilePage", context),
    getPerson("summary", context),
    getPersonalProjects(context),
  ],
  resume: (context) => [
    getWebPage("resume", "ProfilePage", context),
    getPerson("full", context),
    getBreadcrumb("resume", context.dictionary.header.menu.resume, context),
  ],
  posts: (context) => [
    { ...getWebPage("posts", "WebPage", context), "@type": "CollectionPage" },
    getBlog(context),
    getBreadcrumb("posts", context.dictionary.posts.title, context),
  ],
  offre: (context) => [
    {
      ...getWebPage("offre", "WebPage", context),
      mainEntity: { "@id": `${getPageUrl("offre", context.locale)}#services` },
    },
    getServiceCatalog(context),
    getBreadcrumb("offre", context.dictionary.offre.title, context),
  ],
  legal: (context) => [
    getWebPage("legal", "WebPage", context),
    getBreadcrumb("legal", context.dictionary.legal.title, context),
  ],
  cgv: (context) => [
    getWebPage("cgv", "WebPage", context),
    getBreadcrumb("cgv", context.dictionary.cgv.title, context),
  ],
};

/** The graph of a page in one language. */
export const getPageGraph = (page: PageId, locale: Locale): Graph => ({
  "@context": "https://schema.org",
  "@graph": PAGE_GRAPHS[page](getContext(locale)),
});

/** The JSON-LD document of a page, in the language of the current request. */
export const getPageJsonLd = async (page: PageId): Promise<Graph> =>
  getPageGraph(page, await getLocale());

/**
 * The JSON-LD document of a post: the page, the post and the trail down to it. The same
 * for every post, so posts are not listed in `PAGES` one by one.
 */
export const getPostJsonLd = (post: LocalizedPost): Graph => {
  const context = getContext(post.locale);
  const { dictionary } = context;
  const url = getPostUrl(post.slug, post.locale);
  const trail = [
    { name: dictionary.breadcrumb.home, item: getPageUrl("home", post.locale) },
    { name: dictionary.posts.title, item: getPageUrl("posts", post.locale) },
    { name: post.title, item: url },
  ];
  const webPage: WebPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: post.title,
    description: post.description,
    inLanguage: post.locale,
    isPartOf: { "@id": WEBSITE_ID },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@id": PERSON_ID },
    mainEntity: { "@id": `${url}#post` },
    ...(post.cover && { primaryImageOfPage: getPostImages(post)[0] }),
    // schema.org defines the trail on the page, not on the post.
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
  const breadcrumb: BreadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...step,
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, getBlogPosting(post, "full", context), breadcrumb],
  };
};
