-- 0014_confirm_fr28_pmi_stn.sql
-- Ryanair FR28 PMI → Londres Stansted CONFIRMADO (reserva booking en el sitio de Ryanair).
-- Pasajeros: Vanesa Elvira Bourges + Gabriel Alejandro Cassidai Avi.
-- Revierte el plan alternativo Jet2→Gatwick + Gatwick Express que había en la DB.

-- 1. Limpiar el plan alternativo Jet2 + Gatwick Express
--    También limpiar el Stansted Express creado en 0012 (será re-creado abajo)
DELETE FROM events_traslado WHERE event_id IN ('ev-leg-pmi-lgw', 'ev-leg-lgw-lon', 'ev-leg-stn-lon');
DELETE FROM events WHERE id IN ('ev-leg-pmi-lgw', 'ev-leg-lgw-lon', 'ev-leg-stn-lon');

-- 2. Insertar Ryanair FR28 PMI → Stansted (CONFIRMADO)
INSERT INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-pmi-lon', 'traslado', 'flight',
  'flight-pmi-lon-20260502',
  'Ryanair FR28 · Palma PMI → Londres Stansted',
  'Palma de Mallorca (PMI) → London Stansted (STN)',
  '2026-05-02',
  '2026-05-02T06:00:00',
  '2026-05-02T07:35:00',
  'lon', 'pmi', NULL,
  'pi-send',
  1, 'both',
  'Vuelo CONFIRMADO · Pasajeros: Vanesa Elvira Bourges + Gabriel Alejandro Cassidai Avi · Solo bolso de mano pequeño (cero equipaje despachado) · Usar app Ryanair para tarjeta de embarque digital',
  39.5517, 2.7388,
  51.8860, 0.2389
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-pmi-lon', 'Ryanair', '€15.99', 'FR28', NULL, 155);

-- 3. Stansted Express STN → London Liverpool Street
--    Conexión al centro tras el aterrizaje 07:35 (misma lógica que migración 0012).
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
