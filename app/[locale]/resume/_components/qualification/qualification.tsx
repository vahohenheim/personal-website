import dayjs from "dayjs";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type QualificationComponentProps } from "./qualification.model";

const QualificationComponent = async ({ qualification }: QualificationComponentProps) => {
  const { qualifications, schools } = await getDictionary();

  return (
    <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-2 self-stretch">
      <div className="rounded-lg flex shrink-0 grow-0 flex-col items-start justify-start gap-4 self-stretch">
        <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-2 self-stretch">
          <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-0.5 self-stretch">
            <p className="text-2xl font-bold">{qualifications.list[qualification.id].label}</p>
            <p className="text-secondary-foreground">
              {qualifications.level[qualification.level].name} |{" "}
              {schools.list[qualification.school.id].name}, {qualification.school.location} |{" "}
              {dayjs(qualification.obtainDate).format("YYYY")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationComponent;
