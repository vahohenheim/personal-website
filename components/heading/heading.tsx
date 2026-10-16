import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type HeadingVariant = "display" | "display-compact" | "title" | "subhead" | "label";

type HeadingComponentProps = {
  /** The level follows the outline of the page. */
  level: 1 | 2 | 3;
  /** The style follows the role. Defaults to `display`, `title` and `subhead` by level. */
  variant?: HeadingVariant;
  id?: string;
  className?: string;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<HeadingVariant, string> = {
  display: "type-display text-text",
  "display-compact": "type-display-compact text-text",
  title: "type-title text-text",
  subhead: "type-subhead text-text",
  // The `h2` of an index page: a mono mark, lowercase, a little heavier than the trail.
  label: "type-label font-medium text-muted",
};

const DEFAULT_VARIANTS: Record<HeadingComponentProps["level"], HeadingVariant> = {
  1: "display",
  2: "title",
  3: "subhead",
};

/**
 * Every heading of the site. The level and the style are set apart, so that the outline
 * stays right while the look stays within the type scale: an index page has `h2` in the
 * `label` style, a list of posts has `h2` in the `subhead` style. There is no `h4`.
 * Written from scratch: shadcn has no heading component.
 */
const HeadingComponent = ({ level, variant, id, className, children }: HeadingComponentProps) => {
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className={cn(VARIANT_CLASSES[variant ?? DEFAULT_VARIANTS[level]], className)}>
      {children}
    </Tag>
  );
};

export default HeadingComponent;
