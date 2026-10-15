import { type RichText } from "@/lib/models/legal";

export type RichTextToken =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "strong"; text: string }
  | { type: "code"; text: string }
  | { type: "placeholder"; text: string };

// One alternative per mark, tried left to right. A placeholder `[[…]]` comes before a link
// `[…](…)`, so that its opening brackets are not read as the start of a link.
const MARKS = /\[\[[^\]]+\]\]|\[([^\]]+)\]\(([^)\s]+)\)|\*\*[^*]+\*\*|`[^`]+`/g;

/**
 * Splits a text of `locales/legal/` into plain text and its inline marks (see `RichText`).
 * Marks do not nest: the texts never need it. Anything that is not a complete mark stays
 * plain text.
 */
export const parseRichText = (value: RichText): RichTextToken[] => {
  const tokens: RichTextToken[] = [];
  let last = 0;

  for (const match of value.matchAll(MARKS)) {
    const [whole, linkText, href] = match;

    if (match.index > last) {
      tokens.push({ type: "text", text: value.slice(last, match.index) });
    }

    // The opening characters tell the marks apart; the inner text drops them.
    if (whole.startsWith("[[")) {
      tokens.push({ type: "placeholder", text: whole.slice(1, -1) });
    } else if (whole.startsWith("[")) {
      tokens.push({ type: "link", text: linkText, href });
    } else if (whole.startsWith("**")) {
      tokens.push({ type: "strong", text: whole.slice(2, -2) });
    } else {
      tokens.push({ type: "code", text: whole.slice(1, -1) });
    }

    last = match.index + whole.length;
  }

  if (last < value.length) {
    tokens.push({ type: "text", text: value.slice(last) });
  }

  return tokens;
};

/** The text a reader sees, without the marks. Used by the tests that compare the texts. */
export const toPlainText = (value: RichText) =>
  parseRichText(value)
    .map((token) => token.text)
    .join("");
