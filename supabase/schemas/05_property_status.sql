-- Property status enum + geolocation columns

DO $$ BEGIN
  CREATE TYPE property_status AS ENUM ('activo', 'pausado', 'arrendado', 'vendido');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS status property_status NOT NULL DEFAULT 'activo';

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
  ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7);

CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
