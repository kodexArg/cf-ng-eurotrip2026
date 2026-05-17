-- Add done column to events table
ALTER TABLE events ADD COLUMN done INTEGER NOT NULL DEFAULT 0;
