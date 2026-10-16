import { type ReactNode } from "react";
import TocComponent, { type TocEntry } from "@/components/toc/toc";
import { cn } from "@/lib/utils/cn";

export type DocumentTocTexts = {
  /** Visible label on wide screens: "sommaire". */
  label: string;
  /** Summary of the folded list on phones: "sommaire · 20 articles". */
  summary: string;
  navLabel: string;
};

type DocumentLayoutComponentProps = {
  entries: TocEntry[];
  toc: DocumentTocTexts;
  /** Gaps between the blocks of the text, for a body that does not space itself. */
  className?: string;
  children: ReactNode;
};

/**
 * The body of a document page (post, terms, legal notice, design system): under a rule,
 * the summary on the left in a sticky column of 216 px, the text on the right, 680 px at
 * most. Below 1024 px, the summary folds into a `<details>` above the text, so that it is
 * read in the same order on every screen. The page header comes before, the page nav after.
 */
const DocumentLayoutComponent = ({
  entries,
  toc,
  className,
  children,
}: DocumentLayoutComponentProps) => {
  const hasToc = entries.length > 0;

  return (
    <div className="border-t border-line">
      {hasToc && (
        <TocComponent
          {...toc}
          entries={entries}
          variant="mobile"
          className="print-hidden lg:hidden"
        />
      )}
      <div className="flex items-start gap-16 pt-10 pb-12">
        {hasToc && (
          <TocComponent
            {...toc}
            entries={entries}
            variant="desktop"
            className="print-hidden hidden lg:flex"
          />
        )}
        <article className={cn("flex max-w-[680px] min-w-0 flex-1 flex-col", className)}>
          {children}
        </article>
      </div>
    </div>
  );
};

export default DocumentLayoutComponent;
