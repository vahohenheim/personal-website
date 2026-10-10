import { Badge } from "@/components/ui/badge/badge";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PersonalProjectStatus } from "@/lib/models/personal-project";

const BadgePersonalProjectComponent = async ({ status }: { status: PersonalProjectStatus }) => {
  const { status: texts } = (await getDictionary())["personal-projects"];

  switch (status) {
    case PersonalProjectStatus.COMING_SOON:
      return <Badge variant="outline">{texts["coming-soon"]}</Badge>;
    case PersonalProjectStatus.ACTIVE:
      return (
        <Badge variant="outline" className="gap-1.5">
          <svg
            width="9"
            height="9"
            viewBox="0 0 6 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 grow-0"
            preserveAspectRatio="none"
          >
            <circle cx="3" cy="3" r="3" fill="#4F7EFF" />
          </svg>
          {texts.active}
        </Badge>
      );
    case PersonalProjectStatus.ARCHIVED:
      return (
        <Badge variant="outline" className="gap-1.5">
          <svg
            width="9"
            height="9"
            viewBox="0 0 6 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 grow-0"
            preserveAspectRatio="none"
          >
            <circle cx="3" cy="3" r="3" fill="#EFB74F" />
          </svg>
          {texts.archived}
        </Badge>
      );
    default:
      return null;
  }
};

export default BadgePersonalProjectComponent;
