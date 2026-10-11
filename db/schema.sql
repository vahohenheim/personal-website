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
