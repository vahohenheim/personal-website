import { ExperienceComponentProps } from './experience.model';
import MissionComponent from '../mission/mission';
import DurationComponent from '../duration/duration';
import { getScopedI18n } from '@/locales/server';
import dayjs from 'dayjs';
import { formatDateDifference } from '@/app/utils/format-date-difference';
import CompanyIconComponent from '@/components/company-icon/company-icon';

const ExperienceComponent = async ({ lang, experience }: ExperienceComponentProps) => {
    const companyScopedT = await getScopedI18n(`companies.list.${experience.company.id}`);

    return (
        <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-8 self-stretch pb-10 [&:not(:last-child)]:border-b-2">
            <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-1 self-stretch">
                <div className="mb-2 shrink-0 rounded-md bg-gray-100 px-3 py-2 dark:bg-gray-800">
                    <CompanyIconComponent
                        company={experience.company}
                        className="fill-gray-700 dark:fill-gray-300"
                        height={40}
                    />
                </div>
                <p className="shrink-0 grow-0 self-stretch text-2xl">
                    <span className="shrink-0 grow-0 self-stretch text-2xl font-bold">{companyScopedT('name')}</span>
                    <span className="shrink-0 grow-0 self-stretch text-2xl">, {experience.company.location}</span>
                </p>
                <p className="shrink-0 grow-0 self-stretch text-base font-semibold">
                    <DurationComponent
                        startDate={dayjs(experience.startDate).locale(lang).format('MMMM YYYY')}
                        endDate={dayjs(experience.endDate).locale(lang).format('MMMM YYYY')}
                        duration={formatDateDifference(dayjs(experience.startDate), dayjs(experience.endDate), lang)}
                    />
                </p>
            </div>
            <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-6 self-stretch">
                {experience.missions.map((mission, index) => (
                    <MissionComponent key={index} mission={mission} lang={lang} />
                ))}
            </div>
        </div>
    );
};

export default ExperienceComponent;
