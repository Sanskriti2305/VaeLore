-- Run once in Supabase: SQL Editor > New query > paste > Run
create table if not exists public.shelves(
  user_id uuid primary key references auth.users(id) on delete cascade,
  status jsonb not null default '{}', extra jsonb not null default '{}', progress jsonb not null default '{}', bookmarks jsonb not null default '{}',
  interests text[] not null default '{}', onboarded boolean not null default false, is_public boolean not null default false,
  updated_at timestamptz not null default now());
create table if not exists public.highlights(
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  book text not null, page int not null, text text not null, color text not null check (color in ('y','g','p')),
  created_at timestamptz not null default now());
alter table public.shelves enable row level security;
alter table public.highlights enable row level security;
drop policy if exists "owner shelf" on public.shelves;
create policy "owner shelf" on public.shelves for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists "public shelf read" on public.shelves;
create policy "public shelf read" on public.shelves for select using (is_public = true);
drop policy if exists "owner highlights" on public.highlights;
create policy "owner highlights" on public.highlights for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- If you already ran an older version of this file, this adds the new column safely:
alter table public.shelves add column if not exists bookmarks jsonb not null default '{}';
