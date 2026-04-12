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

-- Seed confirmed data
INSERT INTO bookings (id, type, sort_date, time, description, origin, destination, mode, carrier, confirmed)
VALUES ('bk-scl-mad', 'viaje', '2026-04-19', '06:40', 'Vuelo SCL → MAD', 'Santiago', 'Madrid', 'flight', 'Iberia', 1);

INSERT INTO bookings (id, type, sort_date, time, description, origin, destination, mode, carrier, confirmed)
VALUES ('bk-fco-mad', 'viaje', '2026-05-09', '20:25', 'IB0656 FCO T1 → MAD', 'Roma', 'Madrid', 'flight', 'Iberia', 1);

INSERT INTO bookings (id, type, sort_date, time, description, origin, destination, mode, carrier, confirmed)
VALUES ('bk-mad-eze', 'viaje', '2026-05-10', '08:45', 'IB0105 MAD → EZE', 'Madrid', 'Buenos Aires', 'flight', 'Iberia', 1);

INSERT INTO bookings (id, type, sort_date, description, accommodation, checkout_date, confirmed)
VALUES ('bk-madrid-airbnb', 'hospedaje', '2026-04-20', 'AirBNB Madrid — C. del Ave María 42, Lavapiés', 'AirBNB Madrid', '2026-04-24', 1);

INSERT INTO bookings (id, type, sort_date, time, description, confirmed)
VALUES ('bk-sagrada', 'hito', '2026-04-27', '17:00', 'Sagrada Família — acceso básico + Torre del Nacimiento', 1);
