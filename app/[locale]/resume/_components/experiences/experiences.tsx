import { ExperiencesComponentProps } from './experiences.model';
import ExperienceComponent from '../experience/experience';
import { getDictionary } from '@/lib/i18n/dictionaries';
import SectionComponent from '@/components/section/section';

const ExperiencesComponent = async ({ experiences }: ExperiencesComponentProps) => {
    const { experiences: texts } = await getDictionary();

    return (
        <SectionComponent title={texts.title}>
            <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-10 self-stretch">
                {experiences.map((experience, index) => (
                    <ExperienceComponent key={index} experience={experience} />
                ))}
            </div>
        </SectionComponent>
    );
};

export default ExperiencesComponent;
