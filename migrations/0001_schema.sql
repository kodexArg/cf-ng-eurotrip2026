-- eurotrip2026 — Schema consolidado
-- Representa el estado final de todas las tablas de usuario.
-- Generado a partir del estado real de producción (ver docs/db-dump-production.md).
-- Aplicar junto con 0002_seed.sql para reconstruir la DB desde cero.
--
-- Orden de creación respeta dependencias de FK:
--   cities → days → activities
--   cities → cards → card_links
--   cities → map_pois → map_routes
--   cities → photos
--   (sin FK: transport_legs, bookings, sessions, access_requests)

-- ─────────────────────────────────────────────────────
-- Core itinerary
-- ─────────────────────────────────────────────────────

CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  arrival DATE NOT NULL,
  departure DATE NOT NULL,
  nights INTEGER NOT NULL,
  color TEXT NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL
);

CREATE TABLE days (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  date DATE NOT NULL,
  label TEXT,
  variant TEXT NOT NULL DEFAULT 'both'
);

CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  day_id TEXT NOT NULL REFERENCES days(id),
  time_slot TEXT NOT NULL CHECK(time_slot IN ('morning','afternoon','evening','all-day')),
  description TEXT NOT NULL,
  cost_hint TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0,
  variant TEXT NOT NULL DEFAULT 'both',
  tipo TEXT NOT NULL DEFAULT 'visit',
  tag TEXT NOT NULL DEFAULT '',
  fare TEXT,
  company TEXT
);

CREATE TABLE transport_legs (
  id TEXT PRIMARY KEY,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  date DATE NOT NULL,
  mode TEXT NOT NULL CHECK(mode IN ('flight','train','daytrip','ferry')),
  label TEXT NOT NULL,
  duration TEXT,
  cost_hint TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0,
  fare TEXT,
  company TEXT,
  departure_time TEXT,
  arrival_time TEXT
);

-- ─────────────────────────────────────────────────────
-- Bookings (hitos, viajes, hospedajes)
-- ─────────────────────────────────────────────────────

CREATE TABLE bookings (
  id             TEXT PRIMARY KEY,
  type           TEXT NOT NULL CHECK(type IN ('hito','viaje','hospedaje')),
  sort_date      DATE NOT NULL,
  time           TEXT,
  description    TEXT NOT NULL,
  origin         TEXT,
  destination    TEXT,
  mode           TEXT CHECK(mode IN ('flight','train','bus','ferry','car','other') OR mode IS NULL),
  carrier        TEXT,
  checkout_date  DATE,
  accommodation  TEXT,
  cost_usd       REAL,
  confirmed      INTEGER NOT NULL DEFAULT 0,
  notes          TEXT,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────
-- Cards (sitios / puntos de interés por ciudad)
-- ─────────────────────────────────────────────────────

CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  type TEXT NOT NULL CHECK(type IN ('info','link','note','photo')),
  title TEXT NOT NULL,
  body TEXT,
  url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE card_links (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  tooltip TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────────────────
-- Map (pois y rutas geodésicas)
-- ─────────────────────────────────────────────────────

CREATE TABLE map_pois (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('city','excursion')),
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  color TEXT NOT NULL DEFAULT '#64748b',
  city_id TEXT REFERENCES cities(id)
);

CREATE TABLE map_routes (
  sku TEXT PRIMARY KEY,
  from_poi TEXT NOT NULL REFERENCES map_pois(id),
  to_poi TEXT NOT NULL REFERENCES map_pois(id),
  mode TEXT NOT NULL CHECK(mode IN ('flight','train','daytrip','ferry')),
  waypoints TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────
-- Photos
-- ─────────────────────────────────────────────────────

CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  r2_key TEXT NOT NULL,
  caption TEXT,
  date_taken DATE,
  uploader_note TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────
-- Auth (actualmente deshabilitado — tablas preservadas para futuro re-enable)
-- ─────────────────────────────────────────────────────

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE TABLE access_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);
