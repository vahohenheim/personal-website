import { type ReactNode } from "react";
import HeadingComponent from "@/components/heading/heading";
import { cn } from "@/lib/utils/cn";

type NumberedSectionComponentProps = {
  id: string;
  /** Number shown in the eyebrow, `01`. */
  number: string;
  /** Word after the number, `contexte`: `01 · contexte`. */
  label?: string;
  title: string;
  /**
   * Name of the `#` link to the section, read by screen readers instead of the glyph.
   * Without it, the title has no `#` link.
   */
  anchorLabel?: string;
  /** Number in the text colour; the caller draws the rules around it. */
  emphasis?: boolean;
  /** Rules and margins, set by the caller from the neighbouring sections. */
  className?: string;
  children: ReactNode;
};

/**
 * A numbered section of a document, the same for a post and for an article of the terms:
 * a mono eyebrow (`01 · contexte`, `12`), the `h2` in the `title` style with a `#` link to
 * itself (shown on hover and on keyboard focus), then its body.
 * Written from scratch: shadcn has no numbered section.
 */
const NumberedSectionComponent = ({
  id,
  number,
  label,
  title,
  anchorLabel,
  emphasis = false,
  className,
  children,
}: NumberedSectionComponentProps) => {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("flex scroll-mt-6 flex-col gap-5 text-text2", className)}
    >
      <div className="flex flex-col gap-2">
        <p className={cn("type-label", emphasis ? "text-text" : "text-muted")}>
          {[number, label].filter(Boolean).join(" · ")}
        </p>
        <div className="group flex items-baseline gap-2">
          <HeadingComponent level={2} id={titleId} className="max-w-[30ch]">
            {title}
          </HeadingComponent>
          {anchorLabel && (
            // Hidden until hover or focus, like a heading anchor: not an entrance effect.
            <a
              href={`#${id}`}
              className="type-label text-muted no-underline opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <span aria-hidden>#</span>
              <span className="sr-only">{anchorLabel}</span>
            </a>
          )}
        </div>
      </div>
      {children}
    </section>
  );
};

export default NumberedSectionComponent;
