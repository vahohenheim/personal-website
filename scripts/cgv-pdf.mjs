// Prints the general terms of service of one language to public/cgv/ as an A4 PDF.
//
//   npm run cgv:pdf -- en
//
// Reads docs/legal-handoff/content/cgv.<locale>.md (the single source of the terms, shared
// with lotus), lays it out like the French PDF of version 1.0 (A4, 20 mm margins, Geist
// and Geist Mono, a running header and footer, the articles in two columns at 8.5 pt),
// paginates it in the browser and asks a local Chrome to print it. Writes
// public/cgv/cgp-<version>.pdf in French and cgp-<version>-<locale>.pdf otherwise, and
// never replaces a file: a signed quote refers to a version, so a version is printed once.
// Fails when something overflows a page. CHROME_PATH overrides where Chrome is looked for.
// See docs/features/legal-pages.md.

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const LABELS = {
  fr: {
    title: "Conditions générales de prestation",
    first: "valentinbourreau",
    next: "valentinbourreau · suite",
    last: "valentinbourreau · fin",
    range: (from, to) => (from === to ? `article ${from}` : `articles ${from} à ${to}`),
    continued: (range, page) => `suite des ${range} → page ${page}`,
    footer: (version, page, total) =>
      `valentinbourreau — EI — SIREN 130\u202f933\u202f922 — CGP version ${version} — page ${page}/${total}`,
  },
  en: {
    title: "General terms of service",
    first: "valentinbourreau",
    next: "valentinbourreau · continued",
    last: "valentinbourreau · end",
    range: (from, to) => (from === to ? `article ${from}` : `articles ${from} to ${to}`),
    continued: (range, page) => `${range} continue → page ${page}`,
    footer: (version, page, total) =>
      `valentinbourreau — EI — SIREN 130\u202f933\u202f922 — Terms version ${version} — page ${page}/${total}`,
  },
};

const locale = process.argv[2] ?? "en";
const labels = LABELS[locale];

if (!labels) {
  console.error(`Unknown locale "${locale}". Use one of: ${Object.keys(LABELS).join(", ")}.`);
  process.exit(1);
}

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

const chrome = CHROME_CANDIDATES.find((path) => path && existsSync(path));

if (!chrome) {
  console.error("Chrome was not found. Set CHROME_PATH to its executable.");
  process.exit(1);
}

const source = readFileSync(`docs/legal-handoff/content/cgv.${locale}.md`, "utf8");

// "Version 1.0, en vigueur au 15 octobre 2026." / "Version 1.0, in force from 15 October 2026."
const versionLine = /^Version (\d+\.\d+), (.+)\.$/m.exec(source);

if (!versionLine) {
  console.error("The version line was not found in the source.");
  process.exit(1);
}

const [, version, inForce] = versionLine;
const output = `public/cgv/cgp-${version}${locale === "fr" ? "" : `-${locale}`}.pdf`;

if (existsSync(output)) {
  console.error(`${output} already exists: a printed version is never replaced.`);
  process.exit(1);
}

// --- Text ------------------------------------------------------------------------------

const NB = "\u00a0";
const NNB = "\u202f";

/** The typography the site adds to the source: non-breaking spaces where they belong. */
const typography = (text) => {
  let result = text
    .replace(/130 933 922 00010/g, `130${NNB}933${NNB}922${NNB}00010`)
    .replace(/130 933 922/g, `130${NNB}933${NNB}922`);

  if (locale === "fr") {
    result = result
      .replace(/ ([:;!?])/g, `${NB}$1`)
      .replace(/« /g, `«${NB}`)
      .replace(/ »/g, `${NB}»`)
      .replace(/(\d) (jours|heures|points|€|%|B du)/g, `$1${NB}$2`);
  } else {
    result = result.replace(/(\d) (days|hours|working days|percentage points|B of)/g, `$1${NB}$2`);
  }

  return result;
};

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const strong = (text) => `<strong>${text}</strong>`;

/** Escapes a line of the source, then draws its `**strong**` marks. */
const inline = (text) =>
  escape(typography(text)).replace(/\*\*([^*]+)\*\*/g, (_, inner) => strong(inner));

