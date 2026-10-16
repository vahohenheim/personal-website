import { type ReactNode } from "react";
import { type BreadcrumbSegment } from "@/components/breadcrumb/breadcrumb";
import DocumentLayoutComponent from "@/components/document-layout/document-layout";
import LegalBlocksComponent from "@/components/legal-blocks/legal-blocks";
import NumberedSectionComponent from "@/components/numbered-section/numbered-section";
import PageHeaderComponent from "@/components/page-header/page-header";
import PageNavComponent from "@/components/page-nav/page-nav";
import { type LegalSection, type LegalTocTexts } from "@/lib/models/legal";
import { cn } from "@/lib/utils/cn";

type LegalLayoutComponentProps = {
  breadcrumb: { label: string; homeHref: string; trail: BreadcrumbSegment[] };
  title: string;
  /** The mono line under the title: version, date, download link. */
  meta: ReactNode;
  /** What follows the meta line in the header: identity sheet, notice. */
  intro?: ReactNode;
  toc: LegalTocTexts;
  /** Name of the `#` link of each section; `{n}` and `{title}` are replaced. */
  anchor: string;
  sections: LegalSection[];
  /** The other legal page, offered at the end. */
  seeAlso: { label: string; eyebrow: string; title: string; href: string };
};

/**
 * Rules between sections. A run of emphasised sections (articles 11 and 12) is framed by
 * two rules in the text colour, with a little room outside; the section before the run
 * drops its own rule so that the two never stack. The last section has no rule.
 */
const getFrame = (sections: LegalSection[], index: number) => {
  const section = sections[index];
  const previous = sections.at(index - 1);
  const next = sections.at(index + 1);
  const opensRun = section.emphasis === true && (index === 0 || previous?.emphasis !== true);
  const closesRun = section.emphasis === true && next?.emphasis !== true;

  if (section.emphasis === true) {
    return cn("border-b border-text py-12", opensRun && "mt-2 border-t", closesRun && "mb-2");
  }

  return cn(
    "py-10",
    index === 0 && "pt-0",
    next !== undefined && next.emphasis !== true && "border-b border-line",
  );
};

/**
 * Page of a legal document, on the document template shared with the posts: the page
 * header (trail, title, meta, identity), then the summary on the left and the numbered
 * sections on the right, then a link to the other legal page.
 */
const LegalLayoutComponent = ({
  breadcrumb,
  title,
  meta,
  intro,
  toc,
  anchor,
  sections,
  seeAlso,
}: LegalLayoutComponentProps) => {
  const entries = sections.map(({ id, number, title: entryTitle }) => ({
    id,
    number,
    title: entryTitle,
  }));

  return (
    <>
      <PageHeaderComponent breadcrumb={breadcrumb} title={title} meta={meta}>
        {intro}
      </PageHeaderComponent>
      <DocumentLayoutComponent
        entries={entries}
        toc={{
          label: toc.label,
          summary: toc.summary.replace("{count}", `${sections.length}`),
          navLabel: toc.navLabel,
        }}
      >
        {sections.map((section, index) => (
          <NumberedSectionComponent
            key={section.id}
            id={section.id}
            number={section.number}
            title={section.title}
            emphasis={section.emphasis}
            anchorLabel={anchor
              .replace("{n}", `${Number(section.number)}`)
              .replace("{title}", section.title)}
            className={getFrame(sections, index)}
          >
            <LegalBlocksComponent blocks={section.blocks} />
          </NumberedSectionComponent>
        ))}
      </DocumentLayoutComponent>
      <PageNavComponent
        label={seeAlso.label}
        next={{ eyebrow: seeAlso.eyebrow, title: seeAlso.title, href: seeAlso.href }}
      />
    </>
  );
};

export default LegalLayoutComponent;
