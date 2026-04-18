-- 0092_peguera_transport_legs.sql
-- Corrección: base de alojamiento es PEGUERA (~25 km SW de Palma), no Palma ciudad.
-- ev-stay-auto-pmi (Airbnb/Flor, Peguera, confirmed=1) es intocable.
--
-- Esta migración:
--   1. Reemplaza ev-pmi-apr28-bus-aero (Aeropuerto→Palma) por flujo correcto:
--        Aeropuerto PMI → Peguera (TIB 107/A11, ~1h) + Peguera → Palma (TIB 102, ~45 min)
--   2. Agrega legs diarios Peguera↔Palma (mañana y noche) para Apr 29, 30, May 1
--   3. Agrega retorno nocturno Palma→Peguera para Apr 28
--   4. Agrega taxi Peguera→PMI Airport el 2 May 04:00 (vuelo Ryanair FR28 06:00)
--
-- USD total insertado en 0092: ~$224 pareja (8 buses + 1 taxi)
-- Eventos insertados: 14 (8 buses/traslados + 1 taxi + 1 reemplazo aeropuerto x2)

-- Coordenadas de referencia:
--   Peguera centro:        39.5330, 2.4535
--   Aeropuerto PMI:        39.5517, 2.7388
--   Palma Intermodal:      39.5745, 2.6526
--   PMI Airport terminal:  39.5534, 2.7381

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 1: Reemplazar ev-pmi-apr28-bus-aero (Aeropuerto→Palma — incorrecto)
--         por Aeropuerto → Peguera (destino real del alojamiento)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Limpiar traslado de 0091 primero
DELETE FROM events_traslado WHERE event_id = 'ev-pmi-apr28-bus-aero';
DELETE FROM events WHERE id = 'ev-pmi-apr28-bus-aero';

-- 1a. Aeropuerto PMI → Peguera (TIB 107 / Línea A11 directo)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr28-bus-aero-peguera',
  'traslado', 'bus',
  'bus-pmi-aero-peguera-20260428',
  'Bus TIB 107/A11 · Aeropuerto PMI → Peguera',
  'TIB línea 107 / A11 directo desde Aeropuerto PMI hasta Peguera. ~1h de trayecto, ~€5 pp → ~$11 pareja. Salida desde parada exterior de llegadas. Confirmar horario en tib.org.',
  '2026-04-28',
  '2026-04-28T11:30:00+02:00',
  '2026-04-28T12:30:00+02:00',
  'pmi', 'pmi',
  11.00, 'colectivo', 0, 1, 'both',
  'Aeropuerto PMI',
  'Peguera',
  39.5517, 2.7388,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr28-bus-aero-peguera', 'TIB (Transport Illes Balears)', '~€5 pp', '107', 60);

-- 1b. Peguera → Palma Intermodal (TIB 102, para actividades tarde)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr28-bus-peguera-palma',
  'traslado', 'bus',
  'bus-peguera-palma-20260428',
  'Bus TIB 102 · Peguera → Palma',
  'TIB línea 102 Peguera–Palma Intermodal. ~45 min, ~€4 pp → ~$9 pareja. Salida desde Peguera para llegar a Palma antes del almuerzo en el casco histórico.',
  '2026-04-28',
  '2026-04-28T13:00:00+02:00',
  '2026-04-28T13:45:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Peguera',
  'Palma · Intermodal',
  39.5330, 2.4535,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr28-bus-peguera-palma', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 2: Retorno nocturno Apr 28 — Palma → Peguera (después de cena 22:00)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr28-bus-palma-peguera',
  'traslado', 'bus',
  'bus-palma-peguera-20260428',
  'Bus TIB 102 · Palma → Peguera (regreso)',
  'TIB 102 regreso al alojamiento en Peguera. ~45 min. Verificar último bus nocturno en tib.org — puede requerir taxi si el último bus salió antes de las 22:30.',
  '2026-04-28',
  '2026-04-28T22:15:00+02:00',
  '2026-04-28T23:00:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Peguera',
  39.5745, 2.6526,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr28-bus-palma-peguera', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 3: Jue 29 abr — Legs Peguera↔Palma
--         Tren Sóller sale Palma 10:00 → depart Peguera 08:45, llega 09:30
-- ═══════════════════════════════════════════════════════════════════════════════

