
import ExperiencesComponent from './components/experiences/experiences';
import { EXPERIENCES } from '../../constants/experiences';
import QualificationsComponent from './components/qualifications/qualifications';
import LanguagesComponent from './components/languages/languages';
import { USER_LANGUAGES } from '../../constants/languages';
import { getScopedI18n } from '@/locales/server';
import { Metadata } from 'next';
import { QUALIFICATIONS } from '../../constants/qualifications';
import { MetadataHelpers } from '../../helpers/metadata';
import { setStaticParamsLocale } from 'next-international/server';
import JsonLdProfilePageComponent from '@/components/jsonld/profil-page/profil-page';
import Cover from '@/components/cover/cover';
import { CoverAlignment } from '@/components/cover/cover.model';
import AppearComponent from '@/components/appear/appear';
import ExpertisesComponent from '@/components/expertises/expertises';

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en' | 'fr' }> }): Promise<Metadata> {
    const locale = (await params).locale || 'en';
    setStaticParamsLocale(locale);
    return await MetadataHelpers.translateResume(locale);
}

const ResumePage = async ({ params }: { params: Promise<{ locale: 'en' | 'fr' }> }) => {
    const locale = (await params).locale;
    setStaticParamsLocale(locale);
    const scopedT = await getScopedI18n('resume');

    return (
        <main>
            <JsonLdProfilePageComponent />
            <Cover
                title={scopedT('title')}
                description={scopedT('summary')}
                avatar="https://avatars.githubusercontent.com/u/15048034?s=400&u=496078e2a68aaa3ea7e53c8eb2de313bed528b65&v=4"
                action={{
                    label: scopedT('cta'),
                    link: '/',
                    variant: 'default'
                }}
                alignment={CoverAlignment.LEFT}
            />
            <AppearComponent delay={0.3}>
                <ExpertisesComponent hasLinkToResume={false} />
            </AppearComponent>
            <ExperiencesComponent experiences={EXPERIENCES} lang={locale} />
            <QualificationsComponent qualifications={QUALIFICATIONS} />
            <LanguagesComponent languages={USER_LANGUAGES} />
        </main>
    );
};

export default ResumePage;
