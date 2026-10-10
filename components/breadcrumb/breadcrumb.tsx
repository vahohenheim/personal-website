import Link from "next/link";

const ROOT = "~/valentin-bourreau";

type BreadcrumbComponentProps = {
  /** URL of the home page. Set it on inner pages: the root becomes a link. */
  homeHref?: string;
  /** Last segment, for example "cv". */
  current?: string;
  label: string;
};

/** Path-like trail in mono: `~/valentin-bourreau` or `~/valentin-bourreau/cv`. */
const BreadcrumbComponent = ({ homeHref, current, label }: BreadcrumbComponentProps) => {
  return (
    <nav aria-label={label} className="font-mono text-[13px] text-muted">
      {homeHref ? (
        <Link href={homeHref} className="text-muted no-underline hover:text-accent">
          {ROOT}
        </Link>
      ) : (
        <span aria-current="page">{ROOT}</span>
      )}
      {current && <span aria-current="page">/{current}</span>}
    </nav>
  );
};

export default BreadcrumbComponent;
