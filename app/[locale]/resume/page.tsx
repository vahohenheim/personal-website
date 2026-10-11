import type { Metadata } from "next";
import AvatarComponent from "@/components/avatar/avatar";
import BreadcrumbComponent from "@/components/breadcrumb/breadcrumb";
import ChangelogEntryComponent from "@/components/changelog-entry/changelog-entry";
import JsonLdComponent from "@/components/json-ld/json-ld";
import ProfileCardComponent from "@/components/profile-card/profile-card";
import SectionComponent, { SectionTitleComponent } from "@/components/section/section";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import StatusDotComponent from "@/components/status-dot/status-dot";
import { Button } from "@/components/ui/button";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { SITE_NAME } from "@/lib/constants/site";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { type ProfileRow } from "@/lib/models/content";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("resume");

/** Year or language code in mono, then the line it dates. */
const DatedList = ({ rows }: { rows: ProfileRow[] }) => (
  <dl className="grid grid-cols-[56px_1fr] gap-x-4 gap-y-2">
    {rows.map((row) => (
      <div key={`${row.key}-${row.value}`} className="contents">
        <dt className="font-mono text-[13px] leading-[1.9] text-muted">{row.key}</dt>
        <dd className="text-text2">{row.value}</dd>
      </div>
    ))}
  </dl>
);

export default async function ResumePage() {
  const locale = await getLocale();
  const { resume, a11y } = await getDictionary();

  return (
    <>
      <main id="main" className="container-page">
        <JsonLdComponent page="resume" />

        <section className="flex flex-col gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]">
          <div className="flex items-center gap-5">
            <AvatarComponent />
            <BreadcrumbComponent
              label={a11y.breadcrumb}
              homeHref={`/${locale}/`}
              current={resume.breadcrumb}
            />
          </div>
          <h1 className="text-[clamp(38px,5.6vw,64px)] leading-none font-semibold tracking-[-0.04em]">
            {resume.title}
          </h1>
          <ul className="flex list-none flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[13px] text-muted">
            <li className="text-text">{SITE_NAME}</li>
            <li className="flex items-center gap-2">
              <StatusDotComponent />
              {resume.meta.status}
            </li>
            <li>{resume.meta.since}</li>
            <li>{resume.meta.location}</li>
          </ul>
          <p className="max-w-[64ch] text-[18px] leading-[1.5] text-text2">{resume.summary}</p>
          <div className="print-hidden flex flex-wrap gap-3">
            <Button asChild>
              <a href="/cv.pdf" download>
                {resume.actions.download}
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={`mailto:${MAIL_ADDRESS}`}>{resume.actions.contact}</a>
            </Button>
          </div>
        </section>

        <SectionComponent className="flex flex-col gap-6">
          <SectionTitleComponent>{resume.stack.title}</SectionTitleComponent>
          <ProfileCardComponent rows={resume.stack.rows} />
        </SectionComponent>

        <SectionComponent className="flex flex-col gap-6">
          <SectionTitleComponent>{resume.changelog.title}</SectionTitleComponent>
          <ol className="list-none">
            {resume.changelog.entries.map((entry) => (
              <ChangelogEntryComponent key={entry.date} entry={entry} size="large" />
            ))}
          </ol>
        </SectionComponent>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-10">
          <SectionComponent className="flex flex-col gap-6">
            <SectionTitleComponent>{resume.education.title}</SectionTitleComponent>
            <DatedList rows={resume.education.rows} />
          </SectionComponent>
          <SectionComponent className="flex flex-col gap-6">
            <SectionTitleComponent>{resume.languages.title}</SectionTitleComponent>
            <DatedList rows={resume.languages.rows} />
          </SectionComponent>
        </div>
      </main>
      <SiteFooterComponent />
    </>
  );
}
