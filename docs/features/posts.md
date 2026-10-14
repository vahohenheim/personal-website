---
title: Posts
description: The posts section end to end: what it is for, the reader's path, writing and publishing a post, the MDX components, images, the registry, drafts on previews, password-protected posts, the home block, SEO and the tests that guard it all.
related_code:
  - ../../content/posts/
  - ../../public/posts/
  - ../../lib/constants/posts.ts
  - ../../lib/constants/post-bodies.ts
  - ../../lib/models/post.ts
  - ../../lib/helpers/posts.ts
  - ../../lib/posts/source.ts
  - ../../lib/posts/access.ts
  - ../../mdx-components.tsx
  - ../../mdx.d.ts
  - ../../components/post-callout/
  - ../../components/post-decision-table/
  - ../../components/post-definitions/
  - ../../components/post-diagram/
  - ../../components/post-figure/
  - ../../components/post-image/
  - ../../components/post-list-item/
  - ../../components/post-plus-list/
  - ../../components/post-project-sheet/
  - ../../components/post-pull-quote/
  - ../../components/post-screens/
  - ../../components/post-section/
  - ../../components/post-shot/
  - ../../components/post-stats/
  - ../../components/post-tags/
  - ../../components/post-toc/
  - ../../components/post-unlock-form/
  - ../../components/project-card/project-card.tsx
  - ../../components/header/header.tsx
  - ../../components/header/header-nav.tsx
  - ../../app/[locale]/page.tsx
  - ../../app/[locale]/posts/page.tsx
  - ../../app/[locale]/posts/[slug]/page.tsx
  - ../../app/[locale]/posts/[slug]/opengraph-image.tsx
  - ../../app/[locale]/posts/feed.xml/route.ts
  - ../../app/[locale]/unlock/[slug]/page.tsx
  - ../../app/api/posts/unlock/route.ts
  - ../../app/sitemap.ts
  - ../../proxy.ts
  - ../../next.config.ts
  - ../../instrumentation-client.ts
last_updated: 2026-10-14
---

# Posts

**Summary.** The posts section holds long articles about Valentin's projects and work,
written in MDX with a small set of components (screens, diagrams, project sheet,
numbered sections…). A post is an MDX file, its images in `public/posts/<slug>/`, and an
entry in a typed registry. Published posts get a page with a summary and a link to the
next post, a line in the list, a place in the "articles" block of the home page, a link
from their project card, an entry in the sitemap (with their cover) and in the RSS feed,
`BlogPosting` structured data and their own sharing image. Drafts can be read on Vercel
preview deployments. A post can also be **protected**: online at its URL, listed nowhere,
readable with a password only.

## Where things are

| What                      | Where                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Body of a post            | `content/posts/<slug>/<locale>.mdx`                                                     |
| Its images                | `public/posts/<slug>/`                                                                  |
| Registry (plain data)     | [lib/constants/posts.ts](../../lib/constants/posts.ts)                                  |
| Body loaders              | [lib/constants/post-bodies.ts](../../lib/constants/post-bodies.ts)                      |
| Reading the registry, MDX | [lib/helpers/posts.ts](../../lib/helpers/posts.ts) (pure, imported by `proxy.ts` too)   |
| Reading the source file   | [lib/posts/source.ts](../../lib/posts/source.ts): reading time, word count, summary     |
| Access to protected posts | [lib/posts/access.ts](../../lib/posts/access.ts), `proxy.ts`, `app/api/posts/unlock/`   |
| MDX components            | [mdx-components.tsx](../../mdx-components.tsx), one folder each in `components/post-*/` |
| List, post, image, feed   | `app/[locale]/posts/`, `[slug]/page.tsx`, `[slug]/opengraph-image.tsx`, `feed.xml/`     |
| Password page             | `app/[locale]/unlock/[slug]/page.tsx`                                                   |

MDX is compiled by `@next/mdx` (`createMDX()` in `next.config.ts`). The files are
imported by `POST_BODIES`; they are not routes. `mdx.d.ts` declares the type of `*.mdx`
imports, because TypeScript 6 no longer loads `@types/*` packages on its own.

The registry and the loaders are two files on purpose: `proxy.ts` reads the registry to
know which posts are protected, and importing the loaders would compile every body into
the proxy bundle.

## The reader's path

