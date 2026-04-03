-- SnowMarket: Calendario de disponibilidad de propiedades
-- Permite al admin definir rangos de fechas en que una propiedad esta disponible para arriendo.

CREATE TABLE IF NOT EXISTS public.availability_calendar (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  available_from DATE NOT NULL,
  available_to   DATE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_date_range CHECK (available_to > available_from)
);

COMMENT ON TABLE public.availability_calendar IS 'Rangos de disponibilidad definidos por el admin para cada propiedad';

CREATE INDEX IF NOT EXISTS idx_availability_property ON public.availability_calendar(property_id);
CREATE INDEX IF NOT EXISTS idx_availability_dates ON public.availability_calendar(available_from, available_to);

-- RLS: todos pueden leer, solo admin (dueno) puede modificar
ALTER TABLE public.availability_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view availability"
  ON public.availability_calendar
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage availability"
  ON public.availability_calendar
  FOR ALL
  USING (
    (SELECT (raw_app_meta_data->>'role') FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
