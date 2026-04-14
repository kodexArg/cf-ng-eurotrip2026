-- 0024_palma_flor_apartamento_confirmed.sql
-- Confirma alojamiento en Palma de Mallorca: FLOR Apartamento estándar 2 personas (Peguera, Calvià).
-- Airbnb listing 48003319. 28 abr → 2 may 2026 (4 noches).
-- Peguera está ~25 km al SW del aeropuerto PMI y ~25 km al oeste del centro de Palma.
-- Agrega: bus A11 PMI airport → Peguera (Apr 28), hito de retiro de auto alquilado en Peguera (Apr 29).

-- ─────────────────────────────────────────────────────────────────────
-- 1. Confirmar estadia PMI con coords del apartamento en Peguera
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET title     = 'FLOR Apartamento estándar · Peguera',
      confirmed = 1,
      lat       = 39.53776,
      lon       = 2.44812,
      notes     = 'Airbnb 48003319 · anfitrión: Flor Hotels · 1 dormitorio, 2 camas, 1 baño, pileta · 4.49 (690 reseñas) · ubicado en Peguera (Calvià), ~25 km al SW del centro de Palma y del aeropuerto PMI · requiere colectivo/auto para moverse'
  WHERE id = 'ev-stay-auto-pmi';

UPDATE events_estadia
  SET accommodation = 'FLOR Apartamento estándar 2 personas',
      address       = 'Peguera, Calvià, Mallorca, España',
      checkin_time  = '15:00',
      checkout_time = '11:00',
      booking_ref   = '48003319',
      platform      = 'Airbnb'
  WHERE event_id = 'ev-stay-auto-pmi';

-- ─────────────────────────────────────────────────────────────────────
-- 2. Bus TIB A11 · Aeropuerto PMI → Peguera (Apr 28)
--    Línea A11 "Aeroport - Peguera - Camp de Mar" opera directa, ~50 min, ~€5 pp.
--    Vuelo Vueling BCN→PMI llega 10:00 → salida bus sugerida ~11:00 tras retirar equipaje.
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-pmi-peguera', 'traslado', 'bus',
  'bus-pmi-peguera-20260428',
  'Bus TIB A11 · Aeropuerto PMI → Peguera',
  'Palma de Mallorca Airport (PMI) → Peguera (parada centro)',
  '2026-04-28',
  '2026-04-28T11:00:00',
  '2026-04-28T11:50:00',
  'pmi', 'pmi', 10.00,
  'pi-car',
  0, 'both',
  'TIB línea A11 "Aeroport - Peguera - Camp de Mar" · ~50 min directo · ~€5 pp (2 pax = ~€10) · salidas aprox cada 30-60 min · comprar ticket al chofer · parada en aeropuerto PMI (llegadas nivel calle) · bajar en Peguera centro a ~500 m del apartamento · horario TBD, confirmar en tib.org el día anterior',
  39.5517, 2.7388,
  39.53776, 2.44812
);

INSERT OR IGNORE INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-pmi-peguera', 'TIB (Transport Illes Balears)', '~€5 pp', 'A11', NULL, 50);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Hito · Retiro de auto alquilado en Peguera (Apr 29 mañana)
--    Agencias en Peguera: Centauro, Record go, Goldcar tienen oficinas en Avinguda de Peguera.
--    Marker en coord aproximada del hub rental del pueblo.
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant,
  notes, lat, lon)
VALUES (
  'ev-pmi-apr29-rentacar', 'hito', 'logistics',
  'rentacar-peguera-20260429',
  'Alquiler de auto · Peguera',
  'Retiro del auto alquilado — oficinas en Avinguda de Peguera',
  '2026-04-29',
  '2026-04-29T09:00:00',
  '2026-04-29T10:00:00',
  'pmi', 40.00, 'pi-car', 0, 'both',
  'opciones en Peguera: Centauro, Record go, Goldcar, Hiper Rent a Car · ubicación central Avinguda de Peguera · caminable desde el apartamento (~5-10 min) · reservar online con anticipación (~€30-50/día clase B) · alternativa: retirar en aeropuerto PMI al llegar (más variedad pero complica el bus) · necesario para explorar Serra de Tramuntana, calas del oeste y Valldemossa',
  39.53900, 2.45100
);
