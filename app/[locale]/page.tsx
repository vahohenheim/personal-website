import type { Metadata } from "next";
import AppearComponent from "@/components/appear/appear";
import CompaniesComponent from "@/components/companies/companies";
import CoverComponent from "@/components/cover/cover";
import { CoverAlignment } from "@/components/cover/cover.model";
import ExpertisesComponent from "@/components/expertises/expertises";
import JsonLdComponent from "@/components/json-ld/json-ld";
import PersonalProjectsComponent from "@/components/personal-projects/personal-projects";
import { COMPANIES } from "@/lib/constants/companies";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { AVATAR_PATH } from "@/lib/constants/site";
import { SOCIAL_NETWORKS } from "@/lib/constants/social-network";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("home");

export default async function HomePage() {
  const { home } = await getDictionary();

  return (
    <main>
      <JsonLdComponent page="home" />
      <CoverComponent
        ontitle={home.ontitle}
        title={home.title}
        description={home.summary}
        avatar={AVATAR_PATH}
        action={{
          label: home.cta,
          link: `mailto:${MAIL_ADDRESS}`,
          variant: "default",
        }}
        socialNetworks={SOCIAL_NETWORKS}
        alignment={CoverAlignment.CENTER}
      />
      <AppearComponent onScroll>
        <CompaniesComponent companies={Object.values(COMPANIES)} />
      </AppearComponent>
      <AppearComponent onScroll>
        <ExpertisesComponent />
      </AppearComponent>
      <AppearComponent onScroll>
        <PersonalProjectsComponent />
      </AppearComponent>
    </main>
  );
}
