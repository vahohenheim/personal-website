import { type ReactNode } from "react";
import HeadingComponent from "@/components/heading/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

/** Section title of an index page: an `h2` in the `label` style, lowercase, no prefix. */
export const SectionTitleComponent = ({ children }: { children: ReactNode }) => {
  return (
    <HeadingComponent level={2} variant="label">
      {children}
    </HeadingComponent>
  );
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
