-- 0019_eurostar_waypoints.sql
-- 1. Nueva columna opcional `waypoints` (JSON array de [lat,lon]).
--    Cuando está presente el renderer dibuja polilínea por esos puntos
--    en vez de gran-círculo entre origen y destino.
-- 2. Eurostar Londres → París:
--    · origen: London St Pancras International (51.5308, -0.1252)
--    · destino: Paris Gare du Nord (48.8810, 2.3553)
--    · waypoints HS1 + Channel Tunnel + LGV Nord:
--        Ebbsfleet Int'l, Ashford Int'l, portal Cheriton (UK),
--        portal Coquelles (FR), Lille Europe.

ALTER TABLE events ADD COLUMN waypoints TEXT;

UPDATE events
  SET origin_lat      = 51.5308,
      origin_lon      = -0.1252,
      destination_lat = 48.8810,
      destination_lon = 2.3553,
      waypoints       = '[[51.4430,0.3204],[51.1434,0.8748],[51.0940,1.1349],[50.9227,1.7710],[50.6397,3.0749]]',
      description     = 'London St Pancras International → Paris Gare du Nord · vía HS1, Channel Tunnel, LGV Nord',
      notes           = 'Pendiente · booking anterior cancelado · horario estimado · Standard ~€103 pp · reservar en eurostar.com · salida St Pancras (King''s Cross area) · llegada Gare du Nord · ruta: HS1 → Ashford → túnel Eurotúnel (~21 min bajo el mar) → LGV Nord → Lille → París'
  WHERE id = 'ev-leg-lon-par';
