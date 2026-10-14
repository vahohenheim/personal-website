import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ProjectContent, type ProjectStatus } from "@/lib/models/content";

type ProjectCardComponentProps = {
  project: ProjectContent;
  href?: string;
  statusLabels: Record<ProjectStatus, string>;
  /** The post about this project, when one is published. */
  post?: { href: string; label: string };
};

/** A project: name and status on one line, then what it is and what it is built with. */
const ProjectCardComponent = ({ project, href, statusLabels, post }: ProjectCardComponentProps) => {
  const isLive = project.status !== "archived";

  return (
    <li>
      <Card className="h-full p-5">
        <CardHeader>
          <CardTitle className="font-mono text-[15px] font-medium">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            ) : (
              project.name
            )}
          </CardTitle>
          <CardAction>
            <Badge variant={isLive ? "default" : "secondary"}>
              <span aria-hidden>{isLive ? "●" : "○"}</span>
              {statusLabels[project.status]}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardDescription>{project.text}</CardDescription>
        {project.stack && <CardFooter>{project.stack}</CardFooter>}
        {post && (
          <CardFooter className="mt-auto">
            {/* The visible text alone would be the same on every card. */}
            <Link href={post.href} aria-label={`${post.label} · ${project.name}`}>
              {post.label} →
            </Link>
          </CardFooter>
        )}
      </Card>
    </li>
  );
};

export default ProjectCardComponent;
