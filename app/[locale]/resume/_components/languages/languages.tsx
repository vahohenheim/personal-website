import LanguageComponent from '../language/language';
import { LanguageUser } from '@/lib/models/language';
import SectionComponent from '@/components/section/section';
import { getDictionary } from '@/lib/i18n/dictionaries';

const LanguagesComponent = async ({ languages }: { languages: Array<LanguageUser> }) => {
    const { languages: texts } = await getDictionary();

    return (
        <SectionComponent title={texts.title}>
            <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-4 self-stretch">
                {languages.map((language, index) => (
                    <LanguageComponent key={index} language={language} />
                ))}
            </div>
        </SectionComponent>
    );
};

export default LanguagesComponent;
