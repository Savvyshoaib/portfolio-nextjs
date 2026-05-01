-- Contact Submissions Table
-- Run this SQL inside the Supabase SQL Editor

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  ip_address text,
  user_agent text,
  referrer text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Create indexes for better performance
create index if not exists contact_submissions_status_idx on public.contact_submissions(status);
create index if not exists contact_submissions_priority_idx on public.contact_submissions(priority);
create index if not exists contact_submissions_created_at_idx on public.contact_submissions(created_at desc);
create index if not exists contact_submissions_email_idx on public.contact_submissions(email);

-- Create function to automatically update updated_at
create or replace function public.update_contact_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Create trigger to automatically update updated_at
create trigger contact_submissions_updated_at
  before update on public.contact_submissions
  for each row
  execute function public.update_contact_updated_at();

-- Grant permissions
grant all on public.contact_submissions to authenticated;
grant select, insert, update on public.contact_submissions to anon;
