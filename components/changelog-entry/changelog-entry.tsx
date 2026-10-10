import { type ChangelogEntry } from "@/lib/models/content";
import { cn } from "@/lib/utils/cn";
import AchievementListComponent from "../achievement-list/achievement-list";

type ChangelogEntryComponentProps = {
  entry: ChangelogEntry;
  /** The resume shows larger titles than the home page. */
  size?: "default" | "large";
};

/** One line of the changelog: a date column in mono, then the role and what was done. */
const ChangelogEntryComponent = ({ entry, size = "default" }: ChangelogEntryComponentProps) => {
  return (
    <li className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line py-6">
      <div className="flex flex-[0_0_160px] flex-col gap-1 font-mono text-[13px]">
        <span className={cn("whitespace-nowrap", entry.current ? "text-accent" : "text-muted")}>
          {entry.date}
        </span>
        {entry.duration && <span className="text-[12px] text-muted">{entry.duration}</span>}
      </div>
      <div className="flex min-w-[min(100%,280px)] flex-1 flex-col gap-3">
        <h3
          className={cn(
            "leading-[1.3] font-semibold tracking-[-0.01em]",
            size === "large" ? "text-[21px]" : "text-[19px]",
          )}
        >
          {entry.title}
          {entry.company && <span className="font-normal text-muted"> · {entry.company}</span>}
        </h3>
        {entry.roles && (
          <ul className="flex list-none flex-col font-mono text-[12px] text-muted">
            {entry.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        )}
        {entry.text && <p className="max-w-[64ch] text-text2">{entry.text}</p>}
        {entry.achievements && <AchievementListComponent items={entry.achievements} />}
        {entry.earlier && (
          <ul className="flex list-none flex-col gap-1">
            {entry.earlier.map((item) => (
              <li key={item.label} className="flex flex-wrap items-baseline gap-x-3 text-text">
                <span>{item.label}</span>
                <span className="font-mono text-[12px] text-muted">{item.years}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default ChangelogEntryComponent;
