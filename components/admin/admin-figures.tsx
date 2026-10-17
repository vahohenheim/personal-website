import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type AdminFigure = {
  label: string;
  value: string | number;
  detail: string;
  /** In the accent colour: something is waiting. */
  live?: boolean;
};

type AdminFiguresProps = {
  figures: AdminFigure[];
  /** Grid classes: fixed columns when the count is known, so that no row has a hole. */
  className?: string;
};

/** A row of key figures of the admin, as cells joined by 1 px rules. */
const AdminFiguresComponent = ({ figures, className }: AdminFiguresProps) => {
  return (
    <ul
      className={cn(
        "grid list-none grid-cols-1 gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2",
        className,
      )}
    >
      {figures.map((figure) => (
        <li key={figure.label} className="bg-background">
          <Card className="h-full gap-1 rounded-none border-0 p-6">
            <p className="type-meta text-muted-foreground">{figure.label}</p>
            <CardTitle
              className={
                figure.live ? "type-title text-primary tabular-nums" : "type-title tabular-nums"
              }
            >
              {figure.value}
            </CardTitle>
            <CardDescription className="type-meta text-muted-foreground">
              {figure.detail}
            </CardDescription>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export default AdminFiguresComponent;
