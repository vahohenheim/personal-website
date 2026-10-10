import { readFile } from "node:fs/promises";
import { join } from "node:path";

const FONTS = join(process.cwd(), "node_modules/geist/dist/fonts");

/** Geist files for images generated at build time (Open Graph image, icons). */
export const loadGeist = (file: "Geist-SemiBold" | "Geist-Bold") =>
  readFile(join(FONTS, "geist-sans", `${file}.ttf`));

export const loadGeistMono = () => readFile(join(FONTS, "geist-mono", "GeistMono-Regular.ttf"));
