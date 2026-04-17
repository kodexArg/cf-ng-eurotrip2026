-- 0065_madrid_apr22_toledo_completo.sql
-- Rework del día de Toledo (miércoles 22 abr 2026).
--
-- Cambios vs migration 0047:
--   1. DELETE Alcázar (perfil arte+++ lo rechaza — bajo retorno).
--   2. DELETE metro-vuelta Atocha→Sol (se reemplaza por caminata a Prado).
--   3. UPDATE Avant ida: nuevo horario 08:50–09:23.
--   4. UPDATE llegada Toledo: estación RENFE (no AVE), coords corregidas, bus urbano L5.
--   5. UPDATE Catedral: horario 10:10–11:40, descripción con audioguía + horarios.
--   6. INSERT nuevos hitos Toledo:
--      - Bus L5 Estación → Zocodover
--      - Santo Tomé (Entierro del Conde de Orgaz de El Greco) + Pulsera Turística €14 pp
--      - Sinagoga Sta María la Blanca (Pulsera)
--      - Monasterio San Juan de los Reyes (Pulsera)
--      - Almuerzo Bar Ludeña Plaza Magdalena (NO Zocodover)
--      - Sinagoga del Tránsito · Museo Sefardí
--      - Museo del Greco
--      - Mezquita Cristo de la Luz (Pulsera)
--      - Mirador del Valle (taxi €7 ida)
--      - Café pre-regreso estación
--   7. INSERT caminata Atocha → Prado.
--   8. INSERT Prado GRATIS 18-20h.
--   9. INSERT metro Banco de España → Sol (regreso al Airbnb).
--
-- Todos los nuevos confirmed=0. city_in='mad' en todos los hitos de Toledo.

-- ─────────────────────────────────────────────────────────────────────
-- 1. DELETEs
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events WHERE id = 'ev-tol-apr22-alcazar';
DELETE FROM events WHERE id = 'ev-tol-apr22-metro-vuelta';
-- Legacy ev-mad-apr22-prado (existia huerfano del seed original) — borrado para reinsertar con datos actualizados.
DELETE FROM events WHERE id = 'ev-mad-apr22-prado';

-- ─────────────────────────────────────────────────────────────────────
-- 2. UPDATE Avant ida: nuevo horario 08:50–09:23
-- ─────────────────────────────────────────────────────────────────────
UPDATE events SET
  timestamp_in  = '2026-04-22T08:50:00+02:00',
  timestamp_out = '2026-04-22T09:23:00+02:00'
WHERE id = 'ev-tol-apr22-avant-ida';

-- ─────────────────────────────────────────────────────────────────────
-- 3. UPDATE llegada Toledo: estación RENFE (no AVE), coords, horario
-- ─────────────────────────────────────────────────────────────────────
UPDATE events SET
  title         = 'Llegada a Toledo · Estación RENFE',
  description   = 'Estación RENFE Toledo, Paseo de la Rosa s/n. Bus urbano L5 €1.40 pp (10 min) a Plaza Zocodover, o a pie 15-20 min cuesta. **Ciudad Patrimonio Humanidad.**',
  lat           = 39.8632,
  lon           = -4.0168,
  timestamp_in  = '2026-04-22T09:23:00+02:00',
  timestamp_out = '2026-04-22T09:35:00+02:00'
WHERE id = 'ev-tol-apr22-llegada';

-- ─────────────────────────────────────────────────────────────────────
-- 4. UPDATE Catedral: horario 10:10–11:40 + descripción enriquecida
-- ─────────────────────────────────────────────────────────────────────
UPDATE events SET
  description   = 'Catedral Primada de España, gótico s.XIII. Audioguía INCLUIDA. El Transparente de Narciso Tomé, obras de El Greco. **Abre 10:00, cierra 18:30.** €12 pp.',
  timestamp_in  = '2026-04-22T10:10:00+02:00',
  timestamp_out = '2026-04-22T11:40:00+02:00'
WHERE id = 'ev-tol-apr22-catedral';

