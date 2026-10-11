import { Card, CardContent } from "@/components/ui/card";
import { type ProfileRow } from "@/lib/models/content";
import StatusDotComponent from "../status-dot/status-dot";

/** Key / value sheet in mono, on a surface block. */
const ProfileCardComponent = ({ rows }: { rows: ProfileRow[] }) => {
  return (
    <Card className="bg-surface p-6 font-mono text-[13px]">
      <CardContent>
        <dl className="grid grid-cols-[minmax(88px,128px)_1fr] gap-x-5 gap-y-2">
          {rows.map((row) => (
            <div key={`${row.key}-${row.value}`} className="contents">
              <dt className="text-muted-foreground">{row.key}</dt>
              <dd className="flex items-center gap-2 text-foreground">
                {row.live && <StatusDotComponent />}
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

export default ProfileCardComponent;
