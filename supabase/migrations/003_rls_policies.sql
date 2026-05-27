alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.foods enable row level security;
alter table public.places enable row level security;
alter table public.posts enable row level security;
alter table public.food_image_uploads enable row level security;
alter table public.ai_food_labels enable row level security;
alter table public.review_logs enable row level security;
alter table public.gold_food_dataset enable row level security;

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

create or replace function public.is_reviewer_or_above()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('reviewer'::public.user_role, 'moderator'::public.user_role, 'admin'::public.user_role);
$$;

create or replace function public.is_moderator_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('moderator'::public.user_role, 'admin'::public.user_role);
$$;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select to authenticated
using (id = auth.uid());

drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all" on public.profiles
for select to authenticated
using (public.is_admin());

drop policy if exists "profiles_update_own_basic" on public.profiles;
create policy "profiles_update_own_basic" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = public.current_user_role()
);

drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all" on public.profiles
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "regions_public_select" on public.regions;
create policy "regions_public_select" on public.regions
for select
using (true);

drop policy if exists "regions_admin_manage" on public.regions;
create policy "regions_admin_manage" on public.regions
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "foods_public_select_active" on public.foods;
create policy "foods_public_select_active" on public.foods
for select
using (is_active = true);

drop policy if exists "foods_admin_manage" on public.foods;
create policy "foods_admin_manage" on public.foods
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "places_public_select" on public.places;
create policy "places_public_select" on public.places
for select
using (true);

drop policy if exists "places_admin_manage" on public.places;
create policy "places_admin_manage" on public.places
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "posts_public_select_published" on public.posts;
create policy "posts_public_select_published" on public.posts
for select
using (status = 'published'::public.post_status);

drop policy if exists "posts_select_own" on public.posts;
create policy "posts_select_own" on public.posts
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own" on public.posts
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own" on public.posts
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "posts_moderator_moderate" on public.posts;
create policy "posts_moderator_moderate" on public.posts
for update to authenticated
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

drop policy if exists "food_image_uploads_insert_own" on public.food_image_uploads;
create policy "food_image_uploads_insert_own" on public.food_image_uploads
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "food_image_uploads_select_own" on public.food_image_uploads;
create policy "food_image_uploads_select_own" on public.food_image_uploads
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "food_image_uploads_reviewer_select_all" on public.food_image_uploads;
create policy "food_image_uploads_reviewer_select_all" on public.food_image_uploads
for select to authenticated
using (public.is_reviewer_or_above());

drop policy if exists "food_image_uploads_reviewer_update_status" on public.food_image_uploads;
create policy "food_image_uploads_reviewer_update_status" on public.food_image_uploads
for update to authenticated
using (public.is_reviewer_or_above())
with check (public.is_reviewer_or_above());

drop policy if exists "ai_food_labels_select_own_upload_labels" on public.ai_food_labels;
create policy "ai_food_labels_select_own_upload_labels" on public.ai_food_labels
for select to authenticated
using (
  exists (
    select 1
    from public.food_image_uploads uploads
    where uploads.id = ai_food_labels.upload_id
      and uploads.user_id = auth.uid()
  )
);

drop policy if exists "ai_food_labels_reviewer_manage" on public.ai_food_labels;
create policy "ai_food_labels_reviewer_manage" on public.ai_food_labels
for all to authenticated
using (public.is_reviewer_or_above())
with check (public.is_reviewer_or_above());

drop policy if exists "review_logs_reviewer_select" on public.review_logs;
create policy "review_logs_reviewer_select" on public.review_logs
for select to authenticated
using (public.is_reviewer_or_above());

drop policy if exists "review_logs_reviewer_insert" on public.review_logs;
create policy "review_logs_reviewer_insert" on public.review_logs
for insert to authenticated
with check (
  public.is_reviewer_or_above()
  and reviewer_id = auth.uid()
);

drop policy if exists "gold_food_dataset_public_select_training_ready" on public.gold_food_dataset;
create policy "gold_food_dataset_public_select_training_ready" on public.gold_food_dataset
for select
using (is_training_ready = true);

drop policy if exists "gold_food_dataset_reviewer_select_all" on public.gold_food_dataset;
create policy "gold_food_dataset_reviewer_select_all" on public.gold_food_dataset
for select to authenticated
using (public.is_reviewer_or_above());

drop policy if exists "gold_food_dataset_reviewer_insert" on public.gold_food_dataset;
create policy "gold_food_dataset_reviewer_insert" on public.gold_food_dataset
for insert to authenticated
with check (public.is_reviewer_or_above());

drop policy if exists "gold_food_dataset_reviewer_update" on public.gold_food_dataset;
create policy "gold_food_dataset_reviewer_update" on public.gold_food_dataset
for update to authenticated
using (public.is_reviewer_or_above())
with check (public.is_reviewer_or_above());

drop policy if exists "gold_food_dataset_admin_delete" on public.gold_food_dataset;
create policy "gold_food_dataset_admin_delete" on public.gold_food_dataset
for delete to authenticated
using (public.is_admin());
