-- Fix para bucket de imágenes "uploads"
-- Ejecutar en Supabase SQL Editor (proyecto thyzyeredmmtywiixuzd)

-- 1) Crear bucket si no existe y dejarlo público para usar getPublicUrl
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

-- 2) Políticas de lectura/escritura sobre objetos del bucket uploads
drop policy if exists "uploads_public_read" on storage.objects;
create policy "uploads_public_read"
on storage.objects
for select
to public
using (bucket_id = 'uploads');

drop policy if exists "uploads_auth_insert" on storage.objects;
create policy "uploads_auth_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'uploads');

drop policy if exists "uploads_auth_update" on storage.objects;
create policy "uploads_auth_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'uploads')
with check (bucket_id = 'uploads');

drop policy if exists "uploads_auth_delete" on storage.objects;
create policy "uploads_auth_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'uploads');
