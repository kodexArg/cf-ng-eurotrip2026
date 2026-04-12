-- map_routes: caché de geometría de rutas para renderizado en el mapa.
-- Cada fila = un segmento visual (par de POIs).
-- waypoints = JSON array de [lat, lon] pares, pre-computados y almacenados.
-- sku = clave estable usada por el frontend (ej: 'mad-bcn', 'scl-mad').
-- La tabla crece on-demand: rutas de vuelo se calculan y cachean en el primer request.

CREATE TABLE map_routes (
  sku        TEXT PRIMARY KEY,
  from_poi   TEXT NOT NULL REFERENCES map_pois(id),
  to_poi     TEXT NOT NULL REFERENCES map_pois(id),
  mode       TEXT NOT NULL CHECK(mode IN ('flight','train','daytrip','ferry')),
  waypoints  TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