const [head, ...chunks] = source.split(/^## /m);

// The header: everything after the version line, one paragraph per blank-line block.
const intro = head
  .split(versionLine[0])[1]
  .trim()
  .split(/\n\s*\n/)
  .map((block) => `<p>${inline(block.replace(/\n/g, " "))}</p>`);

/**
 * One block per article, as in the French PDF: the title, then paragraphs. A list that
 * follows a paragraph ending with a colon joins it, numbered or separated by semicolons;
 * a subsection opens its first paragraph with its number and its title in bold.
 */
const articles = chunks.map((chunk) => {
  const [titleLine, ...lines] = chunk.split("\n");
  const [, number, title] = /^(\d+)\. (.+)$/.exec(titleLine.trim());
  const paragraphs = [];
  let subsection;

  for (const raw of lines) {
    const line = raw.trim();

    if (line === "") {
      continue;
    }

    const sub = /^### (\d+\.\d+) (.+)$/.exec(line);

    if (sub) {
      subsection = `<span class="mono">${sub[1]}</span> ${strong(`${inline(sub[2])}.`)} `;
      continue;
    }

    const item = /^(?:(\d+)\.|-) (.+)$/.exec(line);
    const previous = paragraphs.at(-1);

    if (item && previous?.open) {
      previous.html += ` ${item[1] ? `${item[1]}. ` : ""}${inline(item[2])}`;
      continue;
    }

    paragraphs.push({
      html: `${subsection ?? ""}${inline(item ? item[2] : line)}`,
      open: line.endsWith(":"),
    });
    subsection = undefined;
  }

  return {
    number: Number(number),
    title: `<span class="mono">${number.padStart(2, "0")}</span> ${inline(title)}`,
    paragraphs: paragraphs.map((paragraph) => `<p>${paragraph.html}</p>`),
  };
});

// --- Page ------------------------------------------------------------------------------

const font = (file, family, weight) => {
  const path = `node_modules/geist/dist/fonts/${file}`;
  const data = readFileSync(path).toString("base64");

  return `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${data}) format('woff2');font-weight:${weight}}`;
};

const fonts = [
  font("geist-sans/Geist-Regular.woff2", "Geist", 400),
  font("geist-sans/Geist-Medium.woff2", "Geist", 500),
  font("geist-sans/Geist-SemiBold.woff2", "Geist", 600),
  font("geist-sans/Geist-Bold.woff2", "Geist", 700),
  font("geist-mono/GeistMono-Regular.woff2", "Geist Mono", 400),
  font("geist-mono/GeistMono-Medium.woff2", "Geist Mono", 500),
].join("\n");

const data = {
  labels: {
    title: labels.title,
    first: labels.first,
    next: labels.next,
    last: labels.last,
    inForce: escape(typography(inForce)),
  },
  version,
  intro,
  articles,
};

// Runs in the browser: fills A4 pages block by block, starts a page when the two columns
// are full, then writes the running header and footer. Sets data-status on <body>.
const paginate = (data, range, continued, footer) => {
  const template = document.querySelector("#page");
  const pages = [];

  const newPage = () => {
    const page = template.content.firstElementChild.cloneNode(true);

    // The header gets its final height before anything is measured: kicker, title, and a
    // meta of two lines, filled in for real once the pages are known.
    page.querySelector(".kicker").textContent = data.labels.first;
    page.querySelector("h2").textContent = data.labels.title;
    page.querySelector(".meta").innerHTML = `version ${data.version}<br>${data.labels.inForce}`;
    document.body.append(page);
    pages.push({ element: page, columns: page.querySelector(".columns"), articles: [] });

    return pages.at(-1);
  };

  const overflows = (columns) => columns.scrollWidth > columns.clientWidth + 1;

  let current = newPage();

  /** Adds nodes together; moves them to a new page when they do not fit. */
  const place = (html, article) => {
    const holder = document.createElement("div");

    holder.innerHTML = html;

    const nodes = [...holder.children];
    const tail = current.columns.querySelector(".continued");

    nodes.forEach((node) => current.columns.insertBefore(node, tail));

    if (overflows(current.columns)) {
      nodes.forEach((node) => node.remove());
      current = newPage();
      nodes.forEach((node) =>
        current.columns.insertBefore(node, current.columns.querySelector(".continued")),
      );

      if (overflows(current.columns)) {
        throw new Error("A block is taller than a page.");
      }
    }

    if (article && !current.articles.includes(article)) {
      current.articles.push(article);
    }
  };

  data.intro.forEach((html) => place(html.replace("<p>", '<p class="intro">')));

  for (const article of data.articles) {
    const [first, ...rest] = article.paragraphs;

    // A title never ends a page: it moves with the first paragraph.
    place(`<h3>${article.title}</h3>${first}`, article.number);
    rest.forEach((html) => place(html, article.number));
  }

  pages.forEach((page, index) => {
    const isFirst = index === 0;
    const isLast = index === pages.length - 1;
    const next = pages[index + 1];
    const header = page.element.querySelector("header");

    header.querySelector(".kicker").textContent = isFirst
      ? data.labels.first
      : isLast
        ? data.labels.last
        : data.labels.next;
    header.querySelector("h2").textContent = data.labels.title;
    header.querySelector(".meta").innerHTML = isFirst
      ? `version ${data.version}<br>${data.labels.inForce}`
      : `version ${data.version}<br>${range(page.articles[0], page.articles.at(-1))}`;

    const tail = page.element.querySelector(".continued");

    if (next) {
      tail.textContent = continued(range(next.articles[0], data.articles.at(-1).number), index + 2);
    } else {
      tail.remove();
    }

    page.element.querySelector("footer").textContent = footer(
      data.version,
      index + 1,
      pages.length,
    );
  });

  // The tail line was measured empty: check the pages again now that it is written.
  const overflowing = pages.findIndex((page) => overflows(page.columns));

  document.body.dataset.status =
    overflowing === -1 ? "ok" : `overflow on page ${String(overflowing + 1)}`;
  document.body.dataset.pages = String(pages.length);
};

const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<title>${labels.title} — version ${version}</title>
<style>
${fonts}
@page{size:A4;margin:0}
html,body{margin:0;background:#FFFFFF}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact;font-kerning:normal;font-feature-settings:"kern"}
.page{width:794px;height:1123px;box-sizing:border-box;padding:76px 76px 44px;background:#FFFFFF;color:#141818;font-family:'Geist',system-ui,sans-serif;display:flex;flex-direction:column;gap:14px;overflow:hidden;break-after:page}
.page:last-child{break-after:auto}
header{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;border-bottom:1px solid #141818;padding-bottom:10px}
header>div{display:flex;flex-direction:column;gap:4px}
.kicker,.meta,.continued{margin:0;font-family:'Geist Mono',ui-monospace,monospace;font-size:10.5px;color:#646C6A}
.meta{text-align:right}
h2{margin:0;font-size:20px;font-weight:600;letter-spacing:-0.02em}
.columns{flex:1;min-height:0;column-count:2;column-gap:24px;column-fill:auto;font-size:11.3px;line-height:1.42;color:#393F3E}
.columns p{margin:0 0 4px}
.columns p.intro{margin:0 0 8px}
.columns .continued{margin:10px 0 0}
h3{margin:10px 0 3px;font-size:11.3px;font-weight:600;color:#141818;break-after:avoid}
strong{font-weight:600;color:#141818}
.mono{font-family:'Geist Mono',ui-monospace,monospace;font-weight:400;color:#646C6A}
footer{border-top:1px solid #DCE2E0;padding-top:8px;font-family:'Geist Mono',ui-monospace,monospace;font-size:9.5px;color:#646C6A}
</style>
</head>
<body data-status="pending">
<template id="page"><section class="page"><header><div><p class="kicker"></p><h2></h2></div><p class="meta"></p></header><div class="columns"><p class="continued">&nbsp;</p></div><footer></footer></section></template>
<script>
// Nothing uses the fonts before the pages exist, so they are loaded explicitly: measuring
// with a fallback font would paginate wrong.
Promise.all([...document.fonts].map((face) => face.load())).then(() => {
  try {
    (${paginate.toString()})(${JSON.stringify(data)}, ${labels.range.toString()}, ${labels.continued.toString()}, ${labels.footer.toString()});
  } catch (error) {
    document.body.dataset.status = "error: " + error.message;
  }
});
</script>
</body>
</html>
`;

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(chrome, args, { stdio: ["ignore", "pipe", "ignore"] });
    let stdout = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Chrome exited with code ${String(code)}`));
      }
    });
  });

const workspace = mkdtempSync(join(tmpdir(), "cgv-pdf-"));
const page = join(workspace, "cgv.html");
const flags = [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  `--user-data-dir=${join(workspace, "profile")}`,
  "--virtual-time-budget=10000",
];
let failed = false;

writeFileSync(page, html);

try {
  // First the layout, to check that nothing overflows; then the print.
  const dom = await run([...flags, "--dump-dom", pathToFileURL(page).href]);
  const status = /data-status="([^"]*)"/.exec(dom)?.[1];
  const pages = /data-pages="(\d+)"/.exec(dom)?.[1];

  if (status !== "ok") {
    throw new Error(`Layout failed: ${String(status)}.`);
  }

  await run([
    ...flags,
    "--no-pdf-header-footer",
    `--print-to-pdf=${output}`,
    pathToFileURL(page).href,
  ]);

  const printed = readFileSync(output, "latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;

  if (String(printed) !== pages) {
    throw new Error(`${output}: ${String(printed)} pages printed, ${String(pages)} laid out.`);
  }

  process.stdout.write(`${output}: ${String(printed)} pages\n`);
} catch (error) {
  failed = true;
  rmSync(output, { force: true });
  console.error(error instanceof Error ? error.message : error);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

process.exit(failed ? 1 : 0);