-- 3a. Mañana: Peguera → Palma Intermodal
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-bus-peguera-palma',
  'traslado', 'bus',
  'bus-peguera-palma-20260429',
  'Bus TIB 102 · Peguera → Palma (mañana)',
  'TIB 102. Salida 08:45 desde Peguera, llegada ~09:30 Palma Intermodal. Necesario para tomar tren histórico Sóller 10:00.',
  '2026-04-29',
  '2026-04-29T08:45:00+02:00',
  '2026-04-29T09:30:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Peguera',
  'Palma · Intermodal',
  39.5330, 2.4535,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-bus-peguera-palma', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- 3b. Noche: Palma → Peguera (después de cena 22:00)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-bus-palma-peguera',
  'traslado', 'bus',
  'bus-palma-peguera-20260429',
  'Bus TIB 102 · Palma → Peguera (regreso)',
  'TIB 102 regreso al alojamiento en Peguera. ~45 min. Verificar último bus nocturno en tib.org.',
  '2026-04-29',
  '2026-04-29T22:15:00+02:00',
  '2026-04-29T23:00:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Peguera',
  39.5745, 2.6526,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-bus-palma-peguera', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 4: Vie 30 abr — Legs Peguera↔Palma
--         Bus 203 Valldemossa sale Palma 09:30 → depart Peguera 08:30, llega 09:15
-- ═══════════════════════════════════════════════════════════════════════════════

-- 4a. Mañana: Peguera → Palma Intermodal
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr30-bus-peguera-palma',
  'traslado', 'bus',
  'bus-peguera-palma-20260430',
  'Bus TIB 102 · Peguera → Palma (mañana)',
  'TIB 102. Salida 08:30 desde Peguera, llegada ~09:15 Palma Intermodal. Necesario para tomar TIB 203 a Valldemossa 09:30.',
  '2026-04-30',
  '2026-04-30T08:30:00+02:00',
  '2026-04-30T09:15:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Peguera',
  'Palma · Intermodal',
  39.5330, 2.4535,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr30-bus-peguera-palma', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- 4b. Noche: Palma → Peguera (después de cena 22:00)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr30-bus-palma-peguera',
  'traslado', 'bus',
  'bus-palma-peguera-20260430',
  'Bus TIB 102 · Palma → Peguera (regreso)',
  'TIB 102 regreso al alojamiento en Peguera. ~45 min. Verificar último bus nocturno en tib.org.',
  '2026-04-30',
  '2026-04-30T22:15:00+02:00',
  '2026-04-30T23:00:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Peguera',
  39.5745, 2.6526,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr30-bus-palma-peguera', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 5: Sáb 1 may — Legs Peguera↔Palma
--         Bus 302 Alcúdia sale Palma 09:00 → depart Peguera 08:00, llega 08:45
-- ═══════════════════════════════════════════════════════════════════════════════

-- 5a. Mañana: Peguera → Palma Intermodal
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-peguera-palma',
  'traslado', 'bus',
  'bus-peguera-palma-20260501',
  'Bus TIB 102 · Peguera → Palma (mañana)',
  'TIB 102. Salida 08:00 desde Peguera, llegada ~08:45 Palma Intermodal. Necesario para tomar TIB 302 a Alcúdia 09:00.',
  '2026-05-01',
  '2026-05-01T08:00:00+02:00',
  '2026-05-01T08:45:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Peguera',
  'Palma · Intermodal',
  39.5330, 2.4535,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-peguera-palma', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- 5b. Noche: Palma → Peguera (después de cena final 22:00)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-palma-peguera',
  'traslado', 'bus',
  'bus-palma-peguera-20260501',
  'Bus TIB 102 · Palma → Peguera (regreso)',
  'TIB 102 regreso al alojamiento en Peguera. ~45 min. Es la última noche antes de la salida. Verificar horario nocturno en tib.org.',
  '2026-05-01',
  '2026-05-01T22:15:00+02:00',
  '2026-05-01T23:00:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Peguera',
  39.5745, 2.6526,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-palma-peguera', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 6: Dom 2 may — Taxi Peguera → Aeropuerto PMI (vuelo 06:00)
--         Ryanair FR28 sale 06:00 → estar en aeropuerto ~04:00 → taxi 04:00
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may02-taxi-peguera-aero',
  'traslado', 'taxi',
  'taxi-peguera-pmi-aero-20260502',
  'Taxi · Peguera → Aeropuerto PMI (madrugada)',
  'Taxi madrugada para vuelo Ryanair FR28 06:00. Estar en aeropuerto ~04:00. ~35 min trayecto, ~€40-50 → ~$50 pareja. IMPORTANTE: Reservar taxi la noche anterior. Los buses TIB no operan a esta hora (primer bus ~05:30, demasiado tarde para check-in).',
  '2026-05-02',
  '2026-05-02T04:00:00+02:00',
  '2026-05-02T04:35:00+02:00',
  'pmi', 'pmi',
  50.00, 'colectivo', 0, 1, 'both',
  'Peguera · Alojamiento',
  'Aeropuerto PMI',
  39.5330, 2.4535,
  39.5517, 2.7388
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may02-taxi-peguera-aero', 'Taxi Peguera (reservar noche anterior)', '~€40-50', 'TAXI', 35);
