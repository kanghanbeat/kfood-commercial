create extension if not exists "pgcrypto";

alter table public.profiles
  add column if not exists current_points integer not null default 0,
  add column if not exists total_accumulated_points integer not null default 0;

do $$
begin
  alter table public.profiles
    add constraint profiles_current_points_nonnegative check (current_points >= 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.profiles
    add constraint profiles_total_accumulated_points_nonnegative check (total_accumulated_points >= 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.point_event_type as enum (
    'post_created',
    'food_image_uploaded',
    'food_image_approved',
    'stamp_earned',
    'post_liked',
    'content_rejected',
    'admin_adjustment'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.behavior_event_type as enum (
    'post_view',
    'post_like',
    'post_save',
    'post_create',
    'food_image_upload',
    'food_image_approved',
    'stamp_earned',
    'region_view',
    'food_view',
    'search'
  );
exception
  when duplicate_object then null;
end $$;

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

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type public.point_event_type not null,
  points integer not null,
  source_table text,
  source_id uuid,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.stamp_definitions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  action_type text not null,
  category text not null,
  condition_value integer not null default 1,
  reward_points integer not null default 30,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stamp_definitions_condition_positive check (condition_value > 0),
  constraint stamp_definitions_reward_nonnegative check (reward_points >= 0)
);

create table if not exists public.user_stamp_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stamp_id uuid not null references public.stamp_definitions(id) on delete cascade,
  action_type text not null,
  category text not null,
  current_value integer not null default 0,
  condition_value integer not null default 1,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, stamp_id),
  constraint user_stamp_progress_current_nonnegative check (current_value >= 0),
  constraint user_stamp_progress_condition_positive check (condition_value > 0)
);

create table if not exists public.user_ranking_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  total_points integer not null default 0,
  current_points integer not null default 0,
  post_count integer not null default 0,
  approved_food_image_count integer not null default 0,
  stamp_count integer not null default 0,
  weekly_points integer not null default 0,
  monthly_points integer not null default 0,
  last_rank_calculated_at timestamptz,
  constraint user_ranking_stats_total_nonnegative check (total_points >= 0),
  constraint user_ranking_stats_current_nonnegative check (current_points >= 0),
  constraint user_ranking_stats_posts_nonnegative check (post_count >= 0),
  constraint user_ranking_stats_images_nonnegative check (approved_food_image_count >= 0),
  constraint user_ranking_stats_stamps_nonnegative check (stamp_count >= 0)
);

create table if not exists public.user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  preferred_food_categories text[] not null default '{}',
  preferred_regions uuid[] not null default '{}',
  interest_weights jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_behavior_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  event_type public.behavior_event_type not null,
  target_type text check (target_type in ('post', 'food', 'region', 'stamp', 'search')),
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.post_stats (
  post_id uuid primary key references public.posts(id) on delete cascade,
  view_count integer not null default 0,
  like_count integer not null default 0,
  comment_count integer not null default 0,
  save_count integer not null default 0,
  share_count integer not null default 0,
  report_count integer not null default 0,
  recommendation_score numeric not null default 0,
  popularity_score numeric not null default 0,
  updated_at timestamptz not null default now(),
  constraint post_stats_counts_nonnegative check (
    view_count >= 0 and like_count >= 0 and comment_count >= 0 and save_count >= 0 and share_count >= 0 and report_count >= 0
  )
);

create table if not exists public.food_popularity_scores (
  food_id uuid primary key references public.foods(id) on delete cascade,
  view_count integer not null default 0,
  post_count integer not null default 0,
  approved_image_count integer not null default 0,
  stamp_earned_count integer not null default 0,
  search_count integer not null default 0,
  popularity_score numeric not null default 0,
  updated_at timestamptz not null default now(),
  constraint food_popularity_counts_nonnegative check (
    view_count >= 0 and post_count >= 0 and approved_image_count >= 0 and stamp_earned_count >= 0 and search_count >= 0
  )
);

