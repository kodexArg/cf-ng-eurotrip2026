-- 0012_stansted_express_to_london.sql
-- Agrega el traslado del aeropuerto Stansted (STN) al centro de Londres
-- después del aterrizaje de FR28 (May 2, 07:35).
-- Stansted Express: STN → London Liverpool Street, ~47 min, salidas cada 15-30 min.

INSERT INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-stn-lon', 'traslado', 'train',
  'train-stn-lon-20260502',
  'Stansted Express · STN → Londres',
  'London Stansted Airport → London Liverpool Street Station',
  '2026-05-02',
  '2026-05-02T08:10:00',
  '2026-05-02T08:57:00',
  'lon', 'lon', NULL,
  'pi-directions',
  0, 'both',
  '~47 min · salidas cada 15-30 min · ~£20.70 single / ~£28 return · comprar en stanstedexpress.com (más barato anticipado) · desde Liverpool St conectar con metro/tube',
  51.8860, 0.2389,
  51.5180, -0.0817
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-stn-lon', 'Stansted Express', '~£20.70', NULL, NULL, 47);
