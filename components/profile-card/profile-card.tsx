import { type ProfileRow } from "@/lib/models/content";
import StatusDotComponent from "../status-dot/status-dot";

/** Key / value sheet in mono, on a surface block. */
const ProfileCardComponent = ({ rows }: { rows: ProfileRow[] }) => {
  return (
    <dl className="grid grid-cols-[minmax(88px,128px)_1fr] gap-x-5 gap-y-2 rounded border border-line bg-surface p-6 font-mono text-[13px]">
      {rows.map((row) => (
        <div key={`${row.key}-${row.value}`} className="contents">
          <dt className="text-muted">{row.key}</dt>
          <dd className="flex items-center gap-2 text-text">
            {row.live && <StatusDotComponent />}
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default ProfileCardComponent;
