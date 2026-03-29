-- =====================================================================
-- AndesMarket: Políticas RLS para Supabase Storage
-- Bucket: snowmarket-images
-- 
-- INSTRUCCIONES:
--   1. Abre supabase.com → tu proyecto → SQL Editor
--   2. Crea un "New Query"
--   3. Pega TODO este archivo
--   4. Haz clic en "Run"
--   5. Deberías ver "Success. No rows returned." 
--
-- Estas políticas permiten:
--   ✅ Lectura pública de imágenes (cualquier visitante)
--   ✅ Subida de imágenes por usuarios autenticados
--   ✅ Actualización solo por el propietario del archivo o admin
--   ✅ Borrado solo por el propietario del archivo o admin
-- =====================================================================

-- =============================================
-- 1. Lectura pública: cualquier persona puede ver las imágenes
-- =============================================
CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'snowmarket-images');

-- =============================================
-- 2. Subida: cualquier usuario autenticado puede subir imágenes
-- =============================================
CREATE POLICY "storage_authenticated_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'snowmarket-images'
    AND (SELECT auth.role()) = 'authenticated'
  );

-- =============================================
-- 3. Actualización: solo el propietario del archivo o admin
-- =============================================
CREATE POLICY "storage_owner_or_admin_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'snowmarket-images'
    AND (
      (SELECT auth.uid())::text = owner_id::text
      OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'snowmarket-images'
    AND (
      (SELECT auth.uid())::text = owner_id::text
      OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
  );

-- =============================================
-- 4. Borrado: solo el propietario del archivo o admin
-- =============================================
CREATE POLICY "storage_owner_or_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'snowmarket-images'
    AND (
      (SELECT auth.uid())::text = owner_id::text
      OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
  );
