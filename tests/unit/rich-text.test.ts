import { describe, expect, it } from "vitest";
import { parseRichText, toPlainText } from "@/lib/helpers/rich-text";

describe("rich text of the legal documents", () => {
  it("reads links, strong words and names, in order", () => {
    expect(
      parseRichText("**Base.** See [article 14](#art-14) and a `NEXT_LOCALE` cookie."),
    ).toEqual([
      { type: "strong", text: "Base." },
      { type: "text", text: " See " },
      { type: "link", text: "article 14", href: "#art-14" },
      { type: "text", text: " and a " },
      { type: "code", text: "NEXT_LOCALE" },
      { type: "text", text: " cookie." },
    ]);
  });

  it("leaves a text without marks, or with incomplete ones, as it is", () => {
    expect(parseRichText("Plain text.")).toEqual([{ type: "text", text: "Plain text." }]);
    expect(parseRichText("A [bracket], [[two]] and a * star")).toEqual([
      { type: "text", text: "A [bracket], [[two]] and a * star" },
    ]);
    expect(parseRichText("")).toEqual([]);
  });

  it("gives the text a reader sees", () => {
    expect(toPlainText("Les articles [10](#art-10) et **régie**\u00a0: `NEXT_LOCALE`")).toBe(
      "Les articles 10 et régie\u00a0: NEXT_LOCALE",
    );
  });
});
