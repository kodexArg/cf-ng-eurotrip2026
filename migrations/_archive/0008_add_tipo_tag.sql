-- Add tipo and tag columns to activities
ALTER TABLE activities ADD COLUMN tipo TEXT NOT NULL DEFAULT 'visit';
ALTER TABLE activities ADD COLUMN tag  TEXT NOT NULL DEFAULT '';
