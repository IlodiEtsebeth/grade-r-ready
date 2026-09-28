-- Free trial support: an optional end date for a parent's access.
-- NULL = no end date (paid / normal approved parents keep access permanently).
-- A date = access ends at that moment and the parent sees the "trial ended" screen.
ALTER TABLE public.account_access ADD COLUMN IF NOT EXISTS access_until timestamptz;
