import SectionComponent from '../section/section';
import PersonalProjectComponent from '../personal-project/personal-project';
import { getScopedI18n } from '@/locales/server';
import { PERSONAL_PROJECTS } from '@/app/constants/personal-projects';

const PersonalProjectsComponent = async () => {
    const scopedT = await getScopedI18n('personal-projects');
    return (
        <SectionComponent title={scopedT('title')}>
            <div className="grid grid-cols-1 items-stretch justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                {PERSONAL_PROJECTS.map((project) => (
                    <PersonalProjectComponent key={project.id} project={project} />
                ))}
            </div>
        </SectionComponent>
    );
};

export default PersonalProjectsComponent;
