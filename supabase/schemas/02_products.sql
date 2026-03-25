-- SnowMarket: Tabla de productos de esqui
-- Soporta contenido de usuario (C2C) y productos verificados (admin)

CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL CHECK (char_length(title) >= 3),
  description      TEXT NOT NULL,
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category         product_category NOT NULL,
  images           TEXT[] NOT NULL DEFAULT '{}',
  owner_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  whatsapp_number  TEXT NOT NULL,
  is_verified      BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.products IS 'Catalogo de productos de esqui (C2C + verificados)';
COMMENT ON COLUMN public.products.is_verified IS 'true = producto verificado por admin; false = publicado por usuario';

CREATE INDEX IF NOT EXISTS idx_products_owner_id ON public.products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_is_verified ON public.products(is_verified);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
