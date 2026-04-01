-- Rich listing fields for products and properties
-- Adds detailed publication data with safe backfill for existing records.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS binding_type TEXT,
  ADD COLUMN IF NOT EXISTS manufacture_year INT,
  ADD COLUMN IF NOT EXISTS included_accessories TEXT,
  ADD COLUMN IF NOT EXISTS technical_observations TEXT;

COMMENT ON COLUMN public.products.model IS 'Modelo especifico del articulo publicado';
COMMENT ON COLUMN public.products.binding_type IS 'Tipo de fijaciones del equipo';
COMMENT ON COLUMN public.products.manufacture_year IS 'Ano de fabricacion (opcional)';
COMMENT ON COLUMN public.products.included_accessories IS 'Accesorios incluidos en la venta';
COMMENT ON COLUMN public.products.technical_observations IS 'Observaciones tecnicas del articulo';

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS bathrooms INT,
  ADD COLUMN IF NOT EXISTS distance_to_slopes_meters INT,
  ADD COLUMN IF NOT EXISTS parking_included BOOLEAN,
  ADD COLUMN IF NOT EXISTS pet_policy TEXT;

COMMENT ON COLUMN public.properties.bathrooms IS 'Cantidad de banos del inmueble';
COMMENT ON COLUMN public.properties.distance_to_slopes_meters IS 'Distancia aproximada a pistas en metros';
COMMENT ON COLUMN public.properties.parking_included IS 'Indica si incluye estacionamiento';
COMMENT ON COLUMN public.properties.pet_policy IS 'Politica de mascotas (opcional)';

CREATE INDEX IF NOT EXISTS idx_products_manufacture_year ON public.products(manufacture_year);
CREATE INDEX IF NOT EXISTS idx_properties_distance_to_slopes ON public.properties(distance_to_slopes_meters);
CREATE INDEX IF NOT EXISTS idx_properties_parking_included ON public.properties(parking_included);

-- Backfill: keep old publications readable without breaking UI.
UPDATE public.products
SET detailed_description = description
WHERE (detailed_description IS NULL OR btrim(detailed_description) = '')
  AND description IS NOT NULL
  AND btrim(description) <> '';

UPDATE public.products
SET technical_observations = detailed_description
WHERE (technical_observations IS NULL OR btrim(technical_observations) = '')
  AND detailed_description IS NOT NULL
  AND btrim(detailed_description) <> '';

UPDATE public.products
SET included_accessories = description
WHERE (included_accessories IS NULL OR btrim(included_accessories) = '')
  AND description IS NOT NULL
  AND btrim(description) <> '';

UPDATE public.properties
SET full_description = description
WHERE (full_description IS NULL OR btrim(full_description) = '')
  AND description IS NOT NULL
  AND btrim(description) <> '';

UPDATE public.properties
SET bathrooms = 1
WHERE bathrooms IS NULL;

UPDATE public.properties
SET parking_included = COALESCE(parking_included, false)
WHERE parking_included IS NULL;

UPDATE public.properties
SET parking_included = true
WHERE COALESCE(parking_included, false) = false
  AND amenities @> ARRAY['estacionamiento']::TEXT[];
