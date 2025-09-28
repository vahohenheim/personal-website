import { ExperiencesComponentProps } from "./experiences.model";
import ExperienceComponent from "../experience/experience";
import { getScopedI18n } from "../../../../../locales/server";
import SectionComponent from "@/components/section/section";

const ExperiencesComponent = async ({
  lang,
  experiences
}: ExperiencesComponentProps) => {
  const scopedT = await getScopedI18n('experiences');

  return (
    <SectionComponent
      title={scopedT('title')}>
      <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-10 self-stretch">
        {experiences.map((experience, index) => <ExperienceComponent key={index} experience={experience} lang={lang} />)}
      </div>
    </SectionComponent>
  );
};

export default ExperiencesComponent;
