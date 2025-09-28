import Link from 'next/link';
import BadgePersonalProjectComponent from './components/badge/badge';
import { getScopedI18n } from '@/locales/server';
import { cn } from '@/lib/utils/cn';
import { PersonalProject, PersonalProjectStatus } from '@/app/models/personal-project';

const PersonalProjectComponent = async ({ project }: { project: PersonalProject }) => {
    const scopedT = await getScopedI18n('personal-projects.list');

    return (
        <Link key={project.id} href={project.link || '#'} scroll={true}>
            <div
                key={project.id}
                className={cn(
                    'flex flex-col justify-start items-start flex-grow-1 flex-shrink-0 h-full relative gap-1 p-6 rounded-lg border backdrop-blur-sm min-h-[200px]',
                    {
                        ['border-gray-100 dark:border-gray-950']: project.status === PersonalProjectStatus.COMING_SOON,
                        ['cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors']:
                            project.status !== PersonalProjectStatus.COMING_SOON
                    }
                )}
            >
                <div className="flex w-full items-center justify-between">
                    <p
                        className={cn('text-lg', {
                            ['opacity-60']: project.status === PersonalProjectStatus.COMING_SOON
                        })}
                    >
                        {project.icon}
                    </p>
                    <div>
                        <BadgePersonalProjectComponent status={project.status} />
                    </div>
                </div>
                <p
                    className={cn('w-full text-xl font-bold text-semibold', {
                        ['opacity-60']: project.status === PersonalProjectStatus.COMING_SOON
                    })}
                >
                    {scopedT(`${project.id}.title`)}
                </p>
                <p
                    className={cn('text-sm text-slate-600 dark:text-slate-300', {
                        ['opacity-60']: project.status === PersonalProjectStatus.COMING_SOON
                    })}
                >
                    {scopedT(`${project.id}.description`)}
                </p>
            </div>
        </Link>
    );
};

export default PersonalProjectComponent;
