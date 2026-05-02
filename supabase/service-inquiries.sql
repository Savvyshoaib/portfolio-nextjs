-- Service Inquiries Table
-- Run this SQL inside the Supabase SQL Editor

create table if not exists public.service_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service_slug text not null,
  service_title text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  ip_address text,
  user_agent text,
  referrer text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists service_inquiries_status_idx on public.service_inquiries(status);
create index if not exists service_inquiries_priority_idx on public.service_inquiries(priority);
create index if not exists service_inquiries_created_at_idx on public.service_inquiries(created_at desc);
create index if not exists service_inquiries_email_idx on public.service_inquiries(email);
create index if not exists service_inquiries_service_slug_idx on public.service_inquiries(service_slug);

create or replace function public.update_service_inquiry_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists service_inquiries_updated_at on public.service_inquiries;
create trigger service_inquiries_updated_at
  before update on public.service_inquiries
  for each row
  execute function public.update_service_inquiry_updated_at();

grant all on public.service_inquiries to authenticated;
grant select, insert, update on public.service_inquiries to anon;

