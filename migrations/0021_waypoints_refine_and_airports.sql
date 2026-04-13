-- 0021_waypoints_refine_and_airports.sql
--
-- PARTE 1 — Refinar waypoints del Eurostar Londres → París
-- Fuentes: Wikipedia HS1, LGV Nord, Eurotunnel Calais Terminal (Coquelles).
-- Trazado real: HS1 (London St Pancras → Stratford → Ebbsfleet → Ashford →
-- Cheriton/Folkestone portal) → Channel Tunnel → Coquelles/Fréthun portal →
-- LGV Nord Europe (Calais-Fréthun → Lille Europe → Haute-Picardie TGV →
-- CDG Aéroport → Paris Gare du Nord).
--
-- Corrección clave: el waypoint del portal francés estaba en 1.7710 (en alta mar,
-- ~30km al oeste del portal real). Coquelles está en 50.9228, 1.8139 según
-- Wikipedia (Eurotunnel_Calais_Terminal). También se añaden Stratford Int'l,
-- Calais-Fréthun, Haute-Picardie TGV y CDG 2 TGV para dibujar con precisión.

UPDATE events
  SET waypoints = '[[51.5449,-0.0095],[51.4431,0.3206],[51.1432,0.8745],[51.0956,1.1219],[50.9228,1.8139],[50.8921,1.8122],[50.6395,3.0757],[49.8608,2.8325],[49.0035,2.5711]]',
      notes = 'Pendiente · booking anterior cancelado · horario estimado · Standard ~€103 pp · reservar en eurostar.com · salida St Pancras (King''s Cross area) · llegada Gare du Nord · ruta real: HS1 (Stratford → Ebbsfleet → Ashford → Cheriton) → Channel Tunnel (~21 min bajo el mar) → Coquelles/Fréthun → LGV Nord Europe (Lille Europe → Haute-Picardie → CDG) → Paris Nord'
  WHERE id = 'ev-leg-lon-par';

-- PARTE 2 — Corregir coordenadas de vuelos a/desde aeropuertos reales.
-- Antes: varias patas usaban el centro de la ciudad en origen/destino, lo
-- que rompía la fidelidad geográfica de las polilíneas en el mapa.

-- Aeropuertos usados (ICAO/IATA → lat,lon):
--   SCL Arturo Merino Benítez    : -33.3928, -70.7858
--   MAD Adolfo Suárez-Barajas    :  40.4936,  -3.5668
--   BCN Josep Tarradellas-El Prat:  41.2974,   2.0833
--   PMI Son Sant Joan            :  39.5517,   2.7388  (ya correcto)
--   STN London Stansted          :  51.8860,   0.2389  (ya correcto)
--   CDG Paris Charles de Gaulle  :  49.0097,   2.5479  (ya correcto)
--   FCO Roma Fiumicino           :  41.8003,  12.2389
--   EZE Ministro Pistarini       : -34.8222, -58.5358  (ya correcto)

-- SCL → MAD  (origen y destino estaban en centros de ciudad)
UPDATE events
  SET origin_lat = -33.3928, origin_lon = -70.7858,
      destination_lat = 40.4936, destination_lon = -3.5668
  WHERE id = 'ev-leg-scl-mad';

-- BCN → PMI  (BCN era centro de ciudad)
UPDATE events
  SET origin_lat = 41.2974, origin_lon = 2.0833
  WHERE id = 'ev-leg-bcn-pmi';

-- FCO → MAD  (FCO apuntaba al centro de Roma, MAD al centro de Madrid)
UPDATE events
  SET origin_lat = 41.8003, origin_lon = 12.2389,
      destination_lat = 40.4936, destination_lon = -3.5668
  WHERE id = 'ev-leg-fco-mad';

-- MAD → EZE  (MAD era centro de ciudad)
UPDATE events
  SET origin_lat = 40.4936, origin_lon = -3.5668
  WHERE id = 'ev-leg-mad-eze';
