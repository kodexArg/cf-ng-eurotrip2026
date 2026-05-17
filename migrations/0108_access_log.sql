-- 0108_access_log.sql
-- Visit tracking: who (Google email via Cloudflare Access) and from where
-- (IP, country, city, colo) views the site — including view-only visitors.
-- Additive; safe on populated DB.
CREATE TABLE IF NOT EXISTS access_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT,
  editor     INTEGER NOT NULL DEFAULT 0,
  ip         TEXT,
  country    TEXT,
  city       TEXT,
  colo       TEXT,
  method     TEXT,
  path       TEXT,
  user_agent TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_access_log_created ON access_log(created_at);
CREATE INDEX IF NOT EXISTS idx_access_log_email ON access_log(email);
