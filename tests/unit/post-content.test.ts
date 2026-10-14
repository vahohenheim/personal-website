import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POST_BODIES } from "@/lib/constants/post-bodies";
import { POSTS } from "@/lib/constants/posts";
import {
  getSectionId,
  getTableOfContents,
  readJsxTags,
  resolvePostImage,
} from "@/lib/helpers/posts";
import { type Locale } from "@/lib/i18n/config";
import { POST_COMPONENTS } from "@/mdx-components";

// Checks the content of content/posts/ against the code: what an MDX file names must exist.

const versions = POSTS.flatMap((post) =>
  (Object.keys(post.versions) as Locale[]).map((locale) => ({ slug: post.slug, locale })),
);

const read = (slug: string, locale: Locale) =>
  readFileSync(join("content/posts", slug, `${locale}.mdx`), "utf8");

/** Width and height of a WebP file, read from its header. */
const webpSize = (path: string) => {
  const data = readFileSync(path);
  const chunk = data.toString("ascii", 12, 16);

  if (chunk === "VP8X") {
    return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
  }

  if (chunk === "VP8 ") {
    return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
  }

  const bits = data.readUInt32LE(21);

  return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
};

describe.each(versions)("post $slug ($locale)", ({ slug, locale }) => {
  const source = read(slug, locale);
  const tags = readJsxTags(source).filter((tag) => !tag.closing);

  it("has its body loader", () => {
    expect(POST_BODIES[slug]?.[locale]).toBeTypeOf("function");
  });

  it("only uses registered components", () => {
    const registered = Object.keys(POST_COMPONENTS);

    for (const tag of tags) {
      expect(registered, `<${tag.name}>`).toContain(tag.name);
    }
  });

  it("only references images that exist, both variants for a pair", () => {
    for (const tag of tags.filter(({ attributes }) => typeof attributes.src === "string")) {
      const image = resolvePostImage(tag.attributes.src as string);
      const files = image.kind === "pair" ? [image.light, image.dark] : [image.src];

      for (const file of files) {
        expect(existsSync(join("public", file)), file).toBe(true);
      }

      // The declared size must keep the proportions of the file (prepared at 2x).
      const { width, height } = tag.attributes;

      if (typeof width === "string" && typeof height === "string") {
        const declared = Number(width.slice(1, -1)) / Number(height.slice(1, -1));
        const actual = webpSize(join("public", files[0]));

        expect(Math.abs(declared - actual.width / actual.height), files[0]).toBeLessThan(0.01);
      }
    }
  });

  it("gives every image a text alternative and every diagram a caption", () => {
    for (const tag of tags.filter(({ name }) => ["Screen", "Shot", "Diagram"].includes(name))) {
      expect(tag.attributes.alt, `<${tag.name}>`).toBeTypeOf("string");
    }

    for (const tag of tags.filter(({ name }) => name === "Diagram")) {
      expect(tag.attributes.caption).toBeTypeOf("string");
    }
  });

  it("has unique section anchors", () => {
    const ids = getTableOfContents(source).map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id === getSectionId(id))).toBe(true);
  });
});

describe("registry", () => {
  it("has a body file and a registry entry for every MDX file", () => {
    const folders = readdirSync("content/posts", { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(folders.sort()).toEqual(POSTS.map((post) => post.slug).sort());
  });

  it("points every listed image of the body to an existing image of the post", () => {
    for (const post of POSTS) {
      for (const image of post.images ?? []) {
        expect(image.src.startsWith(`/posts/${post.slug}/`), image.src).toBe(true);
        expect(existsSync(join("public", image.src)), image.src).toBe(true);
        expect(webpSize(join("public", image.src)), image.src).toEqual({
          width: image.width,
          height: image.height,
        });
      }
    }
  });

  it("points every cover to an existing image of the post", () => {
    for (const post of POSTS.filter(({ cover }) => cover)) {
      expect(post.cover?.src.startsWith(`/posts/${post.slug}/`)).toBe(true);
      expect(existsSync(join("public", post.cover?.src ?? ""))).toBe(true);
      expect(post.cover && webpSize(join("public", post.cover.src))).toEqual({
        width: post.cover?.width,
        height: post.cover?.height,
      });
    }
  });
});
