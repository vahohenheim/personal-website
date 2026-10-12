import type { Metadata } from "next";
import Image from "next/image";
import { type ReactNode } from "react";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { AVATAR_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type ProfileRow } from "@/lib/models/content";

// Only there to be printed to public/cv-<locale>.pdf by `npm run cv:pdf`: kept out of search engines.
export const metadata: Metadata = {
  title: `${SITE_NAME} · cv`,
  robots: { index: false, follow: false },
};

const SITE_HOST = new URL(SITE_URL).host.replace(/^www\./, "");

/** Title of a block, in mono: `// stack`. */
const BlockTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="font-mono text-[8.5pt] leading-[14pt] font-medium text-muted">
    {"// "}
    {children}
  </h2>
);

/** Key in mono above its value: the narrow column has no room for two columns. */
const StackedRows = ({ rows }: { rows: ProfileRow[] }) => (
  <dl className="flex flex-col gap-[2mm]">
    {rows.map((row) => (
      <div key={`${row.key}-${row.value}`}>
        <dt className="font-mono text-[7.5pt] leading-[11pt] text-accent">{row.key}</dt>
        <dd className="text-[8.5pt] leading-[11.5pt] text-text2">{row.value}</dd>
      </div>
    ))}
  </dl>
);

/**
 * The resume on one A4 sheet, as the design charter describes it: day mode, a header with
 * the portrait and the wordmark, then a 40 mm column (stack, education, languages) and a
 * 120 mm column (the changelog). Sizes are in mm and pt because the page is made for paper.
 */
export default async function ResumePrintPage() {
  const { resume } = await getDictionary();

  return (
    <main className="resume-sheet">
      <header className="flex items-start gap-[6mm]">
        <Image
          src={AVATAR_PATH}
          alt=""
          width={166}
          height={166}
          className="size-[22mm] shrink-0 rounded-photo object-cover"
          preload
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[1.5mm]">
          <div className="flex items-baseline justify-between gap-[6mm]">
            <p className="text-[13pt] leading-none font-bold tracking-[-0.02em]">
              valentinbourreau
            </p>
            <p className="font-mono text-[8.5pt] leading-none text-muted">
              {MAIL_ADDRESS} · {SITE_HOST}
            </p>
          </div>
          <h1 className="text-[28pt] leading-none font-semibold tracking-[-0.04em]">
            {resume.title}
          </h1>
          <p className="font-mono text-[8.5pt] leading-[12pt] text-muted">
            <span className="text-text">{SITE_NAME}</span>
            {" · "}
            <span className="text-accent">● {resume.meta.status}</span>
            {" · "}
            {resume.meta.since}
            {" · "}
            {resume.meta.location}
          </p>
        </div>
      </header>

      <p className="pt-[5mm] text-[9.5pt] leading-[13pt] text-text2">{resume.summary}</p>

      <div className="grid grid-cols-[40mm_120mm] gap-x-[10mm] pt-[5mm]">
        <aside className="flex flex-col gap-[5mm]">
          <div className="flex flex-col gap-[1.5mm]">
            <BlockTitle>{resume.stack.title}</BlockTitle>
            <StackedRows rows={resume.stack.rows} />
          </div>
          <div className="flex flex-col gap-[1.5mm]">
            <BlockTitle>{resume.education.title}</BlockTitle>
            <StackedRows rows={resume.education.rows} />
          </div>
          <div className="flex flex-col gap-[1.5mm]">
            <BlockTitle>{resume.languages.title}</BlockTitle>
            <StackedRows rows={resume.languages.rows} />
          </div>
        </aside>

        <div className="flex flex-col gap-[1.5mm]">
          <BlockTitle>{resume.changelog.title}</BlockTitle>
          <ul className="flex list-none flex-col">
            {resume.changelog.entries.map((entry) => (
              <li
                key={entry.date}
                className="flex flex-col gap-[1mm] border-t border-line py-[2.5mm] first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline justify-between gap-[4mm]">
                  <h3 className="text-[11pt] leading-[14pt] font-semibold tracking-[-0.01em]">
                    {entry.title}
                    {entry.company && (
                      <span className="font-normal text-muted"> · {entry.company}</span>
                    )}
                  </h3>
                  <p
                    className={
                      entry.current
                        ? "font-mono text-[8pt] whitespace-nowrap text-accent"
                        : "font-mono text-[8pt] whitespace-nowrap text-muted"
                    }
                  >
                    {entry.date}
                  </p>
                </div>
                {entry.roles && (
                  <p className="font-mono text-[7.5pt] leading-[11pt] text-muted">
                    {entry.roles.join(" → ")}
                  </p>
                )}
                {entry.text && (
                  <p className="text-[9.5pt] leading-[13pt] text-text2">{entry.text}</p>
                )}
                {entry.achievements && (
                  <ul className="flex list-none flex-col">
                    {entry.achievements.map((item) => (
                      <li
                        key={item}
                        className="flex gap-[2mm] text-[9.5pt] leading-[13pt] text-text2"
                      >
                        <span aria-hidden className="font-mono text-accent">
                          +
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {entry.earlier && (
                  <ul className="flex list-none flex-col">
                    {entry.earlier.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-baseline justify-between gap-[4mm] text-[9.5pt] leading-[13pt] text-text2"
                      >
                        <span>{item.label}</span>
                        <span className="font-mono text-[8pt] text-muted">{item.years}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
