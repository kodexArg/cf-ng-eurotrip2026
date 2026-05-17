-- 0105_photos_formalize_media.sql
-- Formalize the previously-undeclared photos table in version control.
-- Add media_type and mime columns to support video uploads in the Fotos gallery.
--
-- ADDITIVE ONLY: This migration formalizes schema already applied to production.
-- Row count: 0→0 (no existing photos yet).

ALTER TABLE photos ADD COLUMN media_type TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video'));
ALTER TABLE photos ADD COLUMN mime TEXT;
