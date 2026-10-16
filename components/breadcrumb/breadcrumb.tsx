import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROOT = "~/valentin-bourreau";

/** A segment after the root. The last one is the current page and takes no link. */
export type BreadcrumbSegment = { label: string; href?: string };

type BreadcrumbComponentProps = {
  /** URL of the home page. Set it on inner pages: the root becomes a link. */
  homeHref?: string;
  /** Segments after the root, for example `[{ label: "articles", href }, { label: "pensee" }]`. */
  trail?: BreadcrumbSegment[];
  label: string;
};

/**
 * Path-like trail in mono, the same on every page: `~/valentin-bourreau`,
 * `~/valentin-bourreau/cv`, `~/valentin-bourreau/articles/pensee`.
 */
const BreadcrumbComponent = ({ homeHref, trail = [], label }: BreadcrumbComponentProps) => {
  return (
    <Breadcrumb aria-label={label}>
      <BreadcrumbList>
        <BreadcrumbItem>
          {homeHref ? (
            <BreadcrumbLink asChild>
              <Link href={homeHref}>{ROOT}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{ROOT}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {trail.map((segment, index) => (
          <Fragment key={segment.label}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {segment.href && index < trail.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-text">{segment.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
