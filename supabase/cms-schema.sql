-- CMS schema for portfolio-nextjs
-- Run this SQL inside the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  slug text null,
  excerpt text not null default '',
  payload jsonb not null default '{}'::jsonb,
  cover_image_url text not null default '',
  tags text[] not null default '{}'::text[],
  published boolean not null default true,
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint content_items_type_check check (
    type in ('services', 'portfolio', 'blog', 'testimonials', 'tech_stack')
  )
);

create index if not exists content_items_type_order_idx on public.content_items(type, display_order, created_at);
create unique index if not exists content_items_type_slug_unique on public.content_items(type, slug) where slug is not null and slug <> '';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists tr_site_settings_updated_at on public.site_settings;
create trigger tr_site_settings_updated_at
before update on public.site_settings
for each row
execute procedure public.set_updated_at();

drop trigger if exists tr_site_sections_updated_at on public.site_sections;
create trigger tr_site_sections_updated_at
before update on public.site_sections
for each row
execute procedure public.set_updated_at();

drop trigger if exists tr_content_items_updated_at on public.content_items;
create trigger tr_content_items_updated_at
before update on public.content_items
for each row
execute procedure public.set_updated_at();

create or replace function public.is_admin_jwt()
returns boolean
language sql
stable
as $$
  select
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'owner', 'super_admin')
    or
    coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') in ('admin', 'owner', 'super_admin');
$$;

alter table public.site_settings enable row level security;
alter table public.site_sections enable row level security;
alter table public.content_items enable row level security;

drop policy if exists "public read published content" on public.content_items;
create policy "public read published content"
on public.content_items
for select
using (published = true);

drop policy if exists "admin manage site settings" on public.site_settings;
create policy "admin manage site settings"
on public.site_settings
for all
using (public.is_admin_jwt())
with check (public.is_admin_jwt());

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "admin manage site sections" on public.site_sections;
create policy "admin manage site sections"
on public.site_sections
for all
using (public.is_admin_jwt())
with check (public.is_admin_jwt());

drop policy if exists "public read site sections" on public.site_sections;
create policy "public read site sections"
on public.site_sections
for select
to anon, authenticated
using (true);

drop policy if exists "admin manage content items" on public.content_items;
create policy "admin manage content items"
on public.content_items
for all
using (public.is_admin_jwt())
with check (public.is_admin_jwt());
