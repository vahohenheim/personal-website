import { cn } from "@/lib/utils/cn";

export type Fact = { label: string; value: string };

type FactGridComponentProps = {
  facts: Fact[];
  className?: string;
};

/**
 * Short facts side by side, in cells parted by 1 px rules on the surface colour: a mono
 * label, then the value. The duration and the price of a service. Values never break
 * inside a price. Written from scratch: shadcn has no description grid.
 */
const FactGridComponent = ({ facts, className }: FactGridComponentProps) => {
  return (
    <dl
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-px overflow-hidden rounded border border-line bg-line",
        className,
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-0.5 bg-surface px-4 py-3">
          <dt className="type-meta text-muted">{fact.label}</dt>
          <dd className="type-small font-medium text-text tabular-nums">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default FactGridComponent;
