import { Metadata } from 'next';
import { COMPANIES } from '../constants/companies';
import { getScopedI18n } from '@/locales/server';
import { MetadataHelpers } from '../helpers/metadata';
import { setStaticParamsLocale } from 'next-international/server';
import { MAIL_ADDRESS } from '@/app/constants/mail-address';
import JsonLdProfilePageComponent from '@/components/jsonld/profil-page/profil-page';
import JsonLdPortfolioComponent from '@/components/jsonld/portfolio/portfolio';
import Cover from '@/components/cover/cover';
import { CoverAlignment } from '@/components/cover/cover.model';
import { SOCIAL_NETWORKS } from '../constants/social-network';
import AppearComponent from '@/components/appear/appear';
import CompaniesComponent from '@/components/companies/companies';
import ExpertisesComponent from '@/components/expertises/expertises';
import PersonalProjectsComponent from '@/components/personal-projects/personal-projects';

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en' | 'fr' }> }): Promise<Metadata> {
    const locale = (await params).locale || 'en';
    setStaticParamsLocale(locale);
    return await MetadataHelpers.translateHomepage(locale);
}

const HomePage = async ({ params }: { params: Promise<{ locale: 'en' | 'fr' }> }) => {
    const locale = (await params).locale || 'en';
    setStaticParamsLocale(locale);
    const scopedT = await getScopedI18n('home');

    return (
        <main>
            <JsonLdProfilePageComponent />
            <JsonLdPortfolioComponent />
            <Cover
                ontitle={scopedT('ontitle')}
                title={scopedT('title')}
                description={scopedT('summary')}
                avatar="https://avatars.githubusercontent.com/u/15048034?s=400&u=496078e2a68aaa3ea7e53c8eb2de313bed528b65&v=4"
                action={{
                    label: scopedT('cta'),
                    link: `mailto:${MAIL_ADDRESS}`,
                    variant: 'default'
                }}
                socialNetworks={SOCIAL_NETWORKS}
                alignment={CoverAlignment.CENTER}
            />
            <AppearComponent delay={0.4}>
                <CompaniesComponent companies={Object.values(COMPANIES)} />
            </AppearComponent>
            <AppearComponent delay={0.5}>
                <ExpertisesComponent />
            </AppearComponent>
            <AppearComponent delay={0.3}>
                <PersonalProjectsComponent />
            </AppearComponent>
        </main>
    );
};

export default HomePage;
