-- Adds the `engineering_year` column required for the Engineering (SPPU) flow.
-- Safe to run multiple times.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS engineering_year TEXT DEFAULT '';

-- Force PostgREST to refresh its schema cache so the new column is visible immediately.
NOTIFY pgrst, 'reload schema';
