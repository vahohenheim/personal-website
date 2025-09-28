import LanguageComponent from '../language/language';
import { LanguageUser } from '@/app/models/language';
import SectionComponent from '@/components/section/section';
import { getScopedI18n } from '@/locales/server';

const LanguagesComponent = async ({ languages }: { languages: Array<LanguageUser> }) => {
    const scopedT = await getScopedI18n(`languages`);

    return (
        <SectionComponent title={scopedT('title')}>
            <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-4 self-stretch">
                {languages.map((language, index) => (
                    <LanguageComponent key={index} language={language} />
                ))}
            </div>
        </SectionComponent>
    );
};

export default LanguagesComponent;
