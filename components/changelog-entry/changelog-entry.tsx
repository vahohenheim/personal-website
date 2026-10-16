import AchievementListComponent from "@/components/achievement-list/achievement-list";
import LogEntryComponent from "@/components/log-entry/log-entry";
import { type ChangelogEntry } from "@/lib/models/content";

/** One line of the changelog (home page and resume): a dated entry with its roles and work. */
const ChangelogEntryComponent = ({ entry }: { entry: ChangelogEntry }) => {
  return (
    <LogEntryComponent
      date={entry.date}
      detail={entry.duration}
      current={entry.current}
      title={
        <>
          {entry.title}
          {entry.company && <span className="font-normal text-muted"> · {entry.company}</span>}
        </>
      }
    >
      {entry.roles && (
        <ul className="flex list-none flex-col type-meta text-muted">
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
              <span className="type-meta text-muted">{item.years}</span>
            </li>
          ))}
        </ul>
      )}
    </LogEntryComponent>
  );
};

export default ChangelogEntryComponent;
