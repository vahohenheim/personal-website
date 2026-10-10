import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type PersonalProject, PersonalProjectStatus } from "@/lib/models/personal-project";
import { cn } from "@/lib/utils/cn";
import BadgePersonalProjectComponent from "./components/badge/badge";

const PersonalProjectComponent = async ({ project }: { project: PersonalProject }) => {
  const { "personal-projects": texts } = await getDictionary();

  const card = (
    <div
      className={cn(
        "relative flex h-full min-h-[200px] flex-shrink-0 flex-grow-1 flex-col items-start justify-start gap-1 rounded-lg border p-6 backdrop-blur-sm",
        {
          ["border-gray-100 dark:border-gray-950"]:
            project.status === PersonalProjectStatus.COMING_SOON,
          ["cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"]:
            !!project.link && project.status !== PersonalProjectStatus.COMING_SOON,
        },
      )}
    >
      <div className="flex w-full items-center justify-between">
        <p
          className={cn("text-lg", {
            ["opacity-60"]: project.status === PersonalProjectStatus.COMING_SOON,
          })}
        >
          {project.icon}
        </p>
        <div>
          <BadgePersonalProjectComponent status={project.status} />
        </div>
      </div>
      <p
        className={cn("text-semibold w-full text-xl font-bold", {
          ["opacity-60"]: project.status === PersonalProjectStatus.COMING_SOON,
        })}
      >
        {texts.list[project.id].title}
      </p>
      <p
        className={cn("text-sm text-slate-600 dark:text-slate-300", {
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
