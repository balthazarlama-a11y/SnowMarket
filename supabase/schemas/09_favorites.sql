-- =====================================================================
-- AndesMarket: Tabla de Favoritos (Likes) para Productos
-- Vincula un user_id y un product_id, con restricción de unicidad.
-- INSTRUCCIONES: Correr esto en el SQL Editor de Supabase.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

COMMENT ON TABLE public.user_favorites IS 'Almacena los likes (favoritos) de los usuarios hacia los productos';

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON public.user_favorites(product_id);

-- Habilitar RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Un usuario solo puede leer sus propios favoritos
CREATE POLICY "user_favorites_select_own"
  ON public.user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Un usuario solo puede insertar (likear) si es el mismo usuario logueado
CREATE POLICY "user_favorites_insert_own"
  ON public.user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Un usuario solo puede borrar (quitar like) de sus propios favoritos
CREATE POLICY "user_favorites_delete_own"
  ON public.user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);
