import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { SHOWN_FILES, SKIPPED_FILES } from "@/app/admin/design-system/coverage";

const COMPONENTS = join(process.cwd(), "components");
const REGISTRY = join(process.cwd(), "app/admin/design-system/_components/registry.tsx");

/** Every `.tsx` file under components/, as `folder/name`. */
const listComponentFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listComponentFiles(path);
    }

    return entry.name.endsWith(".tsx") ? [relative(COMPONENTS, path).replace(/\.tsx$/, "")] : [];
  });

describe("design system page (/admin/design-system/)", () => {
  const files = listComponentFiles(COMPONENTS).sort();
  const shown: string[] = [...SHOWN_FILES];
  const skipped = Object.keys(SKIPPED_FILES);

  it("shows every component file, or says why it does not", () => {
    expect([...shown, ...skipped].sort()).toEqual(files);
  });

  it("lists a file once, either shown or skipped", () => {
    expect(shown.filter((file) => skipped.includes(file))).toEqual([]);
    expect(new Set(shown).size).toBe(shown.length);
  });

  it("gives every skipped file a reason", () => {
    for (const reason of Object.values(SKIPPED_FILES)) {
      expect(reason.trim()).not.toBe("");
    }
  });

  it("has a specimen for every file it says it shows", () => {
    const registry = readFileSync(REGISTRY, "utf8");
    const onThePage = ["page-header/page-header", "document-layout/document-layout"];

    for (const file of shown) {
      expect(registry.includes(`"${file}"`) || onThePage.includes(file), file).toBe(true);
    }
  });
});
