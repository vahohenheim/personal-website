import { type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

/** Section title: mono, lowercase, muted, no prefix. */
export const SectionTitleComponent = ({ children }: { children: ReactNode }) => {
  return <h2 className="font-mono text-[13px] font-medium text-muted-foreground">{children}</h2>;
};

type SectionComponentProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/** A block of a page, opened by a 1 px rule. */
const SectionComponent = ({ id, className, children }: SectionComponentProps) => {
  return (
    <section id={id}>
      <Separator />
      <div className={cn("pt-10 pb-[clamp(56px,7vw,96px)]", className)}>{children}</div>
    </section>
  );
};

export default SectionComponent;
