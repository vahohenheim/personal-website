import Link from "next/link";

type PageNavComponentProps = {
  /** Accessible name of the navigation. */
  label: string;
  /** The page to read next: a mono eyebrow, then its title. */
  next?: { eyebrow: string; title: string; href: string };
  /** A way back, in mono: "← tous les articles". */
  back?: { label: string; href: string };
};

/**
 * The end of a document page, under a rule: the next page to read, then a way back.
 * Written from scratch: shadcn's Pagination is for numbered pages.
 */
const PageNavComponent = ({ label, next, back }: PageNavComponentProps) => {
  return (
    <nav
      aria-label={label}
      className="flex flex-col gap-4 border-t border-line pt-8 pb-[clamp(56px,7vw,96px)] type-label"
    >
      {next && (
        <Link href={next.href} className="flex flex-col gap-1 no-underline hover:text-accent">
          <span className="text-muted">{next.eyebrow}</span>
          <span className="font-sans type-subhead">{next.title}</span>
        </Link>
      )}
      {back && (
        <Link href={back.href} className="text-muted no-underline hover:text-accent">
          {back.label}
        </Link>
      )}
    </nav>
  );
};

export default PageNavComponent;
