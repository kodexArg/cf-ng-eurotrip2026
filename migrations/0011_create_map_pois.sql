-- map_pois: puntos de interés mostrados en el mapa como marcadores.
-- type='city'      → ciudad del itinerario (popup con fechas, click navega)
-- type='excursion' → punto de excursión / aeropuerto externo (tooltip simple)
-- city_id          → FK nullable a cities, solo para type='city'

CREATE TABLE map_pois (
  id      TEXT PRIMARY KEY,
  name    TEXT NOT NULL,
  type    TEXT NOT NULL CHECK(type IN ('city','excursion')),
  lat     REAL NOT NULL,
  lon     REAL NOT NULL,
  color   TEXT NOT NULL DEFAULT '#64748b',
  city_id TEXT REFERENCES cities(id)
);
