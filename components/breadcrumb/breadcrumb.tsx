import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
        {current && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
