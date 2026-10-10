import type { Metadata } from "next";
import AppearComponent from "@/components/appear/appear";
import CoverComponent from "@/components/cover/cover";
import { CoverAlignment } from "@/components/cover/cover.model";
import ExpertisesComponent from "@/components/expertises/expertises";
import JsonLdComponent from "@/components/json-ld/json-ld";
import { EXPERIENCES } from "@/lib/constants/experiences";
import { USER_LANGUAGES } from "@/lib/constants/languages";
import { QUALIFICATIONS } from "@/lib/constants/qualifications";
import { AVATAR_PATH } from "@/lib/constants/site";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import ExperiencesComponent from "./_components/experiences/experiences";
import LanguagesComponent from "./_components/languages/languages";
import QualificationsComponent from "./_components/qualifications/qualifications";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("resume");

export default async function ResumePage() {
  const locale = await getLocale();
  const { resume } = await getDictionary();

  return (
    <main>
      <JsonLdComponent page="resume" />
      <CoverComponent
        title={resume.title}
        description={resume.summary}
        avatar={AVATAR_PATH}
        action={{
          label: resume.cta,
          link: `/${locale}/`,
          variant: "default",
        }}
        alignment={CoverAlignment.LEFT}
      />
      <AppearComponent delay={0.3}>
        <ExpertisesComponent hasLinkToResume={false} />
      </AppearComponent>
      <ExperiencesComponent experiences={EXPERIENCES} />
      <QualificationsComponent qualifications={QUALIFICATIONS} />
      <LanguagesComponent languages={USER_LANGUAGES} />
    </main>
  );
}