create table if not exists public.region_popularity_scores (
  region_id uuid primary key references public.regions(id) on delete cascade,
  view_count integer not null default 0,
  post_count integer not null default 0,
  stamp_earned_count integer not null default 0,
  search_count integer not null default 0,
  popularity_score numeric not null default 0,
  updated_at timestamptz not null default now(),
  constraint region_popularity_counts_nonnegative check (
    view_count >= 0 and post_count >= 0 and stamp_earned_count >= 0 and search_count >= 0
  )
);

create table if not exists public.recommendation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  surface public.recommendation_surface not null,
  target_type text not null check (target_type in ('post', 'food', 'region')),
  target_id uuid not null,
  event_type text not null check (event_type in ('shown', 'clicked', 'dismissed', 'saved')),
  rank_position integer,
  score_snapshot numeric,
  created_at timestamptz not null default now(),
  constraint recommendation_events_rank_positive check (rank_position is null or rank_position > 0)
);

create index if not exists point_transactions_user_created_at_idx on public.point_transactions(user_id, created_at desc);
create index if not exists point_transactions_event_created_at_idx on public.point_transactions(event_type, created_at desc);
create index if not exists point_transactions_user_event_created_at_idx on public.point_transactions(user_id, event_type, created_at desc);
create index if not exists user_behavior_logs_user_event_created_at_idx on public.user_behavior_logs(user_id, event_type, created_at desc);
create index if not exists user_behavior_logs_target_created_at_idx on public.user_behavior_logs(target_type, target_id, created_at desc);
create index if not exists post_stats_popularity_score_idx on public.post_stats(popularity_score desc);
create index if not exists post_stats_recommendation_score_idx on public.post_stats(recommendation_score desc);
create index if not exists post_stats_updated_at_idx on public.post_stats(updated_at desc);
create index if not exists recommendation_events_user_created_at_idx on public.recommendation_events(user_id, created_at desc);
create index if not exists recommendation_events_target_idx on public.recommendation_events(target_type, target_id);
create index if not exists user_stamp_progress_user_completed_idx on public.user_stamp_progress(user_id, is_completed);
create index if not exists user_stamp_progress_action_category_idx on public.user_stamp_progress(action_type, category);
create index if not exists user_interests_user_id_idx on public.user_interests(user_id);
create index if not exists user_interests_preferred_food_categories_idx on public.user_interests using gin(preferred_food_categories);
create index if not exists user_interests_preferred_regions_idx on public.user_interests using gin(preferred_regions);
create index if not exists food_popularity_scores_popularity_score_idx on public.food_popularity_scores(popularity_score desc);
create index if not exists region_popularity_scores_popularity_score_idx on public.region_popularity_scores(popularity_score desc);

alter table public.point_transactions enable row level security;
alter table public.stamp_definitions enable row level security;
alter table public.user_stamp_progress enable row level security;
alter table public.user_ranking_stats enable row level security;
alter table public.user_interests enable row level security;
alter table public.user_behavior_logs enable row level security;
alter table public.post_stats enable row level security;
alter table public.food_popularity_scores enable row level security;
alter table public.region_popularity_scores enable row level security;
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

drop policy if exists "point_transactions_select_own" on public.point_transactions;
create policy "point_transactions_select_own" on public.point_transactions
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "point_transactions_insert_own_mvp" on public.point_transactions;
create policy "point_transactions_insert_own_mvp" on public.point_transactions
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "stamp_definitions_authenticated_select_active" on public.stamp_definitions;
create policy "stamp_definitions_authenticated_select_active" on public.stamp_definitions
for select to authenticated
using (is_active = true);

drop policy if exists "stamp_definitions_admin_manage" on public.stamp_definitions;
create policy "stamp_definitions_admin_manage" on public.stamp_definitions
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "user_stamp_progress_select_own" on public.user_stamp_progress;
create policy "user_stamp_progress_select_own" on public.user_stamp_progress
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "user_ranking_stats_authenticated_select" on public.user_ranking_stats;
create policy "user_ranking_stats_authenticated_select" on public.user_ranking_stats
for select to authenticated
using (true);

