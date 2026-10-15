import { describe, expect, it } from "vitest";
import { parseRichText, toPlainText } from "@/lib/helpers/rich-text";

describe("rich text of the legal documents", () => {
  it("reads links, strong words, names and placeholders, in order", () => {
    expect(
      parseRichText(
        "**Base.** See [article 14](#art-14), a `NEXT_LOCALE` cookie and [[à compléter]].",
      ),
    ).toEqual([
      { type: "strong", text: "Base." },
      { type: "text", text: " See " },
      { type: "link", text: "article 14", href: "#art-14" },
      { type: "text", text: ", a " },
      { type: "code", text: "NEXT_LOCALE" },
      { type: "text", text: " cookie and " },
      { type: "placeholder", text: "[à compléter]" },
      { type: "text", text: "." },
    ]);
  });

  it("leaves a text without marks, or with incomplete ones, as it is", () => {
    expect(parseRichText("Plain text.")).toEqual([{ type: "text", text: "Plain text." }]);
    expect(parseRichText("A [bracket] and a * star")).toEqual([
      { type: "text", text: "A [bracket] and a * star" },
    ]);
    expect(parseRichText("")).toEqual([]);
  });

  it("gives the text a reader sees", () => {
    expect(toPlainText("Les articles [10](#art-10) et **régie**\u00a0: [[à compléter]]")).toBe(
      "Les articles 10 et régie\u00a0: [à compléter]",
    );
  });
});
