import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import { EXPERTISES } from "@/lib/constants/resume";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { Expertise } from "../expertise/expertise";
import SectionComponent from "../section/section";

const ExpertisesComponent = async ({ hasLinkToResume = true }: { hasLinkToResume?: boolean }) => {
  const locale = await getLocale();
  const { expertises } = await getDictionary();

  return (
    <SectionComponent>
      <div className="grid grid-cols-3 gap-9 max-md:grid-cols-1">
        {EXPERTISES.map((expertise) => (
          <Expertise key={expertise.id} expertise={expertise} />
        ))}
      </div>
      {hasLinkToResume && (
        <div className="flex flex-col items-center justify-center pt-10">
          <Button asChild>
            <Link href={`/${locale}/resume/`}>{expertises.cta}</Link>
          </Button>
        </div>
      )}
    </SectionComponent>
  );
};

export default ExpertisesComponent;
