"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type LegalTocEntry = { id: string; number: string; title: string };

type LegalTocComponentProps = {
  entries: LegalTocEntry[];
  /** Visible label on wide screens: "sommaire". */
  label: string;
  /** Summary of the folded list on phones: "sommaire · 20 articles". */
  summary: string;
  navLabel: string;
  /** The sticky column of wide screens, or the folded list of phones. */
  variant: "desktop" | "mobile";
  /** Set when the entries are in another language than the page. */
  lang?: string;
  className?: string;
};

/**
 * Follows the section being read: the one crossing a band at 20 to 30 % of the window.
 * The ids are joined so that the effect only runs again when the list really changes.
 */
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState<string>();
  const key = ids.join(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) {
            setActive(record.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const id of key.split(" ")) {
      const section = document.getElementById(id);

      if (section) {
        observer.observe(section);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [key]);

  return active;
};

/**
 * Summary of a legal document. On wide screens, a sticky column whose current entry takes
 * the accent; on phones, a native `<details>` that folds again when a link is followed.
 * A client component for the scroll spy only. Written from scratch: shadcn's closest
 * pieces (Accordion, NavigationMenu) would ship client code a native `<details>` does not need.
 */
const LegalTocComponent = ({
  entries,
  label,
  summary,
  navLabel,
  variant,
  lang,
  className,
}: LegalTocComponentProps) => {
  const active = useActiveSection(entries.map((entry) => entry.id));
  const details = useRef<HTMLDetailsElement>(null);

  const links = (
    <ol className={cn("flex list-none flex-col", variant === "mobile" && "mb-4")}>
      {entries.map((entry) => {
        const isActive = entry.id === active;

        return (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                if (details.current) {
                  details.current.open = false;
                }
              }}
              className={cn(
                "flex no-underline hover:text-accent",
                variant === "desktop"
                  ? "gap-2.5 py-1 text-[14px] leading-[1.45]"
                  : "min-h-10 items-center gap-3 text-[15px]",
                isActive ? "font-medium text-accent" : "text-text2",
              )}
            >
              <span
                className={cn(
                  "font-mono",
                  variant === "desktop" ? "pt-px text-[12px]" : "text-[13px]",
                  isActive ? "text-accent" : "text-muted",
                )}
              >
                {entry.number}
              </span>
              {/* Read between the number and the title; a flex gap draws the space. */}{" "}
              {entry.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "mobile") {
    return (
      <details ref={details} lang={lang} className={cn("border-b border-line", className)}>
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between font-mono text-[13px] text-text [&::-webkit-details-marker]:hidden">
          <span>{summary}</span>
          <span aria-hidden className="text-muted">
            +
          </span>
        </summary>
        <nav aria-label={navLabel}>{links}</nav>
      </details>
    );
  }

  return (
    <nav
      aria-label={navLabel}
      lang={lang}
      className={cn("sticky top-6 w-[248px] shrink-0 flex-col gap-3 pt-8", className)}
    >
      <p className="font-mono text-[12px] text-muted">{label}</p>
      {links}
    </nav>
  );
};

export default LegalTocComponent;
