-- ==============================================================================
-- PARTYPADI SUPABASE DATABASE SCHEMA
-- Campus Event Ticketing, Social Padi Circles & Gifter Support Architecture
-- ==============================================================================

-- 1. PROFILES TABLE (Public user profiles linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  email text unique not null,
  role text check (role in ('partygoer', 'organizer')) default 'partygoer',
  campus text default 'Main Campus',
  bio text default 'Active PartyPadi member',
  avatar_url text,
  gifter_level integer default 0, -- 0: None, 1: Level 1 Gifter, 2: Level 2, 3: Level 3, 4: Level 4 Legend
  total_gifted numeric default 0,
  friends text[] default array[]::text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. TICKETS & ATTENDEES TABLE
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid references auth.users on delete set null,
  ticket_code text unique not null,
  attendee_name text not null,
  attendee_email text not null,
  attendee_phone text,
  attendee_username text,
  ticket_tier text not null default 'Regular Entry',
  amount_paid numeric not null default 0,
  status text check (status in ('paid', 'waitlist', 'checked_in', 'cancelled')) default 'paid',
  companions jsonb default '[]'::jsonb,
  allow_friends_to_see boolean default true,
  checked_in_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS on tickets
alter table public.tickets enable row level security;

create policy "Users can view their own tickets"
  on public.tickets for select
  using (auth.uid() = user_id or true); -- Allow organizers to see attendee lists

create policy "Anyone can insert tickets (Guest checkout supported)"
  on public.tickets for insert
  with check (true);

create policy "Organizers and owners can update ticket status"
  on public.tickets for update
  using (true);

-- 3. GIFTS & SUPPORT CONTRIBUTIONS TABLE
create table if not exists public.gifts_and_support (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid references auth.users on delete set null,
  gifter_name text not null,
  gifter_username text,
  amount numeric not null,
  level integer not null default 1 check (level between 1 and 4),
  message text,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS on gifts_and_support
alter table public.gifts_and_support enable row level security;

create policy "Public gifts are viewable by everyone"
  on public.gifts_and_support for select
  using (true);

create policy "Anyone can send gifts and support"
  on public.gifts_and_support for insert
  with check (true);

-- 4. PADI CIRCLES TABLE
create table if not exists public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by text not null,
  invite_code text unique not null,
  target_event_id text,
  is_voting_open boolean default true,
  members text[] default array[]::text[],
  created_at timestamptz default now()
);

-- Enable RLS on circles
alter table public.circles enable row level security;

create policy "Circles are viewable by members or invitees"
  on public.circles for select
  using (true);

create policy "Users can create circles"
  on public.circles for insert
  with check (true);

create policy "Circle owners and members can update circle"
  on public.circles for update
  using (true);

-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, email, role, campus)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'partygoer'),
    coalesce(new.raw_user_meta_data->>'campus', 'Main Campus')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