drop policy if exists "user_interests_select_own" on public.user_interests;
create policy "user_interests_select_own" on public.user_interests
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "user_interests_insert_own" on public.user_interests;
create policy "user_interests_insert_own" on public.user_interests
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "user_interests_update_own" on public.user_interests;
create policy "user_interests_update_own" on public.user_interests
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "user_behavior_logs_insert_own" on public.user_behavior_logs;
create policy "user_behavior_logs_insert_own" on public.user_behavior_logs
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "user_behavior_logs_select_own" on public.user_behavior_logs;
create policy "user_behavior_logs_select_own" on public.user_behavior_logs
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "post_stats_authenticated_select" on public.post_stats;
create policy "post_stats_authenticated_select" on public.post_stats
for select to authenticated
using (true);

drop policy if exists "food_popularity_scores_authenticated_select" on public.food_popularity_scores;
create policy "food_popularity_scores_authenticated_select" on public.food_popularity_scores
for select to authenticated
using (true);

drop policy if exists "region_popularity_scores_authenticated_select" on public.region_popularity_scores;
create policy "region_popularity_scores_authenticated_select" on public.region_popularity_scores
for select to authenticated
using (true);

drop policy if exists "recommendation_events_insert_own" on public.recommendation_events;
create policy "recommendation_events_insert_own" on public.recommendation_events
for insert to authenticated
with check (user_id = auth.uid());

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

drop trigger if exists set_stamp_definitions_updated_at on public.stamp_definitions;
create trigger set_stamp_definitions_updated_at
before update on public.stamp_definitions
for each row execute function public.set_updated_at();

drop trigger if exists set_user_stamp_progress_updated_at on public.user_stamp_progress;
create trigger set_user_stamp_progress_updated_at
before update on public.user_stamp_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_user_interests_updated_at on public.user_interests;
create trigger set_user_interests_updated_at
before update on public.user_interests
for each row execute function public.set_updated_at();

drop trigger if exists set_post_stats_updated_at on public.post_stats;
create trigger set_post_stats_updated_at
before update on public.post_stats
for each row execute function public.set_updated_at();

drop trigger if exists set_food_popularity_scores_updated_at on public.food_popularity_scores;
create trigger set_food_popularity_scores_updated_at
before update on public.food_popularity_scores
for each row execute function public.set_updated_at();

drop trigger if exists set_region_popularity_scores_updated_at on public.region_popularity_scores;
create trigger set_region_popularity_scores_updated_at
before update on public.region_popularity_scores
for each row execute function public.set_updated_at();

create or replace function public.validate_point_transaction()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  current_daily_total integer;
begin
  -- Phase 2 uses UTC day boundaries because no user-local business timezone is stored in the current schema.
  if new.event_type = 'post_created'::public.point_event_type and new.points > 0 then
    select coalesce(sum(points), 0)
    into current_daily_total
    from public.point_transactions
    where user_id = new.user_id
      and event_type = 'post_created'::public.point_event_type
      and points > 0
      and created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc'
      and created_at < (date_trunc('day', now() at time zone 'utc') + interval '1 day') at time zone 'utc';

    if current_daily_total + new.points > 5000 then
      raise exception 'Daily post_created point cap exceeded. Maximum positive post_created points per UTC day is 5000.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_point_transaction_before_insert on public.point_transactions;
create trigger validate_point_transaction_before_insert
before insert on public.point_transactions
for each row execute function public.validate_point_transaction();

create or replace function public.apply_point_transaction_cache()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  cached_current integer;
  cached_total integer;
begin
  update public.profiles
  set
    current_points = greatest(0, current_points + new.points),
    total_accumulated_points = total_accumulated_points + greatest(new.points, 0),
    points = greatest(0, current_points + new.points)
  where id = new.user_id
  returning current_points, total_accumulated_points
  into cached_current, cached_total;

  insert into public.user_ranking_stats (user_id, total_points, current_points, last_rank_calculated_at)
  values (new.user_id, coalesce(cached_total, 0), coalesce(cached_current, 0), now())
  on conflict (user_id) do update
  set
    total_points = excluded.total_points,
    current_points = excluded.current_points,
    last_rank_calculated_at = now();

  return new;
end;
$$;

drop trigger if exists apply_point_transaction_cache_after_insert on public.point_transactions;
create trigger apply_point_transaction_cache_after_insert
after insert on public.point_transactions
for each row execute function public.apply_point_transaction_cache();

