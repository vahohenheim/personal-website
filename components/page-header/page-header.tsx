import { type ReactNode } from "react";
import AvatarComponent from "@/components/avatar/avatar";
import BreadcrumbComponent, { type BreadcrumbSegment } from "@/components/breadcrumb/breadcrumb";
import HeadingComponent from "@/components/heading/heading";
import { cn } from "@/lib/utils/cn";

type PageHeaderComponentProps = {
  breadcrumb: { label: string; homeHref?: string; trail?: BreadcrumbSegment[] };
  title: ReactNode;
  /** The portrait beside the trail: the home page and the resume, as on the paper resume. */
  avatar?: boolean;
  /** One step down for long titles (posts). Still the page title, still the same look. */
  compact?: boolean;
  lead?: ReactNode;
  /** The mono line under the title or the lead: dates, version, status, links. */
  meta?: ReactNode;
  /** What closes the header: a key / value sheet, tags, buttons. */
  children?: ReactNode;
  className?: string;
};

/**
 * The top of every page: trail, `h1`, lead, meta line, then the page's own blocks, with the
 * same rhythm everywhere. It draws no rule: the block that follows opens on one.
 */
const PageHeaderComponent = ({
  breadcrumb,
  title,
  avatar = false,
  compact = false,
  lead,
  meta,
  children,
  className,
}: PageHeaderComponentProps) => {
  const trail = <BreadcrumbComponent {...breadcrumb} />;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(48px,6vw,72px)]",
        className,
      )}
    >
      {avatar ? (
        <div className="flex items-center gap-5">
          <AvatarComponent />
          {trail}
        </div>
      ) : (
        trail
      )}
      <HeadingComponent
        level={1}
        variant={compact ? "display-compact" : "display"}
        className={compact ? "max-w-[24ch]" : "max-w-[20ch]"}
      >
        {title}
      </HeadingComponent>
      {lead && <p className="max-w-[64ch] type-lead text-text2">{lead}</p>}
      {meta}
      {children}
    </div>
  );
};

export default PageHeaderComponent;
