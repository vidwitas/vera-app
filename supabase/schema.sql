-- ============================================================
-- VeRa — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── ENUMS ───────────────────────────────────────────────────
create type budget_tier as enum ('budget', 'mid', 'luxury', 'ultra');
create type travel_style as enum (
  'adventure', 'culture', 'food', 'nature', 'nightlife',
  'wellness', 'art', 'history', 'beach', 'city', 'remote'
);
create type region as enum (
  'europe', 'asia', 'americas', 'africa', 'middle_east', 'oceania'
);

-- ─── PROFILES ────────────────────────────────────────────────
create table profiles (
  id             uuid references auth.users on delete cascade primary key,
  email          text not null,
  full_name      text,
  cohort         text,
  bio            text,
  travel_styles  travel_style[]  default '{}',
  avatar_url     text,
  email_verified boolean         default false,
  created_at     timestamptz     default now() not null,
  updated_at     timestamptz     default now() not null
);

alter table profiles enable row level security;

-- Profiles: anyone authenticated can read; only owner can write
create policy "profiles_select" on profiles
  for select to authenticated using (true);

create policy "profiles_insert" on profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "profiles_update" on profiles
  for update to authenticated using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── TRIPS ───────────────────────────────────────────────────
create table trips (
  id             uuid            default uuid_generate_v4() primary key,
  user_id        uuid            references profiles(id) on delete cascade not null,
  destination    text            not null,
  country        text            not null,
  region         region          not null,
  start_date     date            not null,
  end_date       date            not null,
  budget_tier    budget_tier     not null,
  travel_styles  travel_style[]  default '{}',
  group_size     integer         not null default 4,
  description    text            not null default '',
  is_open        boolean         not null default true,
  created_at     timestamptz     default now() not null,
  updated_at     timestamptz     default now() not null,
  constraint valid_dates check (end_date >= start_date),
  constraint valid_group_size check (group_size between 1 and 20)
);

alter table trips enable row level security;

create policy "trips_select" on trips
  for select to authenticated using (true);

create policy "trips_insert" on trips
  for insert to authenticated with check (auth.uid() = user_id);

create policy "trips_update" on trips
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "trips_delete" on trips
  for delete to authenticated using (auth.uid() = user_id);

-- ─── TRIP INTERESTS ──────────────────────────────────────────
create table trip_interests (
  id         uuid        default uuid_generate_v4() primary key,
  trip_id    uuid        references trips(id) on delete cascade not null,
  user_id    uuid        references profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (trip_id, user_id)
);

alter table trip_interests enable row level security;

create policy "interests_select" on trip_interests
  for select to authenticated using (true);

create policy "interests_insert" on trip_interests
  for insert to authenticated with check (auth.uid() = user_id);

create policy "interests_delete" on trip_interests
  for delete to authenticated using (auth.uid() = user_id);

-- ─── INDEXES ─────────────────────────────────────────────────
create index trips_user_id_idx    on trips (user_id);
create index trips_region_idx     on trips (region);
create index trips_start_date_idx on trips (start_date);
create index trips_is_open_idx    on trips (is_open);
create index interests_trip_idx   on trip_interests (trip_id);
create index interests_user_idx   on trip_interests (user_id);

-- ─── AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, cohort, travel_styles, email_verified)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'cohort',
    case
      when new.raw_user_meta_data->>'travel_styles' is not null
      then (
        select array_agg(x::travel_style)
        from json_array_elements_text(
          (new.raw_user_meta_data->>'travel_styles')::json
        ) as x
      )
      else '{}'::travel_style[]
    end,
    new.email_confirmed_at is not null
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── KEEP email_verified IN SYNC ─────────────────────────────
create or replace function sync_email_verified()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set email_verified = (new.email_confirmed_at is not null),
      updated_at = now()
  where id = new.id;
  return new;
end;
$$;

create or replace trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure sync_email_verified();

-- ─── AUTO-UPDATE updated_at ───────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger trips_updated_at
  before update on trips
  for each row execute procedure set_updated_at();
