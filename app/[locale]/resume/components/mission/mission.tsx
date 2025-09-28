import DurationComponent from '../duration/duration';
import { getScopedI18n } from '@/locales/server';
import { Mission } from '@/app/models/mission';
import dayjs from 'dayjs';
import { formatDateDifference } from '@/app/utils/format-date-difference';
import { RoleId } from '@/app/models/role';

const MissionComponent = async ({ mission, lang }: { mission: Mission; lang: 'fr' | 'en' }) => {
    const scopedT = await getScopedI18n(`experiences.roles.${mission.id}`);
    const rolesScopedT = await getScopedI18n(`roles`);

    return (
        <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-2 self-stretch">
            <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-1 self-stretch">
                <p className="shrink-0 grow-0 self-stretch text-xl font-bold">
                    {mission.roles.map((role: RoleId) => rolesScopedT(role)).join(' & ')}
                </p>
                {!!mission.startDate ||
                    (!!mission.endDate && (
                        <p className="shrink-0 grow-0 self-stretch text-base">
                            <DurationComponent
                                startDate={dayjs(mission.startDate).format('MMMM YYYY')}
                                endDate={dayjs(mission.endDate).format('MMMM YYYY')}
                                duration={formatDateDifference(dayjs(mission.startDate), dayjs(mission.endDate), lang)}
                            />
                        </p>
                    ))}
            </div>
            <p
                className="shrink-0 grow-0 list-disc self-stretch text-base text-secondary-foreground"
                dangerouslySetInnerHTML={{ __html: scopedT('content') }}
            />
        </div>
    );
};

export default MissionComponent;
