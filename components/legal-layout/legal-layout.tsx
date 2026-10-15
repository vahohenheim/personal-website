import { type ReactNode } from "react";
import BreadcrumbComponent from "@/components/breadcrumb/breadcrumb";
import LegalBlocksComponent from "@/components/legal-blocks/legal-blocks";
import LegalTocComponent from "@/components/legal-toc/legal-toc";
import NumberedSectionComponent from "@/components/numbered-section/numbered-section";
import { type LegalSection, type LegalTocTexts } from "@/lib/models/legal";
import { cn } from "@/lib/utils/cn";

type LegalLayoutComponentProps = {
  breadcrumb: { label: string; homeHref: string; current: string };
  title: string;
  /** The mono line under the title: version, date, download link. */
  meta: ReactNode;
  /** What follows the meta line in the intro: identity card, notice. */
  intro?: ReactNode;
  toc: LegalTocTexts;
  /** Name of the `#` link of each section; `{n}` and `{title}` are replaced. */
  anchor: string;
  sections: LegalSection[];
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
    return cn("border-b border-text", opensRun && "mt-2 border-t", closesRun && "mb-2");
  }

  return next === undefined || next.emphasis === true ? undefined : "border-b border-line";
};

/**
 * Page of a legal document: an intro (trail, title, meta, identity), then the summary and
 * the numbered sections side by side on wide screens, one under the other on phones.
 */
const LegalLayoutComponent = ({
  breadcrumb,
  title,
  meta,
  intro,
  toc,
  anchor,
  sections,
}: LegalLayoutComponentProps) => {
  const entries = sections.map(({ id, number, title: entryTitle }) => ({
    id,
    number,
    title: entryTitle,
  }));
  const tocTexts = {
    entries,
    label: toc.label,
    summary: toc.summary.replace("{count}", `${sections.length}`),
    navLabel: toc.navLabel,
  };

  return (
    <>
      <div className="flex flex-col gap-5 border-b border-line pt-8 pb-7 md:pt-16 md:pb-12">
        <BreadcrumbComponent {...breadcrumb} />
        <h1 className="text-[36px] leading-[1.02] font-semibold tracking-[-0.04em] md:text-[60px]">
          {title}
        </h1>
        {meta}
        {intro}
      </div>
      <LegalTocComponent {...tocTexts} variant="mobile" className="print-hidden md:hidden" />
      <div className="flex items-start gap-16 pb-20">
        <LegalTocComponent
          {...tocTexts}
          variant="desktop"
          className="print-hidden hidden md:flex"
        />
        <article className="flex max-w-[700px] min-w-0 flex-1 flex-col">
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
        </article>
      </div>
    </>
  );
};

export default LegalLayoutComponent;
