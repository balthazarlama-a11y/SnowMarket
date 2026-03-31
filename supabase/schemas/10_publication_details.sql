-- Publication detail enhancements for product and property listings

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS detailed_description TEXT;

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS full_description TEXT,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

COMMENT ON COLUMN public.products.detailed_description IS 'Detailed technical description visible in listing publication';
COMMENT ON COLUMN public.properties.full_description IS 'Complete property description for listing publication';
COMMENT ON COLUMN public.properties.google_maps_url IS 'Direct Google Maps URL for exact listing location';

-- Generic backfill for existing product publications
UPDATE public.products
SET detailed_description = description
WHERE (detailed_description IS NULL OR btrim(detailed_description) = '')
  AND description IS NOT NULL
  AND btrim(description) <> '';

-- Backfill complete description and maps URL for existing properties
UPDATE public.properties
SET full_description = description
WHERE full_description IS NULL OR btrim(full_description) = '';

UPDATE public.properties
SET google_maps_url = CASE
  WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN
    'https://www.google.com/maps/search/?api=1&query=' || latitude || ',' || longitude
  ELSE
    'https://www.google.com/maps/search/?api=1&query=' || replace(btrim(location), ' ', '+')
END
WHERE (google_maps_url IS NULL OR btrim(google_maps_url) = '')
  AND location IS NOT NULL
  AND btrim(location) <> '';
