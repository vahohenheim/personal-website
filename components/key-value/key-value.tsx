import { type ReactNode } from "react";
import StatusDotComponent from "@/components/status-dot/status-dot";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type KeyValueRow = {
  key: string;
  value: ReactNode;
  /** Marks a live value (current status) with the accent dot. */
  live?: boolean;
};

type KeyValueComponentProps = {
  rows: KeyValueRow[];
  /** A last line under a rule: status and link of a project. */
  footer?: ReactNode;
  className?: string;
};

/**
 * The key / value sheet of the charter, used for the profile, the stack, the identity of
 * the business and the project sheet of a post: mono, keys in the muted colour, on the
 * surface colour in a 1 px frame. Values break anywhere, so that an e-mail address never
 * overflows on a phone. Built on the shadcn Card.
 */
const KeyValueComponent = ({ rows, footer, className }: KeyValueComponentProps) => {
  return (
    <Card className={cn("w-full max-w-[720px] gap-4 bg-surface p-5 type-label sm:p-6", className)}>
      <CardContent>
        <dl className="grid grid-cols-[minmax(80px,auto)_minmax(0,1fr)] gap-x-5 gap-y-2 sm:grid-cols-[128px_minmax(0,1fr)]">
          {rows.map((row) => (
            <div key={row.key} className="contents">
              <dt className="text-muted">{row.key}</dt>
              <dd className="flex min-w-0 items-center gap-2 [overflow-wrap:anywhere] text-text">
                {row.live && <StatusDotComponent />}
                <span className="min-w-0">{row.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
      {footer && (
        <CardFooter className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 type-label text-text">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default KeyValueComponent;
