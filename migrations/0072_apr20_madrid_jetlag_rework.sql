-- 0072_apr20_madrid_jetlag_rework.sql
-- Apr 20 Madrid (lunes) — rework con perfil "menos culto, más liviano":
--   1. ELIMINAR Fundación MAPFRE (demasiado museo para día de jet lag)
--   2. AGREGAR siesta post check-in (16:00-18:30)
--   3. AGREGAR scooter eléctrico Lavapiés ↔ Malasaña (evitar caminata larga)
--   4. AGREGAR paseo Malasaña 18:45-21:00 (calle del Pez, bares)
--   5. UPDATE Mercado Antón Martín: precio $40 (vermut + 2 tapas pp), "de pasada"
--   6. AGREGAR caminatas con duración explícita entre cada hito
--   7. Marcar todos los traslados como mandatory=1, hitos quedan como sugerencia (lamparita)
--      excepto check-in (ya confirmed) y siesta (mandatory: dormir es no-negociable post jet lag)

-- ─────────────────────────────────────────────────────────────────────
-- 1. DELETE MAPFRE
-- ─────────────────────────────────────────────────────────────────────

DELETE FROM events WHERE id = 'ev-mad-apr20-mapfre-zorn';

-- ─────────────────────────────────────────────────────────────────────
-- 2. UPDATE Mercado Antón Martín — "de pasada", $40
-- ─────────────────────────────────────────────────────────────────────

UPDATE events
SET title       = 'Mercado de Antón Martín · almuerzo de pasada',
    description = 'Vermut + 2 tapas pp en mercado gastronómico. Entrar, comer parado en barra, salir. Sin sentarse a sobremesa.',
    timestamp_in  = '2026-04-20T13:00:00+02:00',
    timestamp_out = '2026-04-20T14:00:00+02:00',
    usd         = 40,
    mandatory   = 1
WHERE id = 'ev-mad-apr20-antonmartin';

-- ─────────────────────────────────────────────────────────────────────
-- 3. UPDATE caminata Atocha → Retiro: tiempo explícito 50 min ya OK
--    Agregar paseo barrio post Lavapiés 11:00-13:00
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant
) VALUES (
  'ev-mad-apr20-paseo-tirso',
  'hito', 'leisure',
  'mad-paseo-tirso-20260420',
  'Paseo Lavapiés / Plaza Tirso de Molina',
  'Caminar barrio con calma post-Retiro · Plaza Tirso · café Embajadores · llegar al Mercado a las 13:00.',
  '2026-04-20',
  '2026-04-20T11:00:00+02:00',
  '2026-04-20T13:00:00+02:00',
  'mad', NULL,
  0, 'pi pi-compass', 0, 1, 'both'
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. AGREGAR caminata Lavapiés → Mercado Antón Martín (5 min)
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr20-walk-tirso-mercado',
  'traslado', 'walking',
  'mad-walk-tirso-mercado-20260420',
  'A pie · Plaza Tirso → Mercado Antón Martín',
  '5 min · 350 m por C. Magdalena.',
  '2026-04-20',
  '2026-04-20T12:55:00+02:00',
  '2026-04-20T13:00:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 0, 1, 'both',
  40.4128, -3.7015, 'Plaza Tirso de Molina',
  40.4117, -3.6989, 'Mercado de Antón Martín'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr20-walk-tirso-mercado', NULL, '0', 'walking', 5);

-- ─────────────────────────────────────────────────────────────────────
-- 5. AGREGAR caminata Mercado → Airbnb (3 min) post-almuerzo · siesta 16:00
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr20-walk-mercado-airbnb',
  'traslado', 'walking',
  'mad-walk-mercado-airbnb-20260420',
  'A pie · Mercado → Airbnb Lavapiés',
  '8 min · 600 m. Llegar 14:10, café cerca, esperar check-in 16:00.',
  '2026-04-20',
  '2026-04-20T14:00:00+02:00',
  '2026-04-20T14:10:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 0, 1, 'both',
  40.4117, -3.6989, 'Mercado de Antón Martín',
  40.4089, -3.7025, 'Airbnb Lavapiés'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr20-walk-mercado-airbnb', NULL, '0', 'walking', 8);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Espera pre check-in 14:10-16:00 · café en Lavapiés
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant
) VALUES (
  'ev-mad-apr20-cafe-pre-checkin',
  'hito', 'food',
  'mad-cafe-pre-checkin-20260420',
  'Café liviano · espera pre check-in',
  'Café o caña en bar de Lavapiés (Plaza Lavapiés o C. Argumosa) hasta el check-in 16:00.',
  '2026-04-20',
  '2026-04-20T14:10:00+02:00',
  '2026-04-20T16:00:00+02:00',
  'mad', NULL,
  10.87, 'pi pi-cafe', 0, 0, 'both'
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. SIESTA 16:00-18:30 · mandatory (post jet lag)
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant
) VALUES (
  'ev-mad-apr20-siesta',
  'hito', 'rest',
  'mad-siesta-20260420',
  'Siesta corta · Airbnb Lavapiés',
  '2.5 h de descanso post-vuelo. Imprescindible para aguantar la noche y el ritmo de los próximos días.',
  '2026-04-20',
  '2026-04-20T16:00:00+02:00',
  '2026-04-20T18:30:00+02:00',
  'mad', NULL,
  0, 'pi pi-moon', 0, 1, 'both'
);