1. **Header.** The "articles" link appears once a post is listed in the language. It
   counts public posts only.
2. **Home page.** An "articles" block sits between the changelog and the projects: the
   three latest posts (date in mono, title as a link, the description), and "tous les
   articles →". Same grammar as the changelog: no card, no image, no filled accent. It
   does not exist in a language without a listed post (`getHomePosts`).
3. **Project cards.** A card whose project has a listed post (`project.personalProjectId`)
   gets a discreet "lire l’article →" link. Its accessible name adds the project name,
   since the visible text is the same on every card.
4. **List** (`/[locale]/posts/`): breadcrumb, title, lead, feed link, then per post the
   date, the reading time, the title as a link, the description and the tags.
5. **Post** (`/[locale]/posts/<slug>/`): the trail `~/articles/<slug>`, the `h1`, the lead,
   a mono line "13 oct. 2026 · 10 min de lecture" (plus the update date when it differs),
   the tags as mono chips, then the body. The summary is built from the numbered
   sections: sticky in a right column on wide screens, above the body on phones. At the
   bottom, a link to the next post (registry order, most recent first, looping) and one
   back to the list.
6. **Feed** (`/[locale]/posts/feed.xml`): RSS 2.0, one per language. The item
   description is the lead; each tag is a `<category>`.

## Writing and publishing a post, end to end

1. **Write** `content/posts/<slug>/fr.mdx` (and `en.mdx` if it is translated). Start with
   an MDX comment if useful, then the first visual (`variant="hero"`), the project sheet,
   and numbered `<Section>`s. The title and the lead come from the registry: do not repeat
   them. Headings inside a section start at `###` (the section title is the `h2`).
2. **Prepare the images** (next section) in `public/posts/<slug>/`.
3. **Register** the post in `POSTS` with `draft: true`, and its loader in `POST_BODIES`.
4. **Read it** with `npm run dev`, or push a branch and open the Vercel preview from a
   phone: drafts are visible there, marked "brouillon", and not indexed.
5. **Publish**: remove `draft`, set `publishedAt` and `updatedAt`, run the checks, merge.

The registry entry:

| Field              | Meaning                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `slug`             | The URL segment, the same in every language. **Never changed once published.**                                                                                                                                     |
| `publishedAt`      | Day of publication. Posts of the same day keep the order of the registry: keep it most recent first.                                                                                                               |
| `updatedAt`        | Last change a reader would notice; the page then shows both dates.                                                                                                                                                 |
| `draft?`           | Visible in development and on previews only.                                                                                                                                                                       |
| `visibility?`      | `"public"` (default) or `"protected"` (see below).                                                                                                                                                                 |
| `cover?`           | `{ src, width, height }`: one same-origin image, in real pixels (the `-jour` file of a pair). Structured data and sitemap.                                                                                         |
| `project?`         | `{ name, type, applicationCategory?, operatingSystem?, url?, personalProjectId? }`: what the post is about. `type` is `MobileApplication`, `WebApplication` or `WebSite`. `personalProjectId` links the home card. |
| `versions[locale]` | `title`, `description` (under 155 characters), `lead` (the paragraph under the title, and the feed text), `tags` (lowercase), `coverAlt?`.                                                                         |

**Computed at build time, never written by hand:** the word count and the reading time
(`getReadingStats`: the prose only, that is the text outside JSX tags, their attributes,
MDX comments and code blocks, at 220 words per minute, rounded up), and the summary
(`getTableOfContents`: every `<Section n title>`, in order). Text between an opening and
a closing tag, such as a `<Plus>` item, counts as prose. Post pages are pre-rendered, so
`lib/posts/source.ts` reads the MDX file at build time only.

Rules:

- A post may exist in one language only. Its `hreflang` alternates, the sitemap and the
  header language link follow: from a post without a translation, the language link goes
  to the list of the other language, or its home page when that list is empty.
- French posts follow the French typography of the charter (`’`, non-breaking spaces).
- Nothing is published under Valentin's name that he did not write. The texts are his:
  a fix to the MDX syntax is fine, a rewording is not.
- Project articles are written to stay true over time: no project status in the prose,
  no "not yet", no plans.

## MDX components

All are Server Components, styled with the charter tokens only (one accent, radius 2 px,
no shadow). Props are exactly these; a test fails when an MDX file uses a name that
`mdx-components.tsx` does not register. Plain Markdown also works: `###` headings, lists,
`>` quotes, code fences (`text`, `ts`, `json`, `jsonc`) and inline code.

