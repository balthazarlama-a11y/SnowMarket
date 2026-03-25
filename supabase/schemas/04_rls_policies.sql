-- SnowMarket: Row Level Security + Politicas RBAC
-- Fuente de verdad: snowmarket pasos.md - Fase 2

-- =============================================
-- Habilitar RLS en todas las tablas publicas
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Helper: extraer rol admin desde app_metadata
-- Usa subconsulta para forzar initPlan (cache por transaccion)
-- =============================================

-- =============================================
-- POLITICAS: public.users
-- =============================================

-- Lectura publica de perfiles
CREATE POLICY "users_select_public"
  ON public.users FOR SELECT
  USING (true);

-- Update solo por el propietario de la cuenta
CREATE POLICY "users_update_owner"
  ON public.users FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- =============================================
-- POLITICAS: public.products
-- =============================================

-- Lectura publica del catalogo
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (true);

-- Insercion por usuario estandar: solo sus productos, nunca verificados
CREATE POLICY "products_insert_user"
  ON public.products FOR INSERT
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND is_verified = false
  );

-- Insercion por admin: puede crear productos verificados
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Update: propietario de su producto O admin
CREATE POLICY "products_update_owner_or_admin"
  ON public.products FOR UPDATE
  USING (
    owner_id = (SELECT auth.uid())
    OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Delete: propietario de su producto O admin
CREATE POLICY "products_delete_owner_or_admin"
  ON public.products FOR DELETE
  USING (
    owner_id = (SELECT auth.uid())
    OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- =============================================
-- POLITICAS: public.properties
-- =============================================

-- Lectura publica del catalogo inmobiliario
CREATE POLICY "properties_select_public"
  ON public.properties FOR SELECT
  USING (true);

-- Insercion solo admin
CREATE POLICY "properties_insert_admin"
  ON public.properties FOR INSERT
  WITH CHECK (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Update solo admin
CREATE POLICY "properties_update_admin"
  ON public.properties FOR UPDATE
  USING (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Delete solo admin
CREATE POLICY "properties_delete_admin"
  ON public.properties FOR DELETE
  USING (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
