import { describe, expect, it } from "vitest";
import { parseRichText } from "@/lib/helpers/rich-text";
import { type LegalBlock, type LegalSection } from "@/lib/models/legal";
import en from "@/locales/en";
import fr from "@/locales/fr";
import { cgv } from "@/locales/legal/cgv.fr";
import { normalize, readLegalSource, readMarkdownSections } from "../helpers/legal";

/** Every unit of text of a section, in reading order, as `readMarkdownSections` gives them. */
const unitsOf = (blocks: LegalBlock[]): string[] =>
  blocks.flatMap((block) => {
    switch (block.type) {
      case "p":
        return [normalize(block.text)];
      case "ol":
      case "ul":
        return block.items.map(normalize);
      case "subsection":
        return [normalize(block.title), ...unitsOf(block.blocks)];
      case "processing":
        // In the source, a processing is a paragraph that opens with its name.
        return block.items.map((item) => normalize(`${item.title}. ${item.text}`));
      case "identity":
        return [];
    }
  });

/** Every anchor a section offers: its own and its subsections'. */
const anchorsOf = (sections: LegalSection[]) =>
  sections.flatMap((section) => [
    section.id,
    ...section.blocks.flatMap((block) => (block.type === "subsection" ? [block.id] : [])),
  ]);

/** Every link of a list of sections. */
const linksOf = (sections: LegalSection[]) => {
  const texts = (blocks: LegalBlock[]): string[] =>
    blocks.flatMap((block) => {
      switch (block.type) {
        case "p":
          return [block.text];
        case "ol":
        case "ul":
          return block.items;
        case "identity":
          return block.rows.map((row) => row.value);
        case "processing":
          return block.items.map((item) => item.text);
        case "subsection":
          return texts(block.blocks);
      }
    });

  return sections
    .flatMap((section) => texts(section.blocks))
    .flatMap(parseRichText)
    .flatMap((token) => (token.type === "link" ? [token.href] : []));
};

describe("general terms of service", () => {
  const source = readLegalSource("cgv.fr.md");

  it("are the source text, word for word, article by article", () => {
    const expected = readMarkdownSections(source);

    expect(cgv.sections.map((section) => normalize(section.title))).toEqual(
      expected.map((section) => section.title),
    );

    cgv.sections.forEach((section, index) => {
      expect(unitsOf(section.blocks), section.id).toEqual(expected[index].units);
    });
  });

  it("take the provider's identity from the source", () => {
    const header = normalize(source.split(/^## /m)[0]);

    for (const row of cgv.identity) {
      expect(header).toContain(normalize(row.value));
    }

    expect(header).toContain(normalize(cgv.designation));
  });

  it("number the articles art-01 to art-20 and emphasise 11 and 12 only", () => {
    expect(cgv.sections.map((section) => section.id)).toEqual(
      Array.from({ length: 20 }, (_, index) => `art-${String(index + 1).padStart(2, "0")}`),
    );
    expect(cgv.sections.filter((section) => section.emphasis).map(({ id }) => id)).toEqual([
      "art-11",
      "art-12",
    ]);
  });

  it("link every internal reference to an anchor that exists", () => {
    const anchors = anchorsOf(cgv.sections);
    const links = linksOf(cgv.sections);

    expect(links).toContain("#art-12-2");
    expect(links).toContain("/fr/legal/#sec-05");

    for (const href of links.filter((link) => link.startsWith("#"))) {
      expect(anchors).toContain(href.slice(1));
    }

    expect(fr.legal.sections.map((section) => section.id)).toContain("sec-05");
  });

  it("are the same French text on both languages of the site", () => {
    expect(en.cgv.terms).toBe(fr.cgv.terms);
  });
});

describe("legal notice", () => {
  const source = readMarkdownSections(readLegalSource("mentions-legales.fr.md"));
  const sections = fr.legal.sections;

  it("has the seven sections of the source, sec-01 to sec-07", () => {
    expect(sections.map((section) => section.title)).toEqual(
      source.map((section) => section.title),
    );
    expect(sections.map((section) => section.id)).toEqual(
      Array.from({ length: 7 }, (_, index) => `sec-0${index + 1}`),
    );
  });

  it("is the source text, word for word, outside the publisher's identity card", () => {
    sections.forEach((section, index) => {
      const units = unitsOf(section.blocks);
      const expected = source[index].units;

      if (section.id === "sec-01") {
        // The publisher's first paragraph stays; the following lines became the card.
        expect(units).toEqual([expected[0]]);
      } else {
        // In the personal data section, "E-mail" moved up into the list of processing.
        expect([...units].sort(), section.id).toEqual([...expected].sort());
      }
    });
  });

  it("puts in the publisher's card the facts of the source", () => {
    const publisher = source[0].units.join(" ");
    const card = sections[0].blocks.find((block) => block.type === "identity");

    expect(card?.type === "identity" && card.rows.map((row) => row.key)).toEqual([
      "siren",
      "siret du siège",
      "code ape",
      "tva",
      "adresse",
      "publication",
      "contact",
    ]);

    for (const fact of [
      "130 933 922",
      "130 933 922 00010",
      "62.02A, conseil en systèmes et logiciels informatiques",
      "non applicable, article 293 B du CGI",
      "520 route de Voivres, 72210 Fillé, France",
      "Directeur de la publication : Valentin Bourreau",
      "contact@valentinbourreau.com",
    ]) {
      expect(publisher).toContain(fact);
    }
  });

  it("keeps the blank of the e-invoicing platform visible until Valentin fills it", () => {
    const placeholders = (sectionsOf: LegalSection[]) =>
      JSON.stringify(sectionsOf).match(/\[\[[^\]]+\]\]/g);

    expect(placeholders(fr.legal.sections)).toEqual(["[[à compléter]]"]);
    expect(placeholders(en.legal.sections)).toEqual(["[[to be completed]]"]);
  });

  it("has the same structure and anchors in English", () => {
    const shape = (sectionsOf: LegalSection[]) =>
      sectionsOf.map((section) => ({
        id: section.id,
        number: section.number,
        blocks: section.blocks.map((block) =>
          block.type === "processing" || block.type === "identity"
            ? `${block.type}:${block.type === "processing" ? block.items.length : block.rows.length}`
            : block.type,
        ),
      }));

    expect(shape(en.legal.sections)).toEqual(shape(fr.legal.sections));
    expect(linksOf(en.legal.sections)).toEqual(
      linksOf(fr.legal.sections).map((href) => href.replace("/fr/", "/en/")),
    );
  });
});
