-- Website Analytics Tracking Schema
-- Run this SQL inside the Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.analytics_visitors (
  visitor_id text primary key,
  first_seen_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now()),
  first_source text not null default 'direct',
  first_medium text not null default 'none',
  first_referrer text,
  first_country text,
  first_city text,
  last_country text,
  last_city text,
  last_page text,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_sessions (
  session_id text primary key,
  visitor_id text not null,
  started_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now()),
  first_page text,
  last_page text,
  source text not null default 'direct',
  medium text not null default 'none',
  campaign text,
  referrer text,
  country text,
  city text,
  region text,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_page_views (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null,
  page_path text not null,
  duration_ms integer not null default 0 check (duration_ms >= 0),
  started_at timestamptz,
  ended_at timestamptz,
  source text,
  medium text,
  country text,
  city text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null,
  page_path text,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists analytics_visitors_last_seen_idx on public.analytics_visitors(last_seen_at desc);
create index if not exists analytics_sessions_last_seen_idx on public.analytics_sessions(last_seen_at desc);
create index if not exists analytics_sessions_visitor_idx on public.analytics_sessions(visitor_id);
create index if not exists analytics_sessions_source_idx on public.analytics_sessions(source);
create index if not exists analytics_sessions_country_idx on public.analytics_sessions(country);
create index if not exists analytics_page_views_created_idx on public.analytics_page_views(created_at desc);
create index if not exists analytics_page_views_path_idx on public.analytics_page_views(page_path);
create index if not exists analytics_page_views_session_idx on public.analytics_page_views(session_id);
create index if not exists analytics_events_created_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_type_idx on public.analytics_events(event_type);

create or replace function public.update_analytics_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists analytics_visitors_updated_at on public.analytics_visitors;
create trigger analytics_visitors_updated_at
  before update on public.analytics_visitors
  for each row
  execute function public.update_analytics_updated_at();

drop trigger if exists analytics_sessions_updated_at on public.analytics_sessions;
create trigger analytics_sessions_updated_at
  before update on public.analytics_sessions
  for each row
  execute function public.update_analytics_updated_at();

grant all on public.analytics_visitors to authenticated;
grant all on public.analytics_sessions to authenticated;
grant all on public.analytics_page_views to authenticated;
grant all on public.analytics_events to authenticated;

grant insert on public.analytics_visitors to anon;
grant insert on public.analytics_sessions to anon;
grant insert on public.analytics_page_views to anon;
grant insert on public.analytics_events to anon;

