"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type TocEntry = { id: string; number: string; title: string };

type TocComponentProps = {
  entries: TocEntry[];
  /** Visible label on wide screens: "sommaire". */
  label: string;
  /** Summary of the folded list on phones: "sommaire · 20 articles". */
  summary: string;
  navLabel: string;
  /** The sticky column of wide screens, or the folded list of phones. */
  variant: "desktop" | "mobile";
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
 * The summary of a document (post, terms, legal notice, design system page), always on the
 * left of the text. On wide screens, a sticky column of 216 px whose current entry takes
 * the accent; on phones, a native `<details>` that folds again when a link is followed.
 * A client component for the scroll spy only. Written from scratch: shadcn's closest
 * pieces (Accordion, NavigationMenu) would ship client code a native `<details>` does not need.
 */
const TocComponent = ({
  entries,
  label,
  summary,
  navLabel,
  variant,
  className,
}: TocComponentProps) => {
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
                "type-small",
                variant === "desktop" ? "gap-2.5 py-1" : "min-h-10 items-center gap-3",
                isActive ? "font-medium text-accent" : "text-text2",
              )}
            >
              <span
                className={cn(
                  "font-mono",
                  "shrink-0 type-meta",
                  variant === "desktop" && "pt-0.5",
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
      <details ref={details} className={cn("border-b border-line", className)}>
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between type-label text-text [&::-webkit-details-marker]:hidden">
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
      className={cn("sticky top-6 w-[216px] shrink-0 flex-col gap-3", className)}
    >
      <p className="type-label font-medium text-muted">{label}</p>
      {links}
    </nav>
  );
};

export default TocComponent;
