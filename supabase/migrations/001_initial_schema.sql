create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('user', 'reviewer', 'moderator', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.post_status as enum ('draft', 'published', 'hidden', 'deleted');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.upload_review_status as enum ('pending', 'ai_labeled', 'needs_review', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.review_action as enum ('approve', 'edit', 'reject', 'request_more_info');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null unique,
  name_en text,
  province text,
  city text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references public.regions(id) on delete set null,
  name_ko text not null unique,
  name_en text,
  category text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references public.regions(id) on delete set null,
  name text not null,
  address text,
  google_place_url text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz not null default now(),
  constraint places_latitude_range check (latitude is null or latitude between -90 and 90),
  constraint places_longitude_range check (longitude is null or longitude between -180 and 180)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'user',
  points integer not null default 0,
  stamp_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_points_nonnegative check (points >= 0),
  constraint profiles_stamp_count_nonnegative check (stamp_count >= 0)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  region_id uuid references public.regions(id) on delete set null,
  food_id uuid references public.foods(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  title text not null,
  content text,
  image_url text,
  status public.post_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.food_image_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  region_id uuid references public.regions(id) on delete set null,
  food_id uuid references public.foods(id) on delete set null,
  storage_bucket text not null default 'kfood-bucket',
  storage_path text not null,
  original_filename text,
  mime_type text,
  file_size integer,
  review_status public.upload_review_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint food_image_uploads_file_size_nonnegative check (file_size is null or file_size >= 0)
);

create table if not exists public.ai_food_labels (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.food_image_uploads(id) on delete cascade,
  predicted_food_name text,
  predicted_food_id uuid references public.foods(id) on delete set null,
  confidence numeric(4, 3) not null default 0.000,
  raw_response jsonb,
  model_name text,
  created_at timestamptz not null default now(),
  constraint ai_food_labels_confidence_range check (confidence between 0 and 1)
);

create table if not exists public.review_logs (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.food_image_uploads(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  action public.review_action not null,
  before_data jsonb,
  after_data jsonb,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.gold_food_dataset (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid references public.food_image_uploads(id) on delete set null,
  food_id uuid not null references public.foods(id) on delete restrict,
  region_id uuid references public.regions(id) on delete set null,
  label_name text not null,
  storage_bucket text not null default 'kfood-bucket',
  storage_path text not null,
  approved_by uuid references public.profiles(id) on delete set null,
  quality_score numeric(3, 2) not null default 1.00,
  is_training_ready boolean not null default false,
  created_at timestamptz not null default now(),
  constraint gold_food_dataset_quality_score_range check (quality_score between 0 and 1)
);

create index if not exists foods_region_id_idx on public.foods(region_id);
create index if not exists places_region_id_idx on public.places(region_id);
create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists posts_region_id_idx on public.posts(region_id);
create index if not exists posts_food_id_idx on public.posts(food_id);
create index if not exists posts_place_id_idx on public.posts(place_id);
create index if not exists posts_status_created_at_idx on public.posts(status, created_at desc);
create index if not exists food_image_uploads_user_id_idx on public.food_image_uploads(user_id);
create index if not exists food_image_uploads_post_id_idx on public.food_image_uploads(post_id);
create index if not exists food_image_uploads_review_status_idx on public.food_image_uploads(review_status);
create index if not exists food_image_uploads_created_at_idx on public.food_image_uploads(created_at desc);
create index if not exists ai_food_labels_upload_id_idx on public.ai_food_labels(upload_id);
create index if not exists ai_food_labels_predicted_food_id_idx on public.ai_food_labels(predicted_food_id);
create index if not exists review_logs_upload_id_idx on public.review_logs(upload_id);
create index if not exists review_logs_reviewer_id_idx on public.review_logs(reviewer_id);
create index if not exists gold_food_dataset_food_id_idx on public.gold_food_dataset(food_id);
create index if not exists gold_food_dataset_region_id_idx on public.gold_food_dataset(region_id);
create index if not exists gold_food_dataset_is_training_ready_idx on public.gold_food_dataset(is_training_ready);
