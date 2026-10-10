import type { Metadata } from 'next';
import { COMPANIES } from '@/lib/constants/companies';
import { MAIL_ADDRESS } from '@/lib/constants/mail-address';
import { AVATAR_PATH } from '@/lib/constants/site';
import { SOCIAL_NETWORKS } from '@/lib/constants/social-network';
import { getPageMetadata } from '@/lib/helpers/metadata';
import { getDictionary } from '@/lib/i18n/dictionaries';
import JsonLdProfilePageComponent from '@/components/jsonld/profil-page/profil-page';
import JsonLdPortfolioComponent from '@/components/jsonld/portfolio/portfolio';
import CoverComponent from '@/components/cover/cover';
import { CoverAlignment } from '@/components/cover/cover.model';
import AppearComponent from '@/components/appear/appear';
import CompaniesComponent from '@/components/companies/companies';
import ExpertisesComponent from '@/components/expertises/expertises';
import PersonalProjectsComponent from '@/components/personal-projects/personal-projects';

export const generateMetadata = (): Promise<Metadata> => getPageMetadata('home');

export default async function HomePage() {
    const { home } = await getDictionary();

    return (
        <main>
            <JsonLdProfilePageComponent />
            <JsonLdPortfolioComponent />
            <CoverComponent
                ontitle={home.ontitle}
                title={home.title}
                description={home.summary}
                avatar={AVATAR_PATH}
                action={{
                    label: home.cta,
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
}
