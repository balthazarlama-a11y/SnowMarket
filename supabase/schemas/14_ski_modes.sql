-- Agrega columna ski_modes a products para modalidad de ski.
-- Array de texto con valores: pista, freestyle, carrera, freeride, backcountry.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS ski_modes TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.products.ski_modes IS 'Modalidades de ski del producto: pista, freestyle, carrera, freeride, backcountry';

CREATE INDEX IF NOT EXISTS idx_products_ski_modes ON public.products USING GIN(ski_modes);
