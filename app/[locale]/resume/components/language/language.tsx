import { LanguageUser } from '@/app/models/language';
import { getScopedI18n } from '@/locales/server';
import { LANGUAGES } from '@/app/constants/languages';

const LanguageComponent = async ({ language }: { language: LanguageUser }) => {
    const laguageScopedT = await getScopedI18n(`languages.list.${language.id}`);
    const laguageLevelSscopedT = await getScopedI18n(`languages.level.${language.level}`);

    return (
        <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-4 self-stretch rounded-lg">
            <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-2 self-stretch">
                <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-0.5 self-stretch">
                    <p className="text-2xl font-bold">
                        {LANGUAGES[language.id].icon} {laguageScopedT('name')}
                    </p>
                    <p className="text-secondary-foreground">{laguageLevelSscopedT('name')}</p>
                </div>
            </div>
        </div>
    );
};

export default LanguageComponent;
