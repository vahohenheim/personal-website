-- Schema of the Neon database. Applied by `npm run db:setup`; safe to run again.
-- Change log: docs/database/schema.md.

create table if not exists leads (
  id bigint generated always as identity primary key,
  need text not null,
  timeline text,
  message text not null,
  name text not null,
  email text not null,
  company text,
  locale text not null default 'fr',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);

-- Audience figures copied every day from Vercel Web Analytics, which only keeps a month.
-- Aggregated counts only: no visitor can be identified from them.
create table if not exists analytics_daily (
  day date primary key,
  visitors integer not null default 0,
  pageviews integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Same counts split by page, referrer, country or device, one row per day and value.
create table if not exists analytics_breakdown (
  day date not null,
  dimension text not null,
  label text not null,
  visitors integer not null default 0,
  pageviews integer not null default 0,
  primary key (day, dimension, label)
);

create index if not exists analytics_breakdown_dimension_idx on analytics_breakdown (dimension, day);
