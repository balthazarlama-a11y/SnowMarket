-- Agrega columna status a availability_calendar para distinguir rangos disponibles y bloqueados.

ALTER TABLE public.availability_calendar
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available'
  CONSTRAINT chk_availability_status CHECK (status IN ('available', 'blocked'));

COMMENT ON COLUMN public.availability_calendar.status IS 'Estado del rango: available = disponible para arriendo, blocked = no disponible';
