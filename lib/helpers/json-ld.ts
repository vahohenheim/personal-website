import type {
  BreadcrumbList,
  EducationalOccupationalCredential,
  EducationalOrganization,
  Graph,
  ItemList,
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
import { PAGES, type PageId } from "@/lib/constants/pages";
import { PROJECT_LINKS } from "@/lib/constants/project-links";
import { QUALIFICATIONS, SCHOOLS } from "@/lib/constants/qualifications";
import { AVATAR_SIZE, AVATAR_URL, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { SKILLS } from "@/lib/constants/skills";
import { SOCIAL_NETWORKS } from "@/lib/constants/social-network";
import { getPageTexts, getPageUrl } from "@/lib/helpers/metadata";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { type Company } from "@/lib/models/company";
import { type Experience } from "@/lib/models/experience";
import { type School } from "@/lib/models/school";
import { type Dictionary } from "@/locales/en";

type Context = { locale: Locale; dictionary: Dictionary };

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
  legal: (context) => [
    getWebPage("legal", "WebPage", context),
    getBreadcrumb("legal", context.dictionary.legal.title, context),
  ],
};

/** The JSON-LD document of a page, in the language of the current request. */
export const getPageJsonLd = async (page: PageId): Promise<Graph> => {
  const context: Context = { locale: await getLocale(), dictionary: await getDictionary() };

  return {
    "@context": "https://schema.org",
    "@graph": PAGE_GRAPHS[page](context),
  };
};
