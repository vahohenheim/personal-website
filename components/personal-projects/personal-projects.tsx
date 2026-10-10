import { PERSONAL_PROJECTS } from "@/lib/constants/personal-projects";
import { getDictionary } from "@/lib/i18n/dictionaries";
import PersonalProjectComponent from "../personal-project/personal-project";
import SectionComponent from "../section/section";

const PersonalProjectsComponent = async () => {
  const { "personal-projects": texts } = await getDictionary();
  return (
    <SectionComponent title={texts.title}>
      <div className="grid grid-cols-1 items-stretch justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
        {PERSONAL_PROJECTS.map((project) => (
          <PersonalProjectComponent key={project.id} project={project} />
        ))}
      </div>
    </SectionComponent>
  );
};

export default PersonalProjectsComponent;
