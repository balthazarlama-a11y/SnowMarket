-- 1. Destruimos la tabla de favoritos antigua y limitante
DROP TABLE IF EXISTS public.user_favorites CASCADE;

-- 2. Creamos la nueva super-tabla de Favoritos Polimórfica
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Un favorito DEBE pertenecer a una tabla O a la otra, jamás a ambas mezcladas.
  CONSTRAINT chk_favorite_item_type CHECK (
    (product_id IS NOT NULL AND property_id IS NULL) OR
    (product_id IS NULL AND property_id IS NOT NULL)
  )
);

COMMENT ON TABLE public.user_favorites IS 'Almacena likes a productos o departamentos';

-- 3. Índices para rendimiento y para evitar doble "Like" al mismo ítem
CREATE UNIQUE INDEX idx_user_fav_unique_product ON public.user_favorites(user_id, product_id) WHERE product_id IS NOT NULL;
CREATE UNIQUE INDEX idx_user_fav_unique_property ON public.user_favorites(user_id, property_id) WHERE property_id IS NOT NULL;
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);

-- 4. Activamos la Seguridad
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_favorites_select_own" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_favorites_insert_own" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_favorites_delete_own" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);
