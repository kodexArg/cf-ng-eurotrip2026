-- 0000_schema_baseline.sql
-- Schema baseline reconstructed from production DB.
-- Migrations 0001–0010 were applied directly before the repo started
-- tracking migration files; this file captures the resulting schema so
-- that local CI can replay all migrations from a clean slate.
--
-- FK REFERENCES are omitted intentionally: seed rows from 0001–0010 are not
-- in the repo, so FK enforcement would cause every subsequent migration to
-- fail. Production D1 (SQLite) enforces FKs via its own pragma settings.
-- The replay test still catches: table-doesn't-exist errors, column name
-- typos, duplicate column definitions, and SQL syntax errors.
--
-- Tables: cities, events, events_traslado, events_estadia,
--         cards, card_links, photos, sessions, access_requests

CREATE TABLE IF NOT EXISTS cities (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  arrival    TEXT NOT NULL,
  departure  TEXT NOT NULL,
  nights     INTEGER NOT NULL DEFAULT 0,
  color      TEXT,
  lat        REAL,
  lon        REAL
);

CREATE TABLE IF NOT EXISTS events (
  id                TEXT PRIMARY KEY,
  type              TEXT NOT NULL CHECK (type IN ('hito', 'traslado', 'estadia')),
  subtype           TEXT,
  slug              TEXT NOT NULL UNIQUE,
  title             TEXT NOT NULL,
  description       TEXT,
  date              TEXT NOT NULL,
  timestamp_in      TEXT NOT NULL,
  timestamp_out     TEXT,
  city_in           TEXT NOT NULL,
  city_out          TEXT,
  usd               REAL,
  icon              TEXT,
  confirmed         INTEGER NOT NULL DEFAULT 0,
  variant           TEXT NOT NULL DEFAULT 'both',
  card_id           TEXT,
  notes             TEXT,
  origin_lat        REAL,
  origin_lon        REAL,
  destination_lat   REAL,
  destination_lon   REAL,
  waypoints         TEXT,
  origin_label      TEXT,
  destination_label TEXT
);

CREATE TABLE IF NOT EXISTS events_traslado (
  event_id     TEXT PRIMARY KEY,
  company      TEXT,
  fare         TEXT,
  vehicle_code TEXT,
  seat         TEXT,
  duration_min INTEGER
);

CREATE TABLE IF NOT EXISTS events_estadia (
  event_id      TEXT PRIMARY KEY,
  accommodation TEXT NOT NULL,
  address       TEXT,
  platform      TEXT,
  booking_ref   TEXT,
  checkin_time  TEXT,
  checkout_time TEXT
);

CREATE TABLE IF NOT EXISTS cards (
  id         TEXT PRIMARY KEY,
  city_id    TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'info',
  title      TEXT NOT NULL,
  body       TEXT,
  url        TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS card_links (
  id         TEXT PRIMARY KEY,
  card_id    TEXT NOT NULL,
  url        TEXT NOT NULL,
  label      TEXT,
  tooltip    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS photos (
  id          TEXT PRIMARY KEY,
  r2_key      TEXT NOT NULL,
  city_id     TEXT,
  event_id    TEXT,
  caption     TEXT,
  taken_at    TEXT,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS access_requests (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL,
  requested_at TEXT NOT NULL DEFAULT (datetime('now')),
  status       TEXT NOT NULL DEFAULT 'pending'
);
