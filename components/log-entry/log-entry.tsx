import { type ReactNode } from "react";
import HeadingComponent from "@/components/heading/heading";
import { cn } from "@/lib/utils/cn";

type LogEntryComponentProps = {
  /** The date column: a period (`2024.10 → 2026.10`) or a `<time>`. */
  date: ReactNode;
  /** A second mono line under the date: a duration, a reading time. */
  detail?: ReactNode;
  /** The entry is live (current position): its date takes the accent. */
  current?: boolean;
  /** Level of the title in the page outline. Its style is always `subhead`. */
  level?: 2 | 3;
  title: ReactNode;
  children?: ReactNode;
};

/**
 * One line of a dated list, in the grammar of the changelog: a mono date column of 160 px,
 * then a title and what follows. The changelog of the home page and the resume, and the
 * lists of posts, are all made of it. Written from scratch: shadcn has no timeline.
 */
const LogEntryComponent = ({
  date,
  detail,
  current = false,
  level = 3,
  title,
  children,
}: LogEntryComponentProps) => {
  return (
    <li className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line py-6">
      {/* 3 px down, so that the date sits on the first line of the title. */}
      <div className="flex flex-[0_0_160px] flex-col gap-1 pt-[3px]">
        <span
          className={cn("type-label whitespace-nowrap", current ? "text-accent" : "text-muted")}
        >
          {date}
        </span>
        {detail && <span className="type-meta text-muted">{detail}</span>}
      </div>
      <div className="flex min-w-[min(100%,280px)] flex-1 flex-col gap-3">
        <HeadingComponent level={level} variant="subhead">
          {title}
        </HeadingComponent>
        {children}
      </div>
    </li>
  );
};

export default LogEntryComponent;