-- ─────────────────────────────────────────────────────────────────────
-- 8. Scooter eléctrico Lavapiés → Malasaña (~10 min, ~€4 pp)
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr20-scooter-malasana',
  'traslado', 'scooter',
  'mad-scooter-lavapies-malasana-20260420',
  'Scooter · Lavapiés → Malasaña',
  'Lime/Voi/Dott · ~3.5 km · 12 min · €4 pp aprox (€1 unlock + €0.25/min). Evita caminata larga post-siesta.',
  '2026-04-20',
  '2026-04-20T18:30:00+02:00',
  '2026-04-20T18:45:00+02:00',
  'mad', 'mad',
  8.70, 'pi pi-bolt', 0, 1, 'both',
  40.4089, -3.7025, 'Airbnb Lavapiés',
  40.4248, -3.7028, 'Malasaña (C. del Pez)'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr20-scooter-malasana', 'Lime/Voi/Dott', 'EUR 4 pp aprox', 'scooter', 12);

-- ─────────────────────────────────────────────────────────────────────
-- 9. Paseo Malasaña 18:45-21:00 · calle del Pez, bares, cervecita
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant
) VALUES (
  'ev-mad-apr20-malasana',
  'hito', 'leisure',
  'mad-malasana-20260420',
  'Malasaña · C. del Pez · cerveza',
  'Paseo tranquilo C. del Pez + Plaza Dos de Mayo · 1 cerveza en bar (J&J Books o La Vía Láctea). Sin caminar mucho.',
  '2026-04-20',
  '2026-04-20T18:45:00+02:00',
  '2026-04-20T21:00:00+02:00',
  'mad', NULL,
  16.30, 'pi pi-glass', 0, 1, 'both'
);

-- ─────────────────────────────────────────────────────────────────────
-- 10. Scooter Malasaña → Lavapiés vuelta (10 min)
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr20-scooter-vuelta',
  'traslado', 'scooter',
  'mad-scooter-malasana-lavapies-20260420',
  'Scooter · Malasaña → Lavapiés',
  '~3.5 km · 12 min · €4 pp aprox.',
  '2026-04-20',
  '2026-04-20T21:00:00+02:00',
  '2026-04-20T21:15:00+02:00',
  'mad', 'mad',
  8.70, 'pi pi-bolt', 0, 1, 'both',
  40.4248, -3.7028, 'Malasaña (C. del Pez)',
  40.4089, -3.7025, 'Airbnb Lavapiés'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr20-scooter-vuelta', 'Lime/Voi/Dott', 'EUR 4 pp aprox', 'scooter', 12);

-- ─────────────────────────────────────────────────────────────────────
-- 11. UPDATE cena 21:30 (corrida 1h por la siesta)
-- ─────────────────────────────────────────────────────────────────────

UPDATE events
SET timestamp_in  = '2026-04-20T21:30:00+02:00',
    timestamp_out = '2026-04-20T23:00:00+02:00',
    description   = 'Cena Lavapiés · barra o terraza · ritmo madrileño. Bajar a dormir directo post-cena.',
    mandatory     = 1
WHERE id = 'ev-mad-apr20-cena';

-- ─────────────────────────────────────────────────────────────────────
-- 12. Marcar Retiro y paseo barrio como mandatory (parte del flujo)
-- ─────────────────────────────────────────────────────────────────────

UPDATE events SET mandatory = 1
WHERE id IN ('ev-mad-apr20-retiro-manana', 'ev-mad-apr20-paseo-tirso');
