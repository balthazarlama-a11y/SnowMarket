-- Reservations for properties (bookings / blocked dates)

CREATE TABLE IF NOT EXISTS public.reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  guest_name    TEXT,
  notes         TEXT,
  created_by    UUID REFERENCES public.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reservations_date_range CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON public.reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON public.reservations(property_id, start_date, end_date);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reservations_select_public"
  ON public.reservations FOR SELECT
  USING (true);

CREATE POLICY "reservations_insert_admin"
  ON public.reservations FOR INSERT
  WITH CHECK (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "reservations_update_admin"
  ON public.reservations FOR UPDATE
  USING (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "reservations_delete_admin"
  ON public.reservations FOR DELETE
  USING (
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
