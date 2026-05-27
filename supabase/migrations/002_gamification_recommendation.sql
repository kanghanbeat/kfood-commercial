create extension if not exists "pgcrypto";

do $$
begin
  if to_regclass('public.profiles') is not null then
    alter table public.profiles
      add column if not exists current_points integer not null default 0,
      add column if not exists total_accumulated_points integer not null default 0;

    if not exists (
      select 1 from pg_constraint where conname = 'profiles_current_points_non_negative'
    ) then
      alter table public.profiles
        add constraint profiles_current_points_non_negative check (current_points >= 0);
    end if;

    if not exists (
      select 1 from pg_constraint where conname = 'profiles_total_accumulated_points_non_negative'
    ) then
      alter table public.profiles
        add constraint profiles_total_accumulated_points_non_negative check (total_accumulated_points >= 0);
    end if;
  end if;
end $$;

do $$
begin
  create type public.point_event_type as enum (
    'post_created',
    'food_image_uploaded',
    'food_image_approved',
    'stamp_earned',
    'region_progress',
    'badge_earned',
    'post_liked',
    'content_rejected',
    'admin_adjustment'
  );
exception
  when duplicate_object then null;
end $$;

alter type public.point_event_type add value if not exists 'region_progress';
alter type public.point_event_type add value if not exists 'badge_earned';

do $$
begin
  create type public.recommendation_surface as enum (
    'home_feed',
    'best_posts',
    'food_detail',
    'region_detail',
    'discovery_hub'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.recommendation_event_type as enum ('shown', 'clicked', 'dismissed', 'saved');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type public.point_event_type not null,
  points integer not null,
  source_table text,
  source_id uuid,
  idempotency_key text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint point_transactions_non_zero check (points <> 0)
);

alter table public.point_transactions
  add column if not exists idempotency_key text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create unique index if not exists point_transactions_user_idempotency_key_idx
  on public.point_transactions(user_id, idempotency_key)
  where idempotency_key is not null;

create unique index if not exists point_transactions_user_event_source_idx
  on public.point_transactions(user_id, event_type, source_table, source_id)
  where source_table is not null and source_id is not null and points > 0;

create table if not exists public.anti_farming_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type public.point_event_type not null,
  source_table text,
  source_id uuid,
  blocked_reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.region_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  region_id uuid not null references public.regions(id) on delete cascade,
  completed_action_count integer not null default 0,
  target_action_count integer not null default 5,
  progress_percent integer not null default 0,
  last_action_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, region_id),
  constraint region_progress_completed_non_negative check (completed_action_count >= 0),
  constraint region_progress_target_positive check (target_action_count > 0),
  constraint region_progress_percent_range check (progress_percent between 0 and 100)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  badge_type text not null check (badge_type in ('region', 'food', 'streak', 'seasonal', 'community', 'admin')),
  region_id uuid references public.regions(id) on delete set null,
  food_id uuid references public.foods(id) on delete set null,
  required_progress integer not null default 1,
  reward_points integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint badges_required_progress_positive check (required_progress > 0),
  constraint badges_reward_points_non_negative check (reward_points >= 0)
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  source_table text,
  source_id uuid,
  unique(user_id, badge_id)
);

create table if not exists public.user_ranking_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  total_points integer not null default 0,
  current_points integer not null default 0,
  post_count integer not null default 0,
  approved_food_image_count integer not null default 0,
  stamp_count integer not null default 0,
  badge_count integer not null default 0,
  weekly_points integer not null default 0,
  monthly_points integer not null default 0,
  last_rank_calculated_at timestamptz,
  constraint user_ranking_stats_values_non_negative check (
    total_points >= 0 and current_points >= 0 and post_count >= 0
    and approved_food_image_count >= 0 and stamp_count >= 0 and badge_count >= 0
    and weekly_points >= 0 and monthly_points >= 0
  )
);

alter table public.user_ranking_stats
  add column if not exists badge_count integer not null default 0;