| Component         | Props                                                           | Renders                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<Screens>`       | `caption`, `variant?: "hero"`; children: `<Screen>`             | A row of phone screens (390 × 844), wrapping on small screens, one caption.                                                                                                             |
| `<Screen>`        | `src`, `alt`, `mode?: "nuit"`                                   | One phone screen. `mode="nuit"` forces the night image whatever the theme.                                                                                                              |
| `<Shot>`          | `src`, `alt`, `width`, `height`, `caption?`, `variant?: "hero"` | One large screenshot in a 1 px frame, with a caption.                                                                                                                                   |
| `<Shots>`         | `caption`; children: `<Shot>`                                   | Two shots side by side, stacked below 768 px, one shared caption.                                                                                                                       |
| `<Diagram>`       | `src`, `alt`, `width`, `height`, `caption`, `variant?: "hero"`  | A diagram, always a jour/nuit pair. The `alt` describes the whole diagram.                                                                                                              |
| `<ProjectSheet>`  | `rows: [label, value][]`, `status`, `link?: [label, href]`      | The project sheet: mono labels and values, a status line with the accent dot, a link.                                                                                                   |
| `<Section>`       | `n?`, `label?`, `title?`; children                              | With a title: a `<section>` with the label `01 · contexte` and an anchored `h2` (the summary entry). Without props: the continuation of the previous section after a full-width figure. |
| `<PlusList>`      | children: `<Plus>`                                              | A list whose bullet is the `+` glyph.                                                                                                                                                   |
| `<Plus>`          | `title`; children                                               | One item: the title in bold, then the text on the same line.                                                                                                                            |
| `<Definitions>`   | `items: [term, text][]`, `stacked?`                             | A definition list, the term in mono on the left (above when `stacked`).                                                                                                                 |
| `<Callout>`       | `label`; children                                               | A boxed aside on the surface colour, with a mono label.                                                                                                                                 |
| `<DecisionTable>` | `columns: string[]`, `rows: string[][]`                         | A table that scrolls on its own on phones; the page never does.                                                                                                                         |
| `<PullQuote>`     | children                                                        | A large quote with an accent rule.                                                                                                                                                      |
| `<Stats>`         | `items: [label, value][]`                                       | A row of figures, mono labels.                                                                                                                                                          |

Examples:

```mdx
<Screens variant="hero" caption="Notes, éditeur. Toutes les notes sont inventées.">
  <Screen src="/posts/pensee/ecran-notes" alt="Écran Notes : …" />
  <Screen src="/posts/pensee/ecran-notes" mode="nuit" alt="Écran Notes en mode nuit." />
</Screens>

<Shot src="/posts/brut/accueil.webp" width={1440} height={900} variant="hero" alt="…" caption="…" />

<Shots caption="La comptabilité et le pipeline des prospects.">
  <Shot src="/posts/lotus/ecran-comptabilite" width={1280} height={900} alt="…" />
  <Shot src="/posts/lotus/ecran-leads" width={1280} height={900} alt="…" />
</Shots>

<Diagram src="/posts/pensee/schema-synchro" width={1040} height={360} alt="…" caption="…" />

<ProjectSheet
  rows={[
    ["rôle", "Produit, design, développement"],
    ["stack", "Next.js 16, Neon"],
  ]}
  status="En ligne"
  link={["mangezbrut.fr", "https://www.mangezbrut.fr"]}
/>

<Section n="01" label="contexte" title="Pourquoi un carnet de plus">

Un paragraphe en Markdown.

</Section>

<Diagram … />

<Section>

La suite de la section 01, après la figure.

</Section>

<PlusList>
  <Plus title="L’écriture d’abord.">Rien ne ralentit la frappe.</Plus>
</PlusList>

<Definitions
  items={[
    ["notes", "Les notes par jour…"],
    ["éditeur", "Façon Notion…"],
  ]}
/>

<Callout label="détail · le jour bascule à 4 h">Une note écrite à 0 h 44…</Callout>

<DecisionTable columns={["sujet", "retenu", "écarté"]} rows={[["App", "Expo", "PWA"]]} />

<PullQuote>Les chiffres viennent du code, les mots viennent du modèle.</PullQuote>

