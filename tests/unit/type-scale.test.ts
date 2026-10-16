import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

// The resume sheet is printed in points, and the sharing images are drawn by `next/og`:
// both keep their own sizes. See docs/frontend/styling.md#type-scale.
const EXCEPTIONS = [
  /^app\/\[locale\]\/resume\/print\//,
  /opengraph-image\.tsx$/,
  /apple-icon\.tsx$/,
];

const listSources = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listSources(path);
    }

    return /\.(tsx|ts)$/.test(entry.name) ? [relative(ROOT, path)] : [];
  });

const SOURCES = [
  ...listSources(join(ROOT, "app")),
  ...listSources(join(ROOT, "components")),
  "mdx-components.tsx",
].filter((file) => !EXCEPTIONS.some((pattern) => pattern.test(file)));

// A size written by hand (`text-[19px]`, `text-[clamp(…)]`, `text-[1rem]`), or a size of
// Tailwind's default scale (`text-sm`), which the site does not use. A size relative to
// the parent (`text-[0.85em]`, inline code) is allowed.
const HARD_SIZE = /\btext-\[(?![\d.]+em\])[^\]]*\]|\btext-(?:xs|sm|base|lg|[2-9]?xl)\b/g;

describe("type scale", () => {
  it("sets every font size with a `type-*` style, never by hand", () => {
    const offenders = SOURCES.flatMap((file) =>
      (readFileSync(join(ROOT, file), "utf8").match(HARD_SIZE) ?? []).map(
        (match) => `${file}: ${match}`,
      ),
    );

    expect(offenders).toEqual([]);
  });

  it("declares the nine screen styles and the compact title in app/globals.css", () => {
    const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
    const styles = [...css.matchAll(/@utility (type-[a-z-]+)/g)].map((match) => match[1]);

    expect(styles).toEqual([
      "type-display",
      "type-display-compact",
      "type-title",
      "type-subhead",
      "type-quote",
      "type-lead",
      "type-body",
      "type-small",
      "type-label",
      "type-meta",
    ]);
  });
});
