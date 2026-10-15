import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type NumberedSectionComponentProps = {
  id: string;
  number: string;
  title: string;
  /** Name of the `#` link to the section, read by screen readers instead of the glyph. */
  anchorLabel: string;
  /** Number in the text colour and more room; the caller draws the rules around it. */
  emphasis?: boolean;
  /** Rules and margins, set by the caller from the neighbouring sections. */
  className?: string;
  children: ReactNode;
};

/**
 * An article of the terms or a section of the legal notice: its number in a mono column,
 * its title with a `#` link to itself (shown on hover and on keyboard focus), its body.
 * Written from scratch: shadcn has no numbered section.
 */
const NumberedSectionComponent = ({
  id,
  number,
  title,
  anchorLabel,
  emphasis = false,
  className,
  children,
}: NumberedSectionComponentProps) => {
  return (
    <section
      id={id}
      className={cn(
        "grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 md:grid-cols-[48px_minmax(0,1fr)]",
        emphasis ? "py-12" : "py-8",
        className,
      )}
    >
      <span className={cn("pt-[5px] font-mono text-[13px]", emphasis ? "text-text" : "text-muted")}>
        {number}
      </span>
      <div className="flex min-w-0 flex-col gap-3 text-text2">
        <div className="group flex items-baseline gap-2">
          <h2 className="text-[21px] leading-[1.3] font-semibold tracking-[-0.01em] text-text">
            {title}
          </h2>
          {/* Hidden until hover or focus, like a heading anchor: not an entrance effect. */}
          <a
            href={`#${id}`}
            className="font-mono text-muted no-underline opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <span aria-hidden>#</span>
            <span className="sr-only">{anchorLabel}</span>
          </a>
        </div>
        {children}
      </div>
    </section>
  );
};

export default NumberedSectionComponent;