create table if not exists public.ranking_snapshots (
  id uuid primary key default gen_random_uuid(),
  period text not null check (period in ('weekly', 'monthly', 'all')),
  rank_position integer not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null,
  post_count integer not null default 0,
  stamp_count integer not null default 0,
  badge_count integer not null default 0,
  snapshot_at timestamptz not null default now(),
  constraint ranking_snapshots_rank_positive check (rank_position > 0),
  constraint ranking_snapshots_points_non_negative check (points >= 0)
);

create table if not exists public.recommendation_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'food', 'region')),
  target_id uuid not null,
  signal_type text not null check (
    signal_type in (
      'view',
      'like',
      'save',
      'search',
      'stamp',
      'region_progress',
      'badge',
      'manual',
      'shown',
      'clicked',
      'dismissed',
      'saved'
    )
  ),
  weight numeric not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  surface public.recommendation_surface not null,
  target_type text not null check (target_type in ('post', 'food', 'region')),
  target_id uuid not null,
  event_type public.recommendation_event_type not null,
  rank_position integer,
  score_snapshot numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint recommendation_events_rank_positive check (rank_position is null or rank_position > 0)
);

alter table public.recommendation_events
  add column if not exists metadata jsonb not null default '{}'::jsonb;

drop trigger if exists validate_point_transaction_before_insert on public.point_transactions;
drop trigger if exists apply_point_transaction_cache_after_insert on public.point_transactions;

create index if not exists point_transactions_user_created_at_idx on public.point_transactions(user_id, created_at desc);
create index if not exists anti_farming_events_user_created_at_idx on public.anti_farming_events(user_id, created_at desc);
create index if not exists region_progress_user_idx on public.region_progress(user_id);
create index if not exists badges_region_idx on public.badges(region_id);
create index if not exists user_badges_user_earned_at_idx on public.user_badges(user_id, earned_at desc);
create index if not exists user_ranking_stats_total_points_idx on public.user_ranking_stats(total_points desc);
create index if not exists user_ranking_stats_weekly_points_idx on public.user_ranking_stats(weekly_points desc);
create index if not exists user_ranking_stats_monthly_points_idx on public.user_ranking_stats(monthly_points desc);
create index if not exists ranking_snapshots_period_snapshot_idx on public.ranking_snapshots(period, snapshot_at desc, rank_position);
create index if not exists recommendation_signals_user_created_at_idx on public.recommendation_signals(user_id, created_at desc);
create index if not exists recommendation_signals_target_idx on public.recommendation_signals(target_type, target_id);
create index if not exists recommendation_events_user_created_at_idx on public.recommendation_events(user_id, created_at desc);
create index if not exists recommendation_events_target_idx on public.recommendation_events(target_type, target_id);

alter table public.point_transactions enable row level security;
alter table public.anti_farming_events enable row level security;
alter table public.region_progress enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.user_ranking_stats enable row level security;
alter table public.ranking_snapshots enable row level security;
alter table public.recommendation_signals enable row level security;
alter table public.recommendation_events enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid() and is_active = true),
    'user'::public.user_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin'::public.user_role;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_region_progress_updated_at on public.region_progress;
create trigger set_region_progress_updated_at
before update on public.region_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_badges_updated_at on public.badges;
create trigger set_badges_updated_at
before update on public.badges
for each row execute function public.set_updated_at();

create or replace function public.protect_profile_point_cache()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_setting('app.allow_profile_point_cache_update', true) = 'on' then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  if new.current_points is distinct from old.current_points
    or new.total_accumulated_points is distinct from old.total_accumulated_points
    or new.points is distinct from old.points
  then
    raise exception 'Point cache fields are maintained by ledger RPC functions.';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_point_cache_before_update on public.profiles;
create trigger protect_profile_point_cache_before_update
before update on public.profiles
for each row execute function public.protect_profile_point_cache();

