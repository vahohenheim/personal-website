import { ExpertiseComponentProps } from './expertise.model';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { HeadingComponent } from '@/components/ui/heading/heading';
import { HeadingTags } from '@/components/ui/heading/heading.model';

export const Expertise = async ({ expertise }: ExpertiseComponentProps) => {
    const { expertises } = await getDictionary();
    const texts = expertises.list[expertise.id];

    return (
        <div>
            <p
                className="text-base font-semibold text-slate-600 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: texts.label }}
            />
            <HeadingComponent tag={HeadingTags.H2} apperance={HeadingTags.H3} className="mb-0">
                {texts.title}
            </HeadingComponent>
            <p className="text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: texts.text }} />
        </div>
    );
};
