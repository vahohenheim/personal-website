import { describe, expect, it } from "vitest";
import { parseRichText } from "@/lib/helpers/rich-text";
import { type LegalBlock, type LegalSection } from "@/lib/models/legal";
import en from "@/locales/en";
import fr from "@/locales/fr";
import { cgv as cgvEn } from "@/locales/legal/cgv.en";
import { cgv as cgvFr } from "@/locales/legal/cgv.fr";
import {
  normalize,
  readLegalSource,
  readMarkdownSections,
  WITHHELD_FROM_NOTICE,
} from "../helpers/legal";

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

/** The skeleton of a document: anchors, numbers, emphasis and block types, not the words. */
const shapeOf = (sections: LegalSection[]) => {
  const blocks = (list: LegalBlock[]): unknown[] =>
    list.map((block) => {
      switch (block.type) {
        case "subsection":
          return { id: block.id, number: block.number, blocks: blocks(block.blocks) };
        case "ol":
        case "ul":
          return `${block.type}:${block.items.length}`;
        case "processing":
          return `processing:${block.items.length}`;
        case "identity":
          return `identity:${block.rows.length}`;
        case "p":
          return "p";
      }
    });

  return sections.map((section) => ({
    id: section.id,
    number: section.number,
    emphasis: section.emphasis === true,
    blocks: blocks(section.blocks),
  }));
};

const TERMS = [
  { locale: "fr", source: "cgv.fr.md", terms: cgvFr },
  { locale: "en", source: "cgv.en.md", terms: cgvEn },
] as const;

describe.each(TERMS)("general terms of service in $locale", ({ locale, source, terms }) => {
  const markdown = readLegalSource(source);

  it("are the source text, word for word, article by article", () => {
    const expected = readMarkdownSections(markdown);

    expect(terms.sections.map((section) => normalize(section.title))).toEqual(
      expected.map((section) => section.title),
    );

    terms.sections.forEach((section, index) => {
      expect(unitsOf(section.blocks), section.id).toEqual(expected[index].units);
    });
  });

  it("take the provider's identity from the source", () => {
    const header = normalize(markdown.split(/^## /m)[0]);

    for (const row of terms.identity) {
      expect(header).toContain(normalize(row.value));
    }

    expect(header).toContain(normalize(terms.designation));
  });

  it("number the articles art-01 to art-20 and emphasise 11 and 12 only", () => {
    expect(terms.sections.map((section) => section.id)).toEqual(
      Array.from({ length: 20 }, (_, index) => `art-${String(index + 1).padStart(2, "0")}`),
    );
    expect(terms.sections.filter((section) => section.emphasis).map(({ id }) => id)).toEqual([
      "art-11",
      "art-12",
    ]);
  });

  it("link every internal reference to an anchor that exists", () => {
    const anchors = anchorsOf(terms.sections);
    const links = linksOf(terms.sections);

    expect(links).toContain("#art-12-2");
    expect(links).toContain(`/${locale}/legal/#sec-05`);

    for (const href of links.filter((link) => link.startsWith("#"))) {
      expect(anchors).toContain(href.slice(1));
    }

    expect(fr.legal.sections.map((section) => section.id)).toContain("sec-05");
  });

  it("are the terms of the page in that language", () => {
    expect({ fr, en }[locale].cgv.terms).toBe(terms);
  });
});

describe("English terms of service", () => {
  it("have the structure, anchors and links of the French original", () => {
    expect(shapeOf(cgvEn.sections)).toEqual(shapeOf(cgvFr.sections));
    expect(linksOf(cgvEn.sections)).toEqual(
      linksOf(cgvFr.sections).map((href) => href.replace("/fr/", "/en/")),
    );
    expect(cgvEn.identity.map((row) => row.value)).toEqual(
      cgvFr.identity.map((row) =>
        row.value.replace(
          "entrepreneur individuel (EI)",
          "sole proprietor (entrepreneur individuel, EI)",
        ),
      ),
    );
  });

  it("say on the page and in the source that the French version prevails", () => {
    const header = normalize(readLegalSource("cgv.en.md").split(/^## /m)[0]);

    expect(header).toContain(normalize(en.cgv.notice));
    expect(normalize(en.cgv.notice)).toContain("the French version prevails");
    expect(fr.cgv.notice).toBe("");
  });

  it("call article 5 the Client obligations, Client with a capital C in French", () => {
    expect(cgvFr.sections[4].title).toBe("Obligations du Client");
    expect(cgvEn.sections[4].title).toBe("Client obligations");
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

  it("withholds the e-invoicing sentence in both languages until Valentin chooses the tool", () => {
    // TODO(e-invoicing): when the sentence is back, check it here instead.
    for (const dictionary of [fr, en]) {
      const text = JSON.stringify(dictionary.legal.sections);

      expect(text).not.toMatch(
        /facturation électronique|e-invoicing|\[\[|compléter|to be completed/,
      );
    }

    expect(readLegalSource("mentions-legales.fr.md")).toContain(WITHHELD_FROM_NOTICE.trim());
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
