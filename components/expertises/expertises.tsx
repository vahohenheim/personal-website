import { Expertise } from '../expertise/expertise';
import SectionComponent from '../section/section';
import Link from 'next/link';
import { getScopedI18n } from '@/locales/server';
import { Button } from '@/components/ui/button/button';
import { EXPERTISES } from '@/app/constants/resume';

const ExpertisesComponent = async ({ hasLinkToResume = true }: { hasLinkToResume?: boolean }) => {
    const scopedT = await getScopedI18n('expertises');

    return (
        <SectionComponent>
            <div className="grid grid-cols-3 gap-9 max-md:grid-cols-1">
                {EXPERTISES.map((expertise, index) => (
                    <Expertise key={index} expertise={expertise} />
                ))}
            </div>
            {hasLinkToResume && (
                <div className="flex flex-col items-center justify-center pt-10">
                    <Link href="/resume" scroll={true}>
                        <Button variant="default">
                            {scopedT('cta')}
                        </Button>
                    </Link>
                </div>
            )}
        </SectionComponent>
    );
};

export default ExpertisesComponent;
