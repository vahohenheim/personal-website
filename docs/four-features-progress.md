# Four features: progress

Working file for the four features Valentin chose on 2026-10-11, among a list of
proposals. It exists so that the work can be resumed by a new session. Delete it once
everything is merged and deployed.

## The request

1. **Follow-up of leads in the admin:** notes, pipeline statuses (quote sent, won, lost),
   estimated amount, follow-up date.
2. **Articles or retrospectives:** content that shows expertise and brings search traffic.
3. **Resume as a PDF following the design charter:** one A4 page, two columns, in French
   and in English.
4. **Conversion measurement:** how many visitors open the form, at which step they give
   up, and where those who finish come from.

## How to resume

1. `git checkout feature/crm-posts-cv-conversion`, read this file.
2. `git log --oneline main..HEAD` shows what is done. One commit per step.
3. Continue with the first unchecked step and tick it in the same commit.
4. After each step: `npm run check` and `npm run build` must pass.
5. `.env.local` points to the production database: test with `LEADS_MEMORY_STORE=1`.
6. Do not merge or push to `main` without Valentin's go-ahead.

## Design decisions

- **Conversion.** No third-party tool: four anonymous counters per day in Neon
  (`funnel_daily`), incremented by `POST /api/events/` (BotID, allow-list of event names,
  no identifier). Events: `contact_open`, `contact_step_details`, `contact_step_identity`,
  `contact_sent`. The origin of a lead (referrer host or `utm_source`, kept in
  `sessionStorage` on arrival) is stored with the lead in a `source` column.
- **Follow-up.** New columns on `leads`: `notes`, `amount` (euros), `follow_up_on`. New
  statuses `quoted`, `won`, `lost`, added to the existing ones (stored values are never
  renamed). Edited in a dialog opened from the table.
- **Resume PDF.** A print-only route `/[locale]/resume/print/` laid out in millimetres for
  A4, `noindex`, and a script (`npm run cv:pdf`) that prints it with the local Chrome to
  `public/cv-fr.pdf` and `public/cv-en.pdf`. The download button links to the file of the
  current language.
- **Posts.** MDX files in `content/posts/<slug>/<locale>.mdx`, listed in a typed registry
  with a `draft` flag. Routes `/[locale]/posts/` and `/[locale]/posts/[slug]/`, with
  metadata, `BlogPosting` structured data, sitemap entries and an RSS feed. The nav link
  only appears when at least one post is published. Valentin writes the posts: one draft
  is provided as an example and is not published.

## Steps

- [x] 0. Branch and this file.
- [ ] 1. Schema: `funnel_daily`, new columns on `leads`; stores and models.
- [ ] 2. Conversion: events API, tracking in the contact dialog, lead source, admin section.
- [ ] 3. Follow-up of leads: statuses, follow-up dialog, figures, table columns, export.
- [ ] 4. Resume PDF: print route, generation script, both files, download links.
- [ ] 5. Posts: MDX setup, registry, list and post pages, structured data, sitemap, feed,
      nav link, one draft example.
- [ ] 6. Legal and privacy texts; schema applied to Neon.
- [ ] 7. Documentation, `CLAUDE.md`, README.
- [ ] 8. Verification in a browser; screenshots.

## Open questions for Valentin

- The posts themselves: titles, subjects, and whether the draft example suits him.
- Whether amounts are a day rate or a total (the field is a free amount in euros).
