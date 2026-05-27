create extension if not exists "pgcrypto";

alter table public.food_image_uploads
  add column if not exists content_hash text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'food_image_uploads_file_size_limit'
  ) then
    alter table public.food_image_uploads
      add constraint food_image_uploads_file_size_limit
      check (file_size is null or (file_size > 0 and file_size <= 8388608));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'food_image_uploads_mime_type_allowed'
  ) then
    alter table public.food_image_uploads
      add constraint food_image_uploads_mime_type_allowed
      check (mime_type is null or mime_type in ('image/jpeg', 'image/png', 'image/webp'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'food_image_uploads_content_hash_sha256'
  ) then
    alter table public.food_image_uploads
      add constraint food_image_uploads_content_hash_sha256
      check (content_hash is null or content_hash ~ '^[a-f0-9]{64}$');
  end if;
end $$;

create unique index if not exists food_image_uploads_user_content_hash_idx
  on public.food_image_uploads(user_id, content_hash)
  where content_hash is not null;

create unique index if not exists food_image_uploads_storage_location_idx
  on public.food_image_uploads(storage_bucket, storage_path);

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change profile roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_role_escalation_before_update on public.profiles;
create trigger prevent_profile_role_escalation_before_update
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

create or replace function public.validate_food_image_upload()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to create uploads.';
  end if;

  if new.user_id <> auth.uid() and not public.is_admin() then
    raise exception 'Cannot create uploads for another user.';
  end if;

  if new.review_status <> 'pending'::public.upload_review_status and not public.is_reviewer_or_above() then
    raise exception 'Upload review status must start as pending.';
  end if;

  if new.storage_bucket <> 'kfood-bucket' then
    raise exception 'Invalid storage bucket.';
  end if;

  if split_part(new.storage_path, '/', 1) <> new.user_id::text then
    raise exception 'Upload storage path must be scoped to the uploading user.';
  end if;

  if split_part(new.storage_path, '/', 2) <> 'food-images' then
    raise exception 'Food image uploads must use the food-images folder.';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_food_image_upload_before_insert on public.food_image_uploads;
create trigger validate_food_image_upload_before_insert
before insert on public.food_image_uploads
for each row execute function public.validate_food_image_upload();

do $$
begin
  create type public.report_target_type as enum ('post', 'profile', 'food_image_upload');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.report_status as enum ('open', 'reviewing', 'resolved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type public.report_target_type not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  resolution_note text,
  constraint content_reports_reason_length check (char_length(reason) between 3 and 80),
  constraint content_reports_details_length check (details is null or char_length(details) <= 1000)
);

create unique index if not exists content_reports_reporter_target_idx
  on public.content_reports(reporter_id, target_type, target_id);

create table if not exists public.user_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint user_blocks_no_self_block check (blocker_id <> blocked_id)
);

alter table public.content_reports enable row level security;
alter table public.user_blocks enable row level security;

drop policy if exists "content_reports_insert_own" on public.content_reports;
create policy "content_reports_insert_own" on public.content_reports
for insert to authenticated
with check (
  reporter_id = auth.uid()
  and status = 'open'::public.report_status
  and reviewed_by is null
  and reviewed_at is null
);

drop policy if exists "content_reports_select_own_or_moderator" on public.content_reports;
create policy "content_reports_select_own_or_moderator" on public.content_reports
for select to authenticated
using (reporter_id = auth.uid() or public.is_moderator_or_admin());

drop policy if exists "content_reports_moderator_update" on public.content_reports;
create policy "content_reports_moderator_update" on public.content_reports
for update to authenticated
using (public.is_moderator_or_admin())
with check (
  public.is_moderator_or_admin()
  and reviewed_by = auth.uid()
  and reviewed_at is not null
);

drop policy if exists "user_blocks_insert_own" on public.user_blocks;
create policy "user_blocks_insert_own" on public.user_blocks
for insert to authenticated
with check (blocker_id = auth.uid() and blocked_id <> auth.uid());

drop policy if exists "user_blocks_select_own" on public.user_blocks;
create policy "user_blocks_select_own" on public.user_blocks
for select to authenticated
using (blocker_id = auth.uid());

drop policy if exists "user_blocks_delete_own" on public.user_blocks;
create policy "user_blocks_delete_own" on public.user_blocks
for delete to authenticated
using (blocker_id = auth.uid());

create or replace function public.review_food_image_upload(
  p_upload_id uuid,
  p_action public.review_action,
  p_review_status public.upload_review_status,
  p_note text default null
)
returns public.food_image_uploads
language plpgsql
security definer
set search_path = public
as $$
declare
  before_row public.food_image_uploads%rowtype;
  after_row public.food_image_uploads%rowtype;
begin
  if not public.is_reviewer_or_above() then
    raise exception 'Reviewer access is required.';
  end if;

  if p_review_status not in ('approved'::public.upload_review_status, 'rejected'::public.upload_review_status, 'needs_review'::public.upload_review_status) then
    raise exception 'Invalid reviewer status transition.';
  end if;

  select *
  into before_row
  from public.food_image_uploads
  where id = p_upload_id
  for update;

  if not found then
    raise exception 'Upload not found.';
  end if;

  update public.food_image_uploads
  set review_status = p_review_status
  where id = p_upload_id
  returning * into after_row;

  insert into public.review_logs (upload_id, reviewer_id, action, before_data, after_data, note)
  values (p_upload_id, auth.uid(), p_action, to_jsonb(before_row), to_jsonb(after_row), p_note);

  return after_row;
end;
$$;

grant execute on function public.review_food_image_upload(
  uuid,
  public.review_action,
  public.upload_review_status,
  text
) to authenticated;
