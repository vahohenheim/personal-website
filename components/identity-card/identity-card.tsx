import RichTextComponent from "@/components/rich-text/rich-text";
import { Card, CardContent } from "@/components/ui/card";
import { type IdentityRow } from "@/lib/models/legal";
import { cn } from "@/lib/utils/cn";

type IdentityCardComponentProps = { rows: IdentityRow[]; className?: string };

/**
 * The identity of the business in a key / value sheet: mono, on the surface colour. Values
 * break anywhere, so that the e-mail address never overflows on a phone.
 */
const IdentityCardComponent = ({ rows, className }: IdentityCardComponentProps) => {
  return (
    <Card className={cn("bg-surface p-5 font-mono text-[13px] leading-[1.6]", className)}>
      <CardContent>
        <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 gap-y-1.5 md:grid-cols-[140px_minmax(0,1fr)]">
          {rows.map((row) => (
            <div key={row.key} className="contents">
              <dt className="text-muted">{row.key}</dt>
              <dd className="min-w-0 [overflow-wrap:anywhere] text-text">
                <RichTextComponent text={row.value} />
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

export default IdentityCardComponent;
