import SectionComponent from "@/components/section/section";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type ExperiencesComponentProps } from "./experiences.model";
import ExperienceComponent from "../experience/experience";

const ExperiencesComponent = async ({ experiences }: ExperiencesComponentProps) => {
  const { experiences: texts } = await getDictionary();

  return (
    <SectionComponent title={texts.title}>
      <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-10 self-stretch">
        {experiences.map((experience) => (
          <ExperienceComponent key={experience.company.id} experience={experience} />
        ))}
      </div>
    </SectionComponent>
  );
};

export default ExperiencesComponent;
