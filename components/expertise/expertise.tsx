import { ExpertiseComponentProps } from './expertise.model';
import { getScopedI18n } from '@/locales/server';
import { HeadingComponent } from '@/components/ui/heading/heading';
import { HeadingTags } from '@/components/ui/heading/heading.model';

export const Expertise = async ({ expertise }: ExpertiseComponentProps) => {
    const scopedT = await getScopedI18n('expertises.list');

    return (
        <div>
            <p className="text-base font-semibold text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: scopedT(`${expertise.id}.label`) }} />
            <HeadingComponent tag={HeadingTags.H2} apperance={HeadingTags.H3} className="mb-0">
                {scopedT(`${expertise.id}.title`)}
            </HeadingComponent>
            <p className="text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: scopedT(`${expertise.id}.text`) }} />
        </div>
    );
};