create or replace function public.refresh_user_ranking_stats(p_user_id uuid)
returns public.user_ranking_stats
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.user_ranking_stats;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to refresh ranking stats.';
  end if;

  if p_user_id <> auth.uid() and not public.is_admin() then
    raise exception 'Cannot refresh ranking stats for another user.';
  end if;

  perform set_config('app.allow_profile_point_cache_update', 'on', true);

  insert into public.user_ranking_stats (
    user_id,
    total_points,
    current_points,
    weekly_points,
    monthly_points,
    stamp_count,
    badge_count,
    post_count,
    approved_food_image_count,
    last_rank_calculated_at
  )
  select
    profiles.id,
    coalesce(profiles.total_accumulated_points, 0),
    coalesce(profiles.current_points, profiles.points, 0),
    coalesce((select sum(points) from public.point_transactions where user_id = profiles.id and points > 0 and created_at >= now() - interval '7 days'), 0)::integer,
    coalesce((select sum(points) from public.point_transactions where user_id = profiles.id and points > 0 and created_at >= now() - interval '30 days'), 0)::integer,
    coalesce((select count(*) from public.user_stamp_progress where user_id = profiles.id and is_completed = true), 0)::integer,
    coalesce((select count(*) from public.user_badges where user_id = profiles.id), 0)::integer,
    coalesce((select count(*) from public.posts where user_id = profiles.id), 0)::integer,
    coalesce((select count(*) from public.food_image_uploads where user_id = profiles.id and review_status = 'approved'::public.upload_review_status), 0)::integer,
    now()
  from public.profiles
  where profiles.id = p_user_id
  on conflict (user_id) do update
  set
    total_points = excluded.total_points,
    current_points = excluded.current_points,
    weekly_points = excluded.weekly_points,
    monthly_points = excluded.monthly_points,
    stamp_count = excluded.stamp_count,
    badge_count = excluded.badge_count,
    post_count = excluded.post_count,
    approved_food_image_count = excluded.approved_food_image_count,
    last_rank_calculated_at = excluded.last_rank_calculated_at
  returning * into result_row;

  return result_row;
end;
$$;

