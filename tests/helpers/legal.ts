import { readFileSync } from "node:fs";
import { toPlainText } from "@/lib/helpers/rich-text";

/** The texts Valentin handed over, kept in the repository as the reference. */
export const readLegalSource = (name: "cgv.fr.md" | "cgv.en.md" | "mentions-legales.fr.md") =>
  readFileSync(`docs/legal-handoff/content/${name}`, "utf8");

/**
 * TODO(e-invoicing): the sentence of the legal notice withheld from the page until Valentin
 * has chosen his e-invoicing platform. The tests compare the page with the source minus
 * this sentence; remove the constant when the sentence is back.
 */
export const WITHHELD_FROM_NOTICE =
  "Les factures transitent par la plateforme de facturation électronique agréée [à compléter] et peuvent être transmises à l’administration fiscale, comme la loi l’exige. ";

/**
 * A text as a reader compares it: marks removed, non-breaking and narrow spaces read as
 * plain spaces (the source files have none; the site adds them), spaces collapsed.
 */
export const normalize = (text: string) =>
  toPlainText(text)
    .replace(/[\u00a0\u202f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The units of a Markdown source, per `## ` section: its title, then every paragraph,
 * list item and `### ` subtitle, normalised. The HTML comment at the top is left out.
 */
export const readMarkdownSections = (markdown: string) =>
  markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [title, ...lines] = chunk.split("\n");
      const units = lines
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .map((line) =>
          normalize(
            line
              .replace(WITHHELD_FROM_NOTICE, "")
              .replace(/^### \d+\.\d+ /, "")
              .replace(/^(?:\d+\.|-) /, ""),
          ),
        );

      return { title: normalize(title.replace(/^\d+\. /, "")), units };
    });
