-- This public bucket is acceptable for MVP post image display.
-- For production, split storage into:
-- food-images private
-- post-images public or private
-- avatars public
-- gold-dataset private

insert into storage.buckets (id, name, public)
values ('kfood-bucket', 'kfood-bucket', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "kfood_bucket_public_read" on storage.objects;
create policy "kfood_bucket_public_read" on storage.objects
for select
using (bucket_id = 'kfood-bucket');

drop policy if exists "kfood_bucket_authenticated_upload_own_folder" on storage.objects;
create policy "kfood_bucket_authenticated_upload_own_folder" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'kfood-bucket'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] in ('food-images', 'post-images', 'avatars')
);

drop policy if exists "kfood_bucket_authenticated_update_own_folder" on storage.objects;
create policy "kfood_bucket_authenticated_update_own_folder" on storage.objects
for update to authenticated
using (
  bucket_id = 'kfood-bucket'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'kfood-bucket'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] in ('food-images', 'post-images', 'avatars')
);

drop policy if exists "kfood_bucket_authenticated_delete_own_folder" on storage.objects;
create policy "kfood_bucket_authenticated_delete_own_folder" on storage.objects
for delete to authenticated
using (
  bucket_id = 'kfood-bucket'
  and (storage.foldername(name))[1] = auth.uid()::text
);
