-- Run once in Supabase SQL Editor for Dance Flow photo uploads.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('dance-move-photos','dance-move-photos',true,8388608,array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do nothing;
create policy "dance move photos authenticated upload" on storage.objects for insert to authenticated
with check (bucket_id='dance-move-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "dance move photos authenticated access" on storage.objects for select to authenticated
using (bucket_id='dance-move-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "dance move photos authenticated delete" on storage.objects for delete to authenticated
using (bucket_id='dance-move-photos' and (storage.foldername(name))[1]=auth.uid()::text);