create or replace function public.refresh_user_ranking_stats(p_user_id uuid)
returns public.user_ranking_stats
language plpgsql
security definer
set search_path = public
as $$
declare
  recalculated_total integer;
  cached_current integer;
  recalculated_weekly integer;
  recalculated_monthly integer;
  recalculated_stamps integer;
  recalculated_posts integer;
  recalculated_approved_images integer;
  result_row public.user_ranking_stats;
begin
  select coalesce(sum(points), 0)::integer
  into recalculated_total
  from public.point_transactions
  where user_id = p_user_id and points > 0;

  select coalesce(current_points, 0)
  into cached_current
  from public.profiles
  where id = p_user_id;

  select coalesce(sum(points), 0)::integer
  into recalculated_weekly
  from public.point_transactions
  where user_id = p_user_id and points > 0 and created_at >= now() - interval '7 days';

  select coalesce(sum(points), 0)::integer
  into recalculated_monthly
  from public.point_transactions
  where user_id = p_user_id and points > 0 and created_at >= now() - interval '30 days';

  select count(*)::integer
  into recalculated_stamps
  from public.user_stamp_progress
  where user_id = p_user_id and is_completed = true;

  select count(*)::integer
  into recalculated_posts
  from public.posts
  where user_id = p_user_id;

  select count(*)::integer
  into recalculated_approved_images
  from public.food_image_uploads
  where user_id = p_user_id and review_status = 'approved'::public.upload_review_status;

  insert into public.user_ranking_stats (
    user_id,
    total_points,
    current_points,
    weekly_points,
    monthly_points,
    stamp_count,
    post_count,
    approved_food_image_count,
    last_rank_calculated_at
  )
  values (
    p_user_id,
    recalculated_total,
    coalesce(cached_current, 0),
    recalculated_weekly,
    recalculated_monthly,
    recalculated_stamps,
    recalculated_posts,
    recalculated_approved_images,
    now()
  )
  on conflict (user_id) do update
  set
    total_points = excluded.total_points,
    current_points = excluded.current_points,
    weekly_points = excluded.weekly_points,
    monthly_points = excluded.monthly_points,
    stamp_count = excluded.stamp_count,
    post_count = excluded.post_count,
    approved_food_image_count = excluded.approved_food_image_count,
    last_rank_calculated_at = excluded.last_rank_calculated_at
  returning * into result_row;

  return result_row;
end;
$$;

