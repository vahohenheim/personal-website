import { describe, expect, it } from "vitest";
import { PAGE_IDS, PAGES } from "@/lib/constants/pages";
import { getPageTexts } from "@/lib/helpers/metadata";
import { LEAD_NEEDS, LEAD_STATUSES, LEAD_TIMELINES } from "@/lib/models/lead";
import en from "@/locales/en";
import fr from "@/locales/fr";

/** Every path of an object, to compare the shape of the two dictionaries. */
const keysOf = (value: unknown, prefix = ""): string[] =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, child]) => keysOf(child, `${prefix}${key}.`))
    : [prefix];

describe("dictionaries", () => {
  it("have the same keys in both languages", () => {
    expect(keysOf(fr).sort()).toEqual(keysOf(en).sort());
  });

  it("have a label for every need and every timeline of the form", () => {
    for (const dictionary of [fr, en]) {
      expect(Object.keys(dictionary.contact.need.options).sort()).toEqual([...LEAD_NEEDS].sort());
      expect(Object.keys(dictionary.contact.details.timelines).sort()).toEqual(
        [...LEAD_TIMELINES].sort(),
      );
    }
  });

  it("keep meta descriptions under 155 characters", () => {
    for (const dictionary of [fr, en]) {
      for (const page of PAGE_IDS) {
        const { title, description } = getPageTexts(page, dictionary);

        expect(title).not.toBe("");
        expect(description.length, `${page}: ${description}`).toBeLessThanOrEqual(155);
      }
    }
  });
});

describe("stored values", () => {
  // These are stored in the database: a rename would orphan existing rows.
  it("are never renamed", () => {
    expect(LEAD_NEEDS).toEqual(["architecture", "design-system", "quality", "tech-lead", "other"]);
    expect(LEAD_TIMELINES).toEqual(["asap", "one-to-three-months", "later", "unsure"]);
    expect(LEAD_STATUSES).toEqual(["new", "contacted", "quoted", "won", "lost", "closed"]);
  });
});

describe("page registry", () => {
  it("gives every page a path with slashes and coherent dates", () => {
    for (const page of PAGE_IDS) {
      const { path, createdAt, updatedAt } = PAGES[page];

      expect(path.startsWith("/") && path.endsWith("/")).toBe(true);
      expect(updatedAt >= createdAt).toBe(true);
    }
  });
});
