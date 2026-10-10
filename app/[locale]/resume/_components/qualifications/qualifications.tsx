import SectionComponent from '@/components/section/section';
import QualificationComponent from '../qualification/qualification';
import { QualificationsComponentProps } from './qualifications.model';
import { getDictionary } from '@/lib/i18n/dictionaries';

const QualificationsComponent = async ({ qualifications }: QualificationsComponentProps) => {
    const { qualifications: texts } = await getDictionary();

    return (
        <SectionComponent title={texts.title}>
            <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-8 self-stretch">
                {qualifications.map((qualification, index) => (
                    <QualificationComponent key={index} qualification={qualification} />
                ))}
            </div>
        </SectionComponent>
    );
};

export default QualificationsComponent;