create or replace function public.apply_point_transaction(
  p_user_id uuid,
  p_event_type public.point_event_type,
  p_points integer,
  p_source_table text default null,
  p_source_id uuid default null,
  p_reason text default null,
  p_idempotency_key text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.point_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_transaction public.point_transactions%rowtype;
  daily_total integer;
  result_row public.point_transactions%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to apply point transactions.';
  end if;

  if p_user_id <> auth.uid() and not public.is_admin() then
    raise exception 'Cannot apply point transactions for another user.';
  end if;

  if p_points = 0 then
    raise exception 'Point transaction must be non-zero.';
  end if;

  if p_idempotency_key is not null then
    select *
    into existing_transaction
    from public.point_transactions
    where user_id = p_user_id and idempotency_key = p_idempotency_key
    limit 1;

    if found then
      return existing_transaction;
    end if;
  end if;

  if p_points > 0 and p_source_table is not null and p_source_id is not null then
    select *
    into existing_transaction
    from public.point_transactions
    where user_id = p_user_id
      and event_type = p_event_type
      and source_table = p_source_table
      and source_id = p_source_id
      and points > 0
    limit 1;

    if found then
      insert into public.anti_farming_events (user_id, event_type, source_table, source_id, blocked_reason, metadata)
      values (p_user_id, p_event_type, p_source_table, p_source_id, 'duplicate_source_reward', p_metadata);
      return existing_transaction;
    end if;
  end if;

  if p_event_type = 'post_created'::public.point_event_type and p_points > 0 then
    select coalesce(sum(points), 0)::integer
    into daily_total
    from public.point_transactions
    where user_id = p_user_id
      and event_type = 'post_created'::public.point_event_type
      and points > 0
      and created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc';

    if daily_total + p_points > 5000 then
      insert into public.anti_farming_events (user_id, event_type, source_table, source_id, blocked_reason, metadata)
      values (p_user_id, p_event_type, p_source_table, p_source_id, 'daily_post_created_point_cap', p_metadata);
      raise exception 'Daily post_created point cap exceeded.';
    end if;
  end if;

  insert into public.point_transactions (
    user_id,
    event_type,
    points,
    source_table,
    source_id,
    idempotency_key,
    reason,
    metadata
  )
  values (
    p_user_id,
    p_event_type,
    p_points,
    p_source_table,
    p_source_id,
    p_idempotency_key,
    p_reason,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into result_row;

  perform set_config('app.allow_profile_point_cache_update', 'on', true);

  update public.profiles
  set
    current_points = greatest(0, current_points + p_points),
    total_accumulated_points = total_accumulated_points + greatest(p_points, 0),
    points = greatest(0, current_points + p_points)
  where id = p_user_id;

  perform public.refresh_user_ranking_stats(p_user_id);

  return result_row;
end;
$$;

create or replace function public.record_region_progress_action(
  p_user_id uuid,
  p_region_id uuid,
  p_source_table text default null,
  p_source_id uuid default null
)
returns public.region_progress
language plpgsql
security definer
set search_path = public
as $$
declare
  progress_row public.region_progress%rowtype;
  badge_record public.badges%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to record region progress.';
  end if;

  if p_user_id <> auth.uid() and not public.is_admin() then
    raise exception 'Cannot record region progress for another user.';
  end if;

  insert into public.region_progress (user_id, region_id, completed_action_count, progress_percent, last_action_at)
  values (p_user_id, p_region_id, 1, 20, now())
  on conflict (user_id, region_id) do update
  set
    completed_action_count = public.region_progress.completed_action_count + 1,
    progress_percent = least(100, round(((public.region_progress.completed_action_count + 1)::numeric / public.region_progress.target_action_count) * 100)::integer),
    last_action_at = now(),
    completed_at = case
      when public.region_progress.completed_at is not null then public.region_progress.completed_at
      when public.region_progress.completed_action_count + 1 >= public.region_progress.target_action_count then now()
      else null
    end
  returning * into progress_row;

  perform public.apply_point_transaction(
    p_user_id,
    'region_progress'::public.point_event_type,
    10,
    p_source_table,
    p_source_id,
    'Region progress action',
    case when p_source_table is null or p_source_id is null then null else 'region-progress:' || p_source_table || ':' || p_source_id::text end,
    jsonb_build_object('region_id', p_region_id)
  );

  for badge_record in
    select *
    from public.badges
    where is_active = true
      and badge_type = 'region'
      and region_id = p_region_id
      and required_progress <= progress_row.completed_action_count
  loop
    insert into public.user_badges (user_id, badge_id, source_table, source_id)
    values (p_user_id, badge_record.id, 'region_progress', progress_row.id)
    on conflict (user_id, badge_id) do nothing;

    if found then
      perform public.apply_point_transaction(
        p_user_id,
        'badge_earned'::public.point_event_type,
        badge_record.reward_points,
        'badges',
        badge_record.id,
        'Badge earned: ' || badge_record.name,
        'badge:' || badge_record.id::text,
        jsonb_build_object('region_id', p_region_id)
      );
    end if;
  end loop;

  return progress_row;
end;
$$;

create or replace function public.record_recommendation_event(
  p_user_id uuid,
  p_surface public.recommendation_surface,
  p_target_type text,
  p_target_id uuid,
  p_event_type public.recommendation_event_type,
  p_rank_position integer default null,
  p_score_snapshot numeric default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.recommendation_events
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.recommendation_events%rowtype;
  signal_weight numeric;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to record recommendation events.';
  end if;

  if p_user_id <> auth.uid() and not public.is_admin() then
    raise exception 'Cannot record recommendation events for another user.';
  end if;

  insert into public.recommendation_events (
    user_id,
    surface,
    target_type,
    target_id,
    event_type,
    rank_position,
    score_snapshot,
    metadata
  )
  values (
    p_user_id,
    p_surface,
    p_target_type,
    p_target_id,
    p_event_type,
    p_rank_position,
    p_score_snapshot,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into result_row;

  signal_weight := case p_event_type
    when 'clicked'::public.recommendation_event_type then 3
    when 'saved'::public.recommendation_event_type then 5
    when 'dismissed'::public.recommendation_event_type then -2
    else 1
  end;

  insert into public.recommendation_signals (user_id, target_type, target_id, signal_type, weight, metadata)
  values (p_user_id, p_target_type, p_target_id, p_event_type::text, signal_weight, jsonb_build_object('surface', p_surface));

  return result_row;
end;
$$;

create or replace function public.refresh_ranking_snapshot(p_period text default 'all', p_limit integer default 100)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
begin
  if not public.is_admin() then
    raise exception 'Only admins can create ranking snapshots.';
  end if;

  if p_period not in ('weekly', 'monthly', 'all') then
    raise exception 'Invalid ranking snapshot period.';
  end if;

  insert into public.ranking_snapshots (
    period,
    rank_position,
    user_id,
    points,
    post_count,
    stamp_count,
    badge_count,
    snapshot_at
  )
  select
    p_period,
    row_number() over (
      order by
        case
          when p_period = 'weekly' then weekly_points
          when p_period = 'monthly' then monthly_points
          else total_points
        end desc,
        user_id
    )::integer,
    user_id,
    case
      when p_period = 'weekly' then weekly_points
      when p_period = 'monthly' then monthly_points
      else total_points
    end,
    post_count,
    stamp_count,
    badge_count,
    now()
  from public.user_ranking_stats
  order by
    case
      when p_period = 'weekly' then weekly_points
      when p_period = 'monthly' then monthly_points
      else total_points
    end desc,
    user_id
  limit greatest(1, least(coalesce(p_limit, 100), 500));

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

drop policy if exists "point_transactions_select_own" on public.point_transactions;
create policy "point_transactions_select_own" on public.point_transactions
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "point_transactions_insert_own_mvp" on public.point_transactions;

drop policy if exists "anti_farming_events_select_own" on public.anti_farming_events;
create policy "anti_farming_events_select_own" on public.anti_farming_events
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "region_progress_select_own" on public.region_progress;
create policy "region_progress_select_own" on public.region_progress
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "badges_select_active" on public.badges;
create policy "badges_select_active" on public.badges
for select to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "badges_admin_manage" on public.badges;
create policy "badges_admin_manage" on public.badges
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "user_badges_select_own" on public.user_badges;
create policy "user_badges_select_own" on public.user_badges
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "user_ranking_stats_authenticated_select" on public.user_ranking_stats;
create policy "user_ranking_stats_authenticated_select" on public.user_ranking_stats
for select to authenticated
using (true);

drop policy if exists "ranking_snapshots_authenticated_select" on public.ranking_snapshots;
create policy "ranking_snapshots_authenticated_select" on public.ranking_snapshots
for select to authenticated
using (true);

drop policy if exists "recommendation_signals_select_own" on public.recommendation_signals;
create policy "recommendation_signals_select_own" on public.recommendation_signals
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "recommendation_events_select_own" on public.recommendation_events;
create policy "recommendation_events_select_own" on public.recommendation_events
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "recommendation_events_insert_own" on public.recommendation_events;

revoke insert, update, delete on public.point_transactions from authenticated;
revoke insert, update, delete on public.anti_farming_events from authenticated;
revoke insert, update, delete on public.region_progress from authenticated;
revoke insert, update, delete on public.user_badges from authenticated;
revoke insert, update, delete on public.user_ranking_stats from authenticated;
revoke insert, update, delete on public.ranking_snapshots from authenticated;
revoke insert, update, delete on public.recommendation_signals from authenticated;
revoke insert, update, delete on public.recommendation_events from authenticated;

grant execute on function public.apply_point_transaction(
  uuid,
  public.point_event_type,
  integer,
  text,
  uuid,
  text,
  text,
  jsonb
) to authenticated;

grant execute on function public.record_region_progress_action(uuid, uuid, text, uuid) to authenticated;

grant execute on function public.record_recommendation_event(
  uuid,
  public.recommendation_surface,
  text,
  uuid,
  public.recommendation_event_type,
  integer,
  numeric,
  jsonb
) to authenticated;

grant execute on function public.refresh_user_ranking_stats(uuid) to authenticated;
grant execute on function public.refresh_ranking_snapshot(text, integer) to authenticated;
