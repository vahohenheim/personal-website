---
title: Posts
description: Posts and retrospectives written in MDX: where the files live, the registry, drafts, languages, the list, the feed, the structured data, and how to publish one.
related_code:
  - ../../content/posts/
  - ../../lib/constants/posts.ts
  - ../../lib/models/post.ts
  - ../../lib/helpers/posts.ts
  - ../../mdx-components.tsx
  - ../../mdx.d.ts
  - ../../app/[locale]/posts/page.tsx
  - ../../app/[locale]/posts/[slug]/page.tsx
  - ../../app/[locale]/posts/feed.xml/route.ts
  - ../../components/header/header.tsx
  - ../../next.config.ts
last_updated: 2026-10-11
---

# Posts

**Summary.** A post is an MDX file plus an entry in a typed registry. Published posts get a
page, a line in the list `/[locale]/posts/`, an entry in the sitemap and in an RSS feed,
and `BlogPosting` structured data. Until a post is published in a language, that language
has no list, no feed and no "articles" link in the header. Valentin writes the posts: the
only one in the repository is a draft that shows the format.

## Where things are

| What                 | Where                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------- |
| Body of a post       | `content/posts/<slug>/<locale>.mdx`                                                    |
| Registry             | [lib/constants/posts.ts](../../lib/constants/posts.ts): slug, dates, `draft`, versions |
| Reading the registry | [lib/helpers/posts.ts](../../lib/helpers/posts.ts): `getPosts`, `getPost`, paths       |
| How elements look    | [mdx-components.tsx](../../mdx-components.tsx): headings, lists, quote, code, rule     |
| List, post, feed     | `app/[locale]/posts/`, `app/[locale]/posts/[slug]/`, `app/[locale]/posts/feed.xml/`    |

MDX is compiled by `@next/mdx` (`createMDX()` in `next.config.ts`). The files are imported
as components by the registry; they are not routes. `mdx.d.ts` declares the type of
`*.mdx` imports, because TypeScript 6 no longer loads `@types/*` packages on its own.

## Publishing a post

1. Write `content/posts/<slug>/fr.mdx` (and `en.mdx` if it is translated). Start with a
   paragraph: the title comes from the registry. Headings start at `##`.
2. Add an entry to `POSTS` with `draft: true`: slug, `publishedAt`, `updatedAt`, and for
   each language a title, a description (under 155 characters) and the `load` import.
3. Read it with `npm run dev`: drafts are visible there, marked "brouillon".
4. Remove `draft`, set the dates, deploy.

Rules:

- **Never change a slug once published.** It is the URL.
- A post may exist in one language only. Its `hreflang` alternates, the sitemap and the
  language link of the header follow: from a post without a translation, the language link
  goes to the list of the other language, or to its home page when that list is empty
  (`getLanguageFallbacks`).
- Bump `updatedAt` when a reader would notice the change; the page then shows both dates.
- French posts follow the French typography rules of the charter.
- Nothing is published under Valentin's name that he did not write.

## Drafts

A draft is visible when `NODE_ENV` is `development`, and only then. In production it has
no page (`getPost` returns nothing, so the route answers 404), no line in the list, no feed
or sitemap entry. `dynamicParams = false` on the post route means only the slugs of the
registry are ever built.

## Pages

- **List** (`/[locale]/posts/`): breadcrumb, title, lead, link to the feed, then one line
  per post (date in mono, title, description), most recent first. It calls `notFound()`
  when there is nothing to list. Declared in `PAGES` as `posts`.
- **Post** (`/[locale]/posts/<slug>/`): breadcrumb down to the slug, title, publication
  date in full letters (and the update date when it differs), the body in a 68-character
  column, a link back to the list.
- **Feed** (`/[locale]/posts/feed.xml`): RSS 2.0, one per language, built with the site.
  Pages of the posts section declare it with `<link rel="alternate">`.

## SEO

Meta tags come from `getPostsMetadata` and `getPostMetadata`
([lib/helpers/metadata.ts](../../lib/helpers/metadata.ts)); the structured data from the
`posts` entry of `PAGE_GRAPHS` and from `getPostJsonLd`. See
[seo.md](seo.md#structured-data-json-ld).

## State and limits

- No syntax highlighting in code blocks, no images yet. An image hosted elsewhere would
  need the CSP opened ([security.md](../architecture/security.md)).
- No post is published: the section is invisible on the live site until the first one.
