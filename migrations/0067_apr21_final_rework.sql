-- 0067_apr21_final_rework.sql
-- Rework final del día 21 abr 2026 (Aniversario 30 Gabriel+Vanesa en Madrid).
--
-- Cambios respecto a 0064:
--   1. DELETE Barca Retiro → reemplazada por CentroCentro Palacio Cibeles (GRATIS).
--      (Tabacalera descartada: cerrada por renovación hasta Q4 2026.)
--   2. DELETE Opciones B, C, D, E, F de noche (Bodega, Recoletos, Rooftop, Hammam ×2).
--      La Opción A (Café Central · Patxi Pascual Quinteto) es la cena aniversario definitiva.
--   3. UPDATE Matadero → horario real martes (17:00-19:30).
--      Matadero solo abre martes 17:00-21:00, no a las 15:00.
--   4. UPDATE Opción A sube de categoría: se convierte en el evento principal de noche.
--   5. INSERT CentroCentro + 3 traslados nuevos:
--      - Metro Antón Martín → Banco de España (mañana, ir a CentroCentro)
--      - Metro Lavapiés → Legazpi (tarde, ir a Matadero)
--      - Caminata Lavapiés → Café Central Ateneo (noche, cena aniversario)
--
-- Todos los eventos nuevos: confirmed=0, city_in='mad', variant='both'.

-- ─────────────────────────────────────────────────────────────────────
-- 1. DELETEs — opciones descartadas y actividad reemplazada
-- ─────────────────────────────────────────────────────────────────────

-- Opción B (Bodega de los Secretos) y sus taxis asociados
DELETE FROM events WHERE id = 'ev-mad-apr21-aniversario';
DELETE FROM events WHERE id = 'ev-mad-apr21-taxi-restaurante';
DELETE FROM events WHERE id = 'ev-mad-apr21-taxi-vuelta';
DELETE FROM events_traslado WHERE event_id IN ('ev-mad-apr21-taxi-restaurante', 'ev-mad-apr21-taxi-vuelta');

-- Opciones C, D, E, F descartadas
DELETE FROM events WHERE id = 'ev-mad-apr21-opt-c-recoletos';
DELETE FROM events WHERE id = 'ev-mad-apr21-opt-d-rooftop-cafecentral';
DELETE FROM events WHERE id = 'ev-mad-apr21-opt-e-hammam';
DELETE FROM events WHERE id = 'ev-mad-apr21-opt-f-hammam-jazz';

-- Barca Retiro reemplazada por CentroCentro como actividad de mañana
DELETE FROM events WHERE id = 'ev-mad-apr21-retiro-barca';

-- ─────────────────────────────────────────────────────────────────────
-- 2. UPDATEs — ajustes a eventos existentes
-- ─────────────────────────────────────────────────────────────────────

-- Matadero: horario real martes (17:00-19:30, abre 17:00-21:00)
UPDATE events
SET timestamp_in  = '2026-04-21T17:00:00+02:00',
    timestamp_out = '2026-04-21T19:30:00+02:00',
    description   = 'Matadero Madrid · exposición PULGAR de Mónica Mays (site-specific escultura/archivo/memoria). GRATIS. Martes solo abre 17:00-21:00. Metro L3 Lavapiés → Legazpi (~8 min).'
WHERE id = 'ev-mad-apr21-matadero';

-- Opción A sube de categoría: ES la cena aniversario definitiva
UPDATE events
SET title       = 'Aniversario 30 ❤️ · Café Central · Patxi Pascual Quinteto',
    icon        = 'pi pi-heart',
    description = 'Cena aniversario en Café Central (nueva sede Ateneo de Madrid, Calle Prado 21 — 8 min caminando desde Lavapiés). Jazz en vivo Patxi Pascual Quinteto (sax + voz María Zerpa), 2 shows por noche. ~€96 pareja (entrada €18 pp + cena tapas €22 pp + bebida €8 pp).'
WHERE id = 'ev-mad-apr21-opt-a-cafecentral';

-- ─────────────────────────────────────────────────────────────────────
-- 3. INSERTs — nuevos eventos Apr 21
-- ─────────────────────────────────────────────────────────────────────

-- Mañana: CentroCentro (Palacio de Cibeles) - GRATIS
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-centrocentro',
  'hito', 'museo',
  'mad-centrocentro-cibeles-20260421',
  'CentroCentro · Palacio de Cibeles (GRATIS)',
  'Centro cultural con múltiples exposiciones temporales GRATIS. Abierto martes 10:00-20:00. Mirador del 8º piso (€3 opcional, 360° del centro de Madrid). ~30 min caminando por Barrio Letras desde Lavapiés o metro L1 Antón Martín → Banco de España (5 min).',
  '2026-04-21',
  '2026-04-21T10:00:00+02:00',
  '2026-04-21T13:00:00+02:00',
  'mad',
  0.00, 'pi pi-image', 0, 'both',
  40.4192, -3.6921
);

-- Metro mañana: Antón Martín → Banco de España (para CentroCentro)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr21-metro-cibeles',
  'traslado', 'metro',
  'mad-metro-antonmartin-cibeles-20260421',
  'Metro · Antón Martín → Banco de España',
  'Línea 1 hasta Sol, transbordo Línea 2 a Banco de España. ~8 min total. Alternativa: caminata 30 min por Barrio Letras (Huertas, Plaza Santa Ana).',
  '2026-04-21',
  '2026-04-21T09:45:00+02:00',
  '2026-04-21T09:55:00+02:00',
  'mad', 'mad',
  3.26, 'pi pi-train', 0, 'both',
  40.4110, -3.6990, 'Metro Antón Martín',
  40.4200, -3.6945, 'Metro Banco de España'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr21-metro-cibeles', 'Metro de Madrid', 'EUR 1.50 pp (€3.00 total)', 'L1+L2', 10);

-- Metro tarde: Lavapiés → Legazpi (para Matadero, abre 17:00)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr21-metro-legazpi',
  'traslado', 'metro',
  'mad-metro-lavapies-legazpi-20260421',
  'Metro · Lavapiés → Legazpi',
  'Línea 3 directa, ~8 min. Para llegar a Matadero Madrid (abre 17:00).',
  '2026-04-21',
  '2026-04-21T16:45:00+02:00',
  '2026-04-21T16:55:00+02:00',
  'mad', 'mad',
  3.26, 'pi pi-train', 0, 'both',
  40.4089, -3.7025, 'Metro Lavapiés',
  40.3912, -3.6945, 'Metro Legazpi'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr21-metro-legazpi', 'Metro de Madrid', 'EUR 1.50 pp (€3.00 total)', 'L3', 8);

-- Caminata noche: Airbnb → Café Central (Ateneo Madrid, Calle Prado 21)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr21-walk-cafecentral',
  'traslado', 'walking',
  'mad-walk-lavapies-cafecentral-20260421',
  'A pie · Lavapiés → Café Central (Ateneo)',
  'Caminata corta 8 min por Barrio Letras. Calle Prado 21.',
  '2026-04-21',
  '2026-04-21T19:50:00+02:00',
  '2026-04-21T19:58:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 0, 'both',
  40.4089, -3.7025, 'Airbnb Lavapiés',
  40.4147, -3.6988, 'Café Central (Ateneo de Madrid)'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr21-walk-cafecentral', NULL, '0', 'walking', 8);