-- ─────────────────────────────────────────────────────────────────────
-- 5. Traslado · Bus urbano L5 · Estación → Zocodover
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-tol-apr22-bus-l5',
  'traslado', 'bus',
  'tol-bus-l5-estacion-zocodover-20260422',
  'Bus urbano L5 · Estación → Zocodover',
  'Bus urbano L5 desde estación RENFE a Plaza Zocodover. €1.40 pp, ~10 min.',
  '2026-04-22',
  '2026-04-22T09:35:00+02:00',
  '2026-04-22T09:55:00+02:00',
  'mad', 'mad',
  'pi pi-car',
  0, 'both',
  39.8632, -4.0168, 'Toledo Estación RENFE',
  39.8583, -4.0240, 'Plaza Zocodover'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-tol-apr22-bus-l5', 'EMT Toledo', 'EUR 1.40 pp', 'L5', 10);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Hito · Iglesia Santo Tomé · Entierro del Conde de Orgaz
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-santotome',
  'hito', 'museo',
  'tol-santotome-orgaz-20260422',
  'Iglesia Santo Tomé · Entierro del Conde de Orgaz',
  'Obra maestra de El Greco. **Tip: comprar aquí la Pulsera Turística €14 pp que cubre 7 monumentos** (Santo Tomé, Sta María Blanca, San Juan Reyes, Cristo Luz, Jesuitas, Salvador, Doncellas). Rentable ≥3 visitas. Válida 7 días.',
  '2026-04-22',
  '2026-04-22T11:40:00+02:00',
  '2026-04-22T12:10:00+02:00',
  'mad',
  30.44, 'pi pi-image', 0, 'both',
  39.8577, -4.0279
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Hito · Sinagoga Santa María la Blanca (Pulsera)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-sinagoga-blanca',
  'hito', 'museo',
  'tol-sinagoga-blanca-20260422',
  'Sinagoga Santa María la Blanca',
  'Mudéjar s.XII, única en Europa. **Incluida en Pulsera Turística.**',
  '2026-04-22',
  '2026-04-22T12:10:00+02:00',
  '2026-04-22T12:35:00+02:00',
  'mad',
  0.00, 'pi pi-building', 0, 'both',
  39.8568, -4.0290
);

-- ─────────────────────────────────────────────────────────────────────
-- 8. Hito · Monasterio San Juan de los Reyes (Pulsera)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-sanjuan-reyes',
  'hito', 'museo',
  'tol-sanjuan-reyes-20260422',
  'Monasterio San Juan de los Reyes',
  'Claustro mudéjar, fundado por Reyes Católicos. **Incluida en Pulsera Turística.**',
  '2026-04-22',
  '2026-04-22T12:35:00+02:00',
  '2026-04-22T13:00:00+02:00',
  'mad',
  0.00, 'pi pi-building', 0, 'both',
  39.8579, -4.0299
);

-- ─────────────────────────────────────────────────────────────────────
-- 9. Hito · Almuerzo · Bar Ludeña (carcamusas)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-almuerzo-ludena',
  'hito', 'food',
  'tol-ludena-carcamusas-20260422',
  'Almuerzo · Bar Ludeña (carcamusas)',
  '**TIP: NO comer en Zocodover (turista caro).** Bar Ludeña (Plaza Magdalena) o El Trébol — carcamusas €4-5, bocadillos €3. ~€20 pareja.',
  '2026-04-22',
  '2026-04-22T13:00:00+02:00',
  '2026-04-22T14:00:00+02:00',
  'mad',
  21.74, 'pi pi-shop', 0, 'both',
  39.8582, -4.0232
);

-- ─────────────────────────────────────────────────────────────────────
-- 10. Hito · Sinagoga del Tránsito · Museo Sefardí
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-sinagoga-transito',
  'hito', 'museo',
  'tol-sinagoga-transito-20260422',
  'Sinagoga del Tránsito · Museo Sefardí',
  'Historia de la judería toledana. €3 pp (martes-sábado 9:30-19:30).',
  '2026-04-22',
  '2026-04-22T14:00:00+02:00',
  '2026-04-22T14:40:00+02:00',
  'mad',
  6.52, 'pi pi-book', 0, 'both',
  39.8563, -4.0293
);

-- ─────────────────────────────────────────────────────────────────────
-- 11. Hito · Museo del Greco
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-greco',
  'hito', 'museo',
  'tol-greco-20260422',
  'Museo del Greco',
  'Casa-museo con obras del Greco. €3 pp. Abierto martes-sábado 9:30-19:30. Miércoles es día normal (no gratis).',
  '2026-04-22',
  '2026-04-22T14:40:00+02:00',
  '2026-04-22T15:25:00+02:00',
  'mad',
  6.52, 'pi pi-image', 0, 'both',
  39.8568, -4.0294
);

