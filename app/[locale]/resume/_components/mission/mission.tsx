import dayjs from "dayjs";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { type Mission } from "@/lib/models/mission";
import { type RoleId } from "@/lib/models/role";
import { formatDateDifference } from "@/lib/utils/format-date-difference";
import DurationComponent from "../duration/duration";

const MissionComponent = async ({ mission }: { mission: Mission }) => {
  const lang = await getLocale();
  const { experiences, roles } = await getDictionary();

  return (
    <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-2 self-stretch">
      <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-1 self-stretch">
        <p className="shrink-0 grow-0 self-stretch text-xl font-bold">
          {mission.roles.map((role: RoleId) => roles[role]).join(" & ")}
        </p>
        {!!mission.startDate && !!mission.endDate && (
          <p className="shrink-0 grow-0 self-stretch text-base">
            <DurationComponent
              startDate={dayjs(mission.startDate).locale(lang).format("MMMM YYYY")}
              endDate={dayjs(mission.endDate).locale(lang).format("MMMM YYYY")}
              duration={formatDateDifference(
                dayjs(mission.startDate),
                dayjs(mission.endDate),
                lang,
              )}
            />
          </p>
        )}
      </div>
      <p
        className="shrink-0 grow-0 list-disc self-stretch text-base text-secondary-foreground"
        dangerouslySetInnerHTML={{ __html: experiences.roles[mission.id].content }}
      />
    </div>
  );
};

export default MissionComponent;
