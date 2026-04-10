-- eurotrip2026 D1 schema
-- 6 tables: cities, days, activities, transport_legs, cards, photos

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
  variant TEXT NOT NULL DEFAULT 'both'
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
  confirmed INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  type TEXT NOT NULL CHECK(type IN ('info','link','note','photo')),
  title TEXT NOT NULL,
  body TEXT,
  url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  r2_key TEXT NOT NULL,
  caption TEXT,
  date_taken DATE,
  uploader_note TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
