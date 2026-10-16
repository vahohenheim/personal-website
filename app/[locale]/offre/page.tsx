import type { Metadata } from "next";
import Link from "next/link";
import { type ReactNode } from "react";
import AchievementListComponent from "@/components/achievement-list/achievement-list";
import ContactTriggerComponent from "@/components/contact/contact-trigger";
import DocumentLayoutComponent from "@/components/document-layout/document-layout";
import FactGridComponent from "@/components/fact-grid/fact-grid";
import JsonLdComponent from "@/components/json-ld/json-ld";
import KeyValueComponent from "@/components/key-value/key-value";
import LogEntryComponent from "@/components/log-entry/log-entry";
import NumberedSectionComponent from "@/components/numbered-section/numbered-section";
import PageHeaderComponent from "@/components/page-header/page-header";
import PageNavComponent from "@/components/page-nav/page-nav";
import PostPlusListComponent, {
  PostPlusComponent,
} from "@/components/post-plus-list/post-plus-list";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import StatusDotComponent from "@/components/status-dot/status-dot";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { DAY_RATES, SERVICES } from "@/lib/constants/offer";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { formatPrice } from "@/lib/helpers/offer";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { type DayRateId, type OfferSectionId } from "@/lib/models/offer";
import { cn } from "@/lib/utils/cn";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("offre");

/** The sections of the page, in order: their ids are `sec-01` to `sec-05`. */
const SECTIONS: OfferSectionId[] = ["positioning", "services", "rates", "method", "contact"];

const DAY_RATE_IDS: DayRateId[] = ["reference", "urgent"];

const toNumber = (index: number) => `${index + 1}`.padStart(2, "0");

/**
 * The services and their prices, on the document template: the summary on the left, five
 * numbered sections (positioning, services as changelog entries, rates, way of working,
 * contact), then the terms of service as the page to read next.
 */
export default async function OffrePage() {
  const locale = await getLocale();
  const { offre, a11y, contact, footer, cgv } = await getDictionary();
  const entries = SECTIONS.map((id, index) => ({
    id: `sec-${toNumber(index)}`,
    number: toNumber(index),
    title: offre.sections[id].title,
  }));

  const bodies: Record<OfferSectionId, ReactNode> = {
    positioning: (
      <>
        <p className="max-w-[68ch] type-body">{offre.positioning.text}</p>
        <KeyValueComponent rows={offre.positioning.card} />
      </>
    ),
    services: (
      <ol className="list-none">
        {SERVICES.map((service, index) => {
          const texts = offre.services[service.id];

          return (
            <LogEntryComponent
              key={service.id}
              date={`${toNumber(index)} · ${texts.code}`}
              detail={texts.billing}
              title={texts.title}
            >
              <p className="max-w-[64ch] type-body text-text2">{texts.text}</p>
              <AchievementListComponent items={texts.deliverables} />
              <FactGridComponent
                className="mt-1"
                facts={[
                  ...(texts.detail ? [texts.detail] : []),
                  ...service.options.map((option) => ({
                    label: texts.prices[option.id] ?? option.id,
                    value: formatPrice(option.price, locale, offre.price),
                  })),
                ]}
              />
            </LogEntryComponent>
          );
        })}
      </ol>
    ),
    rates: (
      <>
        <div className="min-w-0 overflow-hidden rounded border border-line">
          {/* Scrolls sideways on phones: reachable with the keyboard, then with the arrows. */}
          <Table className="min-w-[520px]" containerProps={{ tabIndex: 0 }}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col">{offre.rates.columns.plan}</TableHead>
                <TableHead scope="col">{offre.rates.columns.rate}</TableHead>
                <TableHead scope="col">{offre.rates.columns.billing}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DAY_RATE_IDS.map((id) => (
                <TableRow key={id} className="hover:bg-transparent">
                  <TableCell className="font-medium text-text">
                    {offre.rates.days[id].label}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-text tabular-nums">
                    {formatPrice(
                      { type: "fixed", amount: DAY_RATES[id], unit: "day" },
                      locale,
                      offre.price,
                    )}
                  </TableCell>
                  <TableCell className="text-text2">{offre.rates.days[id].billing}</TableCell>
                </TableRow>
              ))}
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-medium text-text">
                  {offre.rates.packages.label}
                </TableCell>
                <TableCell className="whitespace-nowrap text-text">
                  {offre.rates.packages.value}
                </TableCell>
                <TableCell className="text-text2">{offre.rates.packages.billing}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="type-meta text-muted">{offre.rates.vat}</p>
      </>
    ),
    method: (
      <PostPlusListComponent>
        {offre.method.map((item) => (
          <PostPlusComponent key={item.title} title={item.title}>
            {item.text}
          </PostPlusComponent>
        ))}
      </PostPlusListComponent>
    ),
    contact: (
      <>
        <p className="max-w-[68ch] type-body">{offre.contact.text}</p>
        <div className="flex flex-wrap gap-3">
          <ContactTriggerComponent
            href={`mailto:${MAIL_ADDRESS}`}
            variant="primary"
            sentText={contact.sent.text}
            againText={contact.sent.again}
          >
            {offre.contact.cta}
          </ContactTriggerComponent>
        </div>
      </>
    ),
  };

  return (
    <>
      <main id="main" className="container-page">
        <JsonLdComponent page="offre" />

        <PageHeaderComponent
          breadcrumb={{
            label: a11y.breadcrumb,
            homeHref: `/${locale}/`,
            trail: [{ label: offre.breadcrumb }],
          }}
          title={offre.title}
          lead={offre.lead}
          meta={
            <ul className="flex list-none flex-wrap items-center gap-x-4 gap-y-1 type-label text-muted">
              <li className="flex items-center gap-2">
                <StatusDotComponent />
                {offre.meta.status}
              </li>
              <li>{offre.meta.remote}</li>
              <li>{offre.meta.vat}</li>
            </ul>
          }
        >
          <div className="flex flex-wrap gap-3">
            <ContactTriggerComponent
              href={`mailto:${MAIL_ADDRESS}`}
              variant="primary"
              sentText={contact.sent.text}
              againText={contact.sent.again}
            >
              {offre.actions.contact}
            </ContactTriggerComponent>
            <Button asChild variant="secondary">
              <Link href={`/${locale}/resume/`}>{offre.actions.resume}</Link>
            </Button>
          </div>
        </PageHeaderComponent>

        <DocumentLayoutComponent
          entries={entries}
          toc={{
            label: offre.toc.label,
            summary: offre.toc.summary.replace("{count}", `${entries.length}`),
            navLabel: offre.toc.navLabel,
          }}
        >
          {SECTIONS.map((id, index) => (
            <NumberedSectionComponent
              key={id}
              id={entries[index].id}
              number={entries[index].number}
              label={offre.sections[id].label}
              title={offre.sections[id].title}
              anchorLabel={offre.anchor.replace("{title}", offre.sections[id].title)}
              className={cn(
                "py-10",
                index === 0 && "pt-0",
                index < SECTIONS.length - 1 && "border-b border-line",
              )}
            >
              {bodies[id]}
            </NumberedSectionComponent>
          ))}
        </DocumentLayoutComponent>

        <PageNavComponent
          label={a11y.pageNav}
          next={{ eyebrow: footer.seeAlso, title: cgv.title, href: `/${locale}/cgv/` }}
        />
      </main>
      <SiteFooterComponent />
    </>
  );
}