-- ─────────────────────────────────────────────────────────────────────
-- 12. Hito · Mezquita Cristo de la Luz (Pulsera)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-cristo-luz',
  'hito', 'museo',
  'tol-cristo-luz-20260422',
  'Mezquita Cristo de la Luz',
  'Mezquita mudéjar s.X, la más antigua de Toledo. **Incluida en Pulsera Turística.**',
  '2026-04-22',
  '2026-04-22T15:25:00+02:00',
  '2026-04-22T15:45:00+02:00',
  'mad',
  0.00, 'pi pi-building', 0, 'both',
  39.8617, -4.0250
);

-- ─────────────────────────────────────────────────────────────────────
-- 13. Hito · Mirador del Valle (taxi €7 ida desde casco)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-mirador-valle',
  'hito', 'landscape',
  'tol-mirador-valle-20260422',
  'Mirador del Valle',
  '**TIP: taxi €7 ida desde casco (obligatorio — lejos). Regreso a estación caminando ~35 min cuesta abajo si tienen piernas, o taxi otros €5.** Postal clásica de Toledo.',
  '2026-04-22',
  '2026-04-22T15:45:00+02:00',
  '2026-04-22T16:15:00+02:00',
  'mad',
  15.22, 'pi pi-map', 0, 'both',
  39.8508, -4.0216
);

-- ─────────────────────────────────────────────────────────────────────
-- 14. Hito · Café pre-regreso estación
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-cafe-estacion',
  'hito', 'food',
  'tol-cafe-estacion-20260422',
  'Café pre-regreso estación',
  'Café rápido en la estación antes del Avant de vuelta.',
  '2026-04-22',
  '2026-04-22T16:45:00+02:00',
  '2026-04-22T17:00:00+02:00',
  'mad',
  6.52, 'pi pi-shop', 0, 'both',
  39.8632, -4.0168
);

-- ─────────────────────────────────────────────────────────────────────
-- 15. Traslado a pie · Atocha → Museo del Prado
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-tol-apr22-caminata-prado',
  'traslado', 'walking',
  'mad-caminata-atocha-prado-20260422',
  'A pie · Atocha → Museo del Prado',
  'Caminata corta por Paseo del Prado hasta entrada principal del museo.',
  '2026-04-22',
  '2026-04-22T17:35:00+02:00',
  '2026-04-22T17:45:00+02:00',
  'mad', 'mad',
  'pi pi-map-marker',
  0, 'both',
  40.4065, -3.6890, 'Madrid Puerta de Atocha',
  40.4138, -3.6922, 'Museo del Prado'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-tol-apr22-caminata-prado', NULL, '0', 'walking', 10);

-- ─────────────────────────────────────────────────────────────────────
-- 16. Hito · Museo del Prado · GRATIS 18-20h
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr22-prado',
  'hito', 'museo',
  'mad-prado-20260422',
  'Museo del Prado · GRATIS 18-20h',
  'Entrada gratuita lunes-sábado 18:00-20:00. Velázquez, Goya, El Bosco. **Llegan justos tras Toledo (Avant 17:00 → Atocha 17:33 → a pie 10 min).** Reservar entrada gratis online con anticipación.',
  '2026-04-22',
  '2026-04-22T18:00:00+02:00',
  '2026-04-22T20:00:00+02:00',
  'mad',
  0.00, 'pi pi-image', 0, 'both',
  40.4138, -3.6922
);

-- ─────────────────────────────────────────────────────────────────────
-- 17. Traslado · Metro Banco de España → Sol (regreso al Airbnb)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-mad-apr22-metro-prado-sol',
  'traslado', 'metro',
  'mad-metro-bancoespana-sol-20260422',
  'Metro · Banco de España → Sol',
  'Línea 2, 2 estaciones hasta Sol (regreso al Airbnb Lavapiés a pie desde ahí).',
  '2026-04-22',
  '2026-04-22T20:05:00+02:00',
  '2026-04-22T20:20:00+02:00',
  'mad', 'mad',
  'pi pi-train',
  0, 'both',
  40.4197, -3.6945, 'Banco de España',
  40.4168, -3.7038, 'Sol'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-mad-apr22-metro-prado-sol', 'Metro de Madrid', 'EUR 1.50 pp (€3.00 total)', 'L2', 5);