<Stats
  items={[
    ["durée", "2 jours"],
    ["commits", "119"],
  ]}
/>
```

Behaviour worth knowing:

- Leave a blank line after an opening tag and before a closing one when the content is
  Markdown (`<Section>`): MDX then parses it as paragraphs.
- Text keeps a 68-character column; figures, tables and code may be wider, up to the
  width of the article column. At 375 px nothing makes the page scroll sideways.
- Only `variant="hero"` images load eagerly with `fetchpriority="high"`; every other image
  is `loading="lazy"`. All have `width`, `height` and `alt` (taken as written).

## Images

- **Format:** WebP, rendered at 2x. `width` and `height` in the MDX are CSS pixels (half
  the file size); a test checks that they keep the proportions of the file.
- **Pairs:** files ending in `-jour.webp` / `-nuit.webp`. In MDX, a `src` without
  extension names the pair (`/posts/pensee/ecran-notes` → both files). Both images are
  rendered and one is hidden with the `dark:` variant (`.dark` class set by next-themes
  before the first paint): no client code, no flash. The hidden lazy image is not
  downloaded; a hero pair downloads both.
- **Single images:** a `src` with extension, shown in both themes (BRUT screenshots: the
  site has one look).
- **Fictional data only** in screenshots: demo seeds, invented notes, `example.com`.
- **Same-origin only**, which the CSP (`img-src 'self'`) already allows. Images are
  served as prepared (`unoptimized`): the image optimizer is limited to the portrait by
  `images.localPatterns` in `next.config.ts`, so that it can never read the images of a
  protected post, which it would otherwise fetch without going through `proxy.ts`.

## Drafts

A draft is visible when `NODE_ENV` is `development` (`npm run dev`) or when `VERCEL_ENV`
is `preview` (any Vercel preview deployment, so a post can be proofread from a phone).
It is never visible in production: no page (`getPost` returns nothing, so the route
answers 404), no line in the list, the header or the home page.

Even where drafts are visible, they are never indexed: their page is `noindex, nofollow`,
a list that only shows drafts is `noindex`, and the sitemap and the feed use
`getIndexablePosts`, which never returns a draft. `dynamicParams = false` on the post
route means only the slugs of the registry are ever built.

## Protected posts

A post with `visibility: "protected"` is online at its URL, readable by the people
Valentin gives the link and the password to, and visible nowhere else.

**Listed nowhere.** Not in the list, the home block, the header count, the sitemap, the
feed, the "next post" link, the project cards, the structured data of the blog, or the
language link of the header. The header never even names it in what it sends to the
browser (the language fallback for posts is resolved by the nav itself, from the list of
posts of the other language). Its page is `noindex, nofollow` (metadata and
`X-Robots-Tag`), and its sharing image shows neither its title nor its project.

**The gate.** `proxy.ts` runs before the filesystem routes, `public/` and pre-rendered
pages (Next.js docs: _Proxy, Execution order_), and on Vercel before the cache. Two
literal lines of its `matcher` per protected post send it the page in every locale
(HTML and RSC requests, which share the path), what lies below it (the sharing image)
and its images (`/posts/<slug>/…`). A test checks that every protected post of the
registry has its two lines. Then:

| Request                        | Valid cookie for this post | No valid cookie                                     |
| ------------------------------ | -------------------------- | --------------------------------------------------- |
| The page, HTML or RSC          | the pre-rendered post      | rewritten to the password page, nothing of the post |
| Below the page (sharing image) | served                     | 404                                                 |
| `/posts/<slug>/…` (images)     | served                     | 404                                                 |
| Variables missing              | —                          | rewritten to the translated 404 page                |

Every one of these answers is `Cache-Control: private, no-store` and
`X-Robots-Tag: noindex, nofollow`. The page itself is pre-rendered like any post: the
proxy is the gate, and the smoke tests prove it holds (no sentence of the post in the
HTML or the RSC answer without the cookie, none in `.next/static` after the build).

**The password page** (`/[locale]/unlock/<slug>/`, shown at the post URL by the rewrite)
follows the contact form: texts in the dictionaries (`posts.unlock`), sent with `fetch`
to `POST /api/posts/unlock/`, BotID declared in `instrumentation-client.ts`, a honeypot
field, a time trap (1 second minimum), errors as toasts. On success the page reloads and
the proxy lets the post through.

**The route** compares the password with `PROTECTED_POSTS_PASSWORD` in constant time.
Without that variable or `PROTECTED_POSTS_SECRET`, it answers 404 and the post stays
closed. Every refusal (wrong password, unknown or public slug, bot) gets the same
answer, `401 { "error": "refused" }`. Nothing about the password or the cookie is ever
logged.

**The cookie** is `post_access_<slug>`, `HttpOnly; Secure; SameSite=Lax; Path=/`, valid
30 days. Its value is `<expiry in seconds>.<HMAC-SHA256 of "<slug>.<expiry>">` signed with
`PROTECTED_POSTS_SECRET`, so it opens one post only, cannot be extended or moved to
another post, and stops working when it expires or when the secret changes (which closes
every post opened so far). It is strictly necessary and described on the legal page.

**Making a protected post public** is removing its `visibility` line. It then appears
everywhere, like any post. Its two `matcher` lines can stay (the proxy just lets the
request through) or be removed to keep the page on the CDN only.

The password is given by hand, never in a repository or a public message. There is no
rate limit beyond BotID: a long password matters.

## SEO

- **Meta tags** from `getPostsMetadata` and `getPostMetadata`
  ([lib/helpers/metadata.ts](../../lib/helpers/metadata.ts)): title, description,
  canonical, `hreflang` alternates and Open Graph `article` with `publishedTime`,
  `modifiedTime`, `tags` and `authors`.
- **Sitemap:** each published public post per language, `lastModified` = `updatedAt`,
  its alternates, and `images: [cover URL]`.
- **Structured data** (`getPostJsonLd`, `PAGE_GRAPHS.posts`, the home graph): see
  [seo.md](seo.md#structured-data-json-ld).
- **Sharing image** per post (`[slug]/opengraph-image.tsx`), in day mode: trail, title,
  project. Generated at build time; served at `/<locale>/posts/<slug>/opengraph-image/`.

## Tests that protect the section

| Test                                                                         | Guards                                                                                                                                                                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [tests/unit/posts.test.ts](../../tests/unit/posts.test.ts)                   | drafts in development, preview and production; order; next post; project link; home block; protected posts absent from every list and the sitemap; summary, word count, image pairs        |
| [tests/unit/post-content.test.ts](../../tests/unit/post-content.test.ts)     | every MDX component is registered, every image exists (both variants), sizes keep proportions, every version has a loader, covers exist                                                    |
| [tests/unit/json-ld.test.ts](../../tests/unit/json-ld.test.ts)               | the graph of every page and every post in every language: complete, absolute, no hole                                                                                                      |
| [tests/unit/post-access.test.ts](../../tests/unit/post-access.test.ts)       | password and cookie: closed without the variables, expired, forged, foreign                                                                                                                |
| [tests/routes/posts-unlock.test.ts](../../tests/routes/posts-unlock.test.ts) | the unlock route: cookie flags, one neutral refusal, no secret in the logs                                                                                                                 |
| [tests/routes/proxy.test.ts](../../tests/routes/proxy.test.ts)               | the gate: rewrite, 404s, valid and invalid cookies, the `matcher` lists every protected post                                                                                               |
| [tests/smoke/posts.test.ts](../../tests/smoke/posts.test.ts)                 | the built site: list and posts answer 200 with JSON-LD and loading images; feed, sitemap and home; the protected post over HTTP (HTML, RSC, images, optimizer, cookies) and `.next/static` |

## Checklist: publishing a post

- [ ] `content/posts/<slug>/<locale>.mdx` written by Valentin, numbered sections, one hero.
- [ ] Images in `public/posts/<slug>/`: WebP at 2x, pairs named `-jour` / `-nuit`,
      fictional data, sizes in the MDX at half the file size.
- [ ] Entry in `POSTS` (most recent first): title, description under 155 characters,
      lead, tags, cover and `coverAlt`, `project` with `personalProjectId` if it has a card.
- [ ] Loader in `POST_BODIES`.
- [ ] Read on a preview deployment as a draft, in day and night mode, at 375 px.
- [ ] `draft` removed, dates set; `npm run check`, `npm test`, `npm run build`,
      `npm run test:smoke`.
- [ ] For a protected post: `visibility: "protected"`, two `matcher` lines in `proxy.ts`,
      both variables set in Vercel.
