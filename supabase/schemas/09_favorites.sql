-- =====================================================================
-- AndesMarket: Tabla de Favoritos Polimórficos
-- Soporta likes para "Productos" o "Departamentos" (properties).
-- INSTRUCCIONES: Correr esto en el SQL Editor de Supabase.
-- ATENCIÓN: Solo si nunca antes creaste la tabla (o bórala antes con DROP TABLE user_favorites CASCADE;)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.user_favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Un favorito DEBE pertenecer a un producto O a un departamento, nunca a ambos ni a ninguno.
  CONSTRAINT chk_favorite_item_type CHECK (
    (product_id IS NOT NULL AND property_id IS NULL) OR
    (product_id IS NULL AND property_id IS NOT NULL)
  )
);

COMMENT ON TABLE public.user_favorites IS 'Almacena likes a productos o propiedades';

-- Para evitar que el mismo usuario le de doble like al mismo item
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_fav_unique_product ON public.user_favorites(user_id, product_id) WHERE product_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_fav_unique_property ON public.user_favorites(user_id, property_id) WHERE property_id IS NOT NULL;

-- Índices de búsqueda
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);

-- Habilitar RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_favorites_select_own" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_favorites_insert_own" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_favorites_delete_own" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);
