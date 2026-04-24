-- Migration: Add detailed trip fields
-- Run manually: psql -d <database> -f 002_add_trip_detail_fields.sql

ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS title              TEXT,
  ADD COLUMN IF NOT EXISTS country            TEXT,
  ADD COLUMN IF NOT EXISTS num_travelers      INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS budget_tier        TEXT,
  ADD COLUMN IF NOT EXISTS trip_type          TEXT[],
  ADD COLUMN IF NOT EXISTS pace               INTEGER DEFAULT 3,
  ADD COLUMN IF NOT EXISTS accommodation_type TEXT[],
  ADD COLUMN IF NOT EXISTS transport_pref     TEXT[],
  ADD COLUMN IF NOT EXISTS dietary_needs      TEXT[],
  ADD COLUMN IF NOT EXISTS accessibility_notes TEXT,
  ADD COLUMN IF NOT EXISTS notes              TEXT;
