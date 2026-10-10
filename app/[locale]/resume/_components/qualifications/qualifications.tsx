import SectionComponent from "@/components/section/section";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type QualificationsComponentProps } from "./qualifications.model";
import QualificationComponent from "../qualification/qualification";

const QualificationsComponent = async ({ qualifications }: QualificationsComponentProps) => {
  const { qualifications: texts } = await getDictionary();

  return (
    <SectionComponent title={texts.title}>
      <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-8 self-stretch">
        {qualifications.map((qualification) => (
          <QualificationComponent key={qualification.id} qualification={qualification} />
        ))}
      </div>
    </SectionComponent>
  );
};

export default QualificationsComponent;
