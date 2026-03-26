-- Advanced filter columns for properties and products

-- Properties: capacity + amenities
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS max_guests  INT NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS bedrooms    INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS amenities   TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_properties_max_guests ON public.properties(max_guests);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON public.properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_amenities ON public.properties USING GIN(amenities);

-- Products: brand, condition, size
DO $$ BEGIN
  CREATE TYPE product_condition AS ENUM ('nuevo', 'usado_como_nuevo', 'usado_buen_estado');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS brand        TEXT,
  ADD COLUMN IF NOT EXISTS condition    product_condition,
  ADD COLUMN IF NOT EXISTS size_label   TEXT,
  ADD COLUMN IF NOT EXISTS size_value   NUMERIC(10, 2);

CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_condition ON public.products(condition);
