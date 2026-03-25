-- SnowMarket: Tabla de propiedades inmobiliarias (departamentos)
-- Dominio segregado del catalogo de productos; mutacion exclusiva de admin

CREATE TABLE IF NOT EXISTS public.properties (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL CHECK (char_length(title) >= 3),
  description       TEXT NOT NULL,
  price             NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  location          TEXT NOT NULL,
  images            TEXT[] NOT NULL DEFAULT '{}',
  created_by        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  whatsapp_contact  TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.properties IS 'Propiedades inmobiliarias para arriendo (solo admin)';
COMMENT ON COLUMN public.properties.whatsapp_contact IS 'Numero oficial de SnowMarket para contacto de arriendo';

CREATE INDEX IF NOT EXISTS idx_properties_created_by ON public.properties(created_by);