create or replace function public.check_and_increment_stamp_progress(
  p_user_id uuid,
  p_action_type text,
  p_category text
)
returns table (
  stamp_id uuid,
  code text,
  name text,
  current_value integer,
  condition_value integer,
  is_completed boolean,
  reward_points integer,
  awarded_points boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  stamp_record public.stamp_definitions%rowtype;
  progress_record public.user_stamp_progress%rowtype;
  was_completed boolean;
  just_awarded boolean;
begin
  for stamp_record in
    select *
    from public.stamp_definitions
    where is_active = true
      and action_type = p_action_type
      and category = p_category
  loop
    just_awarded := false;

    insert into public.user_stamp_progress (
      user_id,
      stamp_id,
      action_type,
      category,
      current_value,
      condition_value
    )
    values (
      p_user_id,
      stamp_record.id,
      stamp_record.action_type,
      stamp_record.category,
      0,
      stamp_record.condition_value
    )
    on conflict (user_id, stamp_id) do nothing;

    select progress.is_completed
    into was_completed
    from public.user_stamp_progress progress
    where progress.user_id = p_user_id
      and progress.stamp_id = stamp_record.id;

    update public.user_stamp_progress progress
    set
      current_value = case
        when progress.is_completed then progress.current_value
        else least(progress.current_value + 1, progress.condition_value)
      end,
      is_completed = case
        when progress.is_completed then true
        else progress.current_value + 1 >= progress.condition_value
      end,
      completed_at = case
        when progress.is_completed then progress.completed_at
        when progress.current_value + 1 >= progress.condition_value then now()
        else progress.completed_at
      end
    where progress.user_id = p_user_id
      and progress.stamp_id = stamp_record.id
    returning * into progress_record;

    if progress_record.is_completed and coalesce(was_completed, false) = false then
      just_awarded := true;

      insert into public.point_transactions (user_id, event_type, points, source_table, source_id, reason)
      values (
        p_user_id,
        'stamp_earned'::public.point_event_type,
        stamp_record.reward_points,
        'stamp_definitions',
        stamp_record.id,
        'Stamp earned: ' || stamp_record.name
      );

      insert into public.user_behavior_logs (user_id, event_type, target_type, target_id, metadata)
      values (
        p_user_id,
        'stamp_earned'::public.behavior_event_type,
        'stamp',
        stamp_record.id,
        jsonb_build_object('code', stamp_record.code, 'category', stamp_record.category)
      );

      insert into public.user_ranking_stats (user_id, stamp_count, last_rank_calculated_at)
      values (p_user_id, 1, now())
      on conflict (user_id) do update
      set stamp_count = public.user_ranking_stats.stamp_count + 1,
          last_rank_calculated_at = now();
    end if;

    stamp_id := stamp_record.id;
    code := stamp_record.code;
    name := stamp_record.name;
    current_value := progress_record.current_value;
    condition_value := progress_record.condition_value;
    is_completed := progress_record.is_completed;
    reward_points := stamp_record.reward_points;
    awarded_points := just_awarded;
    return next;
  end loop;
end;
$$;

create or replace function public.increment_post_view(p_post_id uuid)
returns public.post_stats
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.post_stats;
begin
  insert into public.post_stats (post_id, view_count, popularity_score, updated_at)
  values (p_post_id, 1, 0.1, now())
  on conflict (post_id) do update
  set
    view_count = public.post_stats.view_count + 1,
    popularity_score =
      (public.post_stats.like_count * 3)
      + (public.post_stats.save_count * 5)
      + (public.post_stats.comment_count * 2)
      + ((public.post_stats.view_count + 1) * 0.1)
      - (public.post_stats.report_count * 10),
    updated_at = now()
  returning * into result_row;

  return result_row;
end;
$$;

create or replace function public.increment_food_view(p_food_id uuid)
returns public.food_popularity_scores
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.food_popularity_scores;
begin
  insert into public.food_popularity_scores (food_id, view_count, popularity_score, updated_at)
  values (p_food_id, 1, 0.1, now())
  on conflict (food_id) do update
  set
    view_count = public.food_popularity_scores.view_count + 1,
    popularity_score =
      (public.food_popularity_scores.approved_image_count * 5)
      + (public.food_popularity_scores.post_count * 3)
      + (public.food_popularity_scores.stamp_earned_count * 4)
      + ((public.food_popularity_scores.view_count + 1) * 0.1)
      + (public.food_popularity_scores.search_count * 0.5),
    updated_at = now()
  returning * into result_row;

  return result_row;
end;
$$;

create or replace function public.increment_region_view(p_region_id uuid)
returns public.region_popularity_scores
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.region_popularity_scores;
begin
  insert into public.region_popularity_scores (region_id, view_count, popularity_score, updated_at)
  values (p_region_id, 1, 0.1, now())
  on conflict (region_id) do update
  set
    view_count = public.region_popularity_scores.view_count + 1,
    popularity_score =
      (public.region_popularity_scores.post_count * 3)
      + (public.region_popularity_scores.stamp_earned_count * 5)
      + ((public.region_popularity_scores.view_count + 1) * 0.1)
      + (public.region_popularity_scores.search_count * 0.5),
    updated_at = now()
  returning * into result_row;

  return result_row;
end;
$$;

create or replace function public.get_personalized_feed(
  p_user_id uuid,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  post_id uuid,
  title text,
  content text,
  image_url text,
  category text,
  region_id uuid,
  food_id uuid,
  like_count integer,
  view_count integer,
  score numeric,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    posts.id as post_id,
    posts.title,
    posts.content,
    posts.image_url,
    coalesce(foods.category, '') as category,
    posts.region_id,
    posts.food_id,
    coalesce(post_stats.like_count, 0) as like_count,
    coalesce(post_stats.view_count, 0) as view_count,
    (
      (coalesce(post_stats.like_count, 0) * 5)
      + (coalesce(post_stats.view_count, 0) * 1)
      + case
          when coalesce(foods.category, '') = any(coalesce(user_interests.preferred_food_categories, '{}'))
          then 50
          else 0
        end
    )::numeric as score,
    posts.created_at
  from public.posts
  left join public.foods on foods.id = posts.food_id
  left join public.post_stats on post_stats.post_id = posts.id
  left join public.user_interests on user_interests.user_id = p_user_id
  where posts.status = 'published'::public.post_status
  order by score desc, posts.created_at desc
  limit greatest(1, least(coalesce(p_limit, 20), 100))
  offset greatest(0, coalesce(p_offset, 0));
$$;

create or replace function public.handle_approved_food_image_signal(
  p_user_id uuid,
  p_food_id uuid,
  p_region_id uuid,
  p_food_category text,
  p_source_id uuid
)
returns table (
  awarded_points integer,
  updated_food_score numeric,
  stamp_results jsonb,
  ranking_refreshed boolean,
  message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  food_stats public.food_popularity_scores%rowtype;
  stamp_payload jsonb;
  category_weight numeric;
begin
  insert into public.point_transactions (user_id, event_type, points, source_table, source_id, reason)
  values (
    p_user_id,
    'food_image_approved'::public.point_event_type,
    120,
    'food_image_uploads',
    p_source_id,
    'Food image approved'
  );

  insert into public.user_behavior_logs (user_id, event_type, target_type, target_id, metadata)
  values (
    p_user_id,
    'food_image_approved'::public.behavior_event_type,
    'food',
    p_food_id,
    jsonb_build_object('region_id', p_region_id, 'food_category', p_food_category, 'source_id', p_source_id)
  );

  insert into public.food_popularity_scores (food_id, approved_image_count, popularity_score, updated_at)
  values (p_food_id, 1, 5, now())
  on conflict (food_id) do update
  set
    approved_image_count = public.food_popularity_scores.approved_image_count + 1,
    popularity_score =
      ((public.food_popularity_scores.approved_image_count + 1) * 5)
      + (public.food_popularity_scores.post_count * 3)
      + (public.food_popularity_scores.stamp_earned_count * 4)
      + (public.food_popularity_scores.view_count * 0.1)
      + (public.food_popularity_scores.search_count * 0.5),
    updated_at = now()
  returning * into food_stats;

  if p_food_category is not null and length(trim(p_food_category)) > 0 then
    select coalesce((interest_weights ->> p_food_category)::numeric, 0) + 1
    into category_weight
    from public.user_interests
    where user_id = p_user_id;

    insert into public.user_interests (
      user_id,
      preferred_food_categories,
      preferred_regions,
      interest_weights
    )
    values (
      p_user_id,
      array[p_food_category],
      case when p_region_id is null then '{}'::uuid[] else array[p_region_id] end,
      jsonb_build_object(p_food_category, 1)
    )
    on conflict (user_id) do update
    set
      preferred_food_categories = case
        when p_food_category = any(public.user_interests.preferred_food_categories)
        then public.user_interests.preferred_food_categories
        else array_append(public.user_interests.preferred_food_categories, p_food_category)
      end,
      preferred_regions = case
        when p_region_id is null or p_region_id = any(public.user_interests.preferred_regions)
        then public.user_interests.preferred_regions
        else array_append(public.user_interests.preferred_regions, p_region_id)
      end,
      interest_weights = jsonb_set(
        public.user_interests.interest_weights,
        array[p_food_category],
        to_jsonb(coalesce(category_weight, 1)),
        true
      ),
      updated_at = now();
  end if;

  select coalesce(jsonb_agg(to_jsonb(stamp_rows)), '[]'::jsonb)
  into stamp_payload
  from public.check_and_increment_stamp_progress(p_user_id, 'food_image_approved', coalesce(p_food_category, 'food')) stamp_rows;

  perform public.refresh_user_ranking_stats(p_user_id);

  awarded_points := 120;
  updated_food_score := food_stats.popularity_score;
  stamp_results := stamp_payload;
  ranking_refreshed := true;
  message := 'Gold dataset insert skipped: current RPC input does not include required gold_food_dataset.storage_path and label_name values.';
  return next;
end;
$$;
