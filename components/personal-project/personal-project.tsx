import { BookOpen, Flower2, Landmark, type LucideIcon, Package, Truck } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  type PersonalProject,
  PersonalProjectId,
  PersonalProjectStatus,
} from "@/lib/models/personal-project";
import { cn } from "@/lib/utils/cn";
import BadgePersonalProjectComponent from "./components/badge/badge";

const PROJECT_ICONS: Record<PersonalProjectId, LucideIcon> = {
  [PersonalProjectId.BRUT]: Truck,
  [PersonalProjectId.BLOOM]: Flower2,
  [PersonalProjectId.EDITORIALS]: BookOpen,
  [PersonalProjectId.NOTION_BLOG]: Package,
  [PersonalProjectId.FINANCE]: Landmark,
};

const PersonalProjectComponent = async ({ project }: { project: PersonalProject }) => {
  const { "personal-projects": texts } = await getDictionary();
  const Icon = PROJECT_ICONS[project.id];

  const card = (
    <div
      className={cn(
        "relative flex h-full min-h-[200px] flex-shrink-0 flex-grow-1 flex-col items-start justify-start gap-1 rounded-lg border p-6 backdrop-blur-sm",
        {
          ["border-border/50"]: project.status === PersonalProjectStatus.COMING_SOON,
          ["cursor-pointer transition-colors hover:bg-accent"]:
            !!project.link && project.status !== PersonalProjectStatus.COMING_SOON,
        },
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Icon
          aria-hidden
          className={cn("size-5", {
            ["opacity-60"]: project.status === PersonalProjectStatus.COMING_SOON,
          })}
        />
        <div>
          <BadgePersonalProjectComponent status={project.status} />
        </div>
      </div>
      <p
        className={cn("w-full text-xl font-bold", {
          ["opacity-60"]: project.status === PersonalProjectStatus.COMING_SOON,
        })}
      >
        {texts.list[project.id].title}
      </p>
      <p
        className={cn("text-sm text-muted-foreground", {
          ["opacity-60"]: project.status === PersonalProjectStatus.COMING_SOON,
        })}
      >
        {texts.list[project.id].description}
      </p>
    </div>
  );

  if (!project.link) {
    return card;
  }

  return (
    <Link href={project.link} target="_blank" rel="noopener noreferrer">
      {card}
    </Link>
  );
};

export default PersonalProjectComponent;
