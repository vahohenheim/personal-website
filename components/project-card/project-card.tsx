import { type ProjectContent, type ProjectStatus } from "@/lib/models/content";
import { cn } from "@/lib/utils/cn";

type ProjectCardComponentProps = {
  project: ProjectContent;
  href?: string;
  statusLabels: Record<ProjectStatus, string>;
};

/** A project: name and status on one line, then what it is and what it is built with. */
const ProjectCardComponent = ({ project, href, statusLabels }: ProjectCardComponentProps) => {
  const isLive = project.status !== "archived";

  return (
    <li className="flex flex-col gap-3 rounded border border-line p-5">
      <div className="flex items-baseline justify-between gap-4">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[15px] font-medium"
          >
            {project.name}
          </a>
        ) : (
          <span className="font-mono text-[15px] font-medium">{project.name}</span>
        )}
        <span className={cn("font-mono text-[12px]", isLive ? "text-accent" : "text-muted")}>
          <span aria-hidden>{isLive ? "●" : "○"}</span> {statusLabels[project.status]}
        </span>
      </div>
      <p className="text-[15px] text-text2">{project.text}</p>
      <p className="font-mono text-[12px] text-muted">{project.stack}</p>
    </li>
  );
};

export default ProjectCardComponent;
