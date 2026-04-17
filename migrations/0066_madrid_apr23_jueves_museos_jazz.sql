-- 0066_madrid_apr23_jueves_museos_jazz.sql
-- Rework del último día completo en Madrid (jueves 23 abr 2026).
-- AVE Madrid→Barcelona es al día siguiente (24 abr 08:57).
--
-- Cambios vs migration 0049:
--   1. DELETE Retiro (ya se hizo Apr 20 y Apr 21).
--   2. DELETE Mercado de San Miguel (turista, se reemplaza por tapas locales).
--   3. UPDATE Reina Sofía: descripción enriquecida (jueves gratis 19-21h).
--   4. INSERT nuevos:
--      - Almuerzo tapas Lavapiés
--      - Museo Thyssen · Hammershøi + Rauschenberg (exposiciones TOP)
--      - Caminata Thyssen → Lavapiés
--      - Descanso Airbnb + cena ligera barrio
--      - El Junco · jam session jazz gratis (OPCIONAL, último jazz Madrid)
--
-- Todos los nuevos confirmed=0.

-- ─────────────────────────────────────────────────────────────────────
-- 1. DELETEs
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events WHERE id = 'ev-mad-apr23-retiro';
DELETE FROM events WHERE id = 'ev-mad-apr23-sanmiguel';

-- ─────────────────────────────────────────────────────────────────────
-- 2. UPDATE Reina Sofía: horarios + descripción enriquecida
-- ─────────────────────────────────────────────────────────────────────
UPDATE events SET
  description   = 'Guernica de Picasso, Dalí, Miró. Arte español s.XX. €12 pp. **Reservar online.** Última entrada 18:30. **Jueves gratis 19:00-21:00**, pero vas de mañana para mezclarlo con Thyssen.',
  timestamp_in  = '2026-04-23T10:00:00+02:00',
  timestamp_out = '2026-04-23T13:00:00+02:00'
WHERE id = 'ev-mad-apr23-reinasofia';

-- ─────────────────────────────────────────────────────────────────────
-- 3. Hito · Almuerzo tapas · Lavapiés
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr23-almuerzo-lavapies',
  'hito', 'food',
  'mad-almuerzo-lavapies-20260423',
  'Almuerzo tapas · Lavapiés',
  'Taberna local en Lavapiés (barrio del Airbnb). ~€25 pareja.',
  '2026-04-23',
  '2026-04-23T13:30:00+02:00',
  '2026-04-23T14:45:00+02:00',
  'mad',
  27.18, 'pi pi-shop', 0, 'both',
  40.4089, -3.7025
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. Hito · Museo Thyssen · Hammershøi + Rauschenberg
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr23-thyssen',
  'hito', 'museo',
  'mad-thyssen-hammershoi-rauschenberg-20260423',
  'Museo Thyssen · Hammershøi + Rauschenberg',
  '**Dos temporales TOP**: Hammershøi (luz doméstica danesa, 17 feb–31 may) + Rauschenberg ''Express. On the Move'' (centenario, 3 feb–24 may). €15 pp normal, o **GRATIS lunes 12-16h** (no aplica jueves). Sábados 21-23h también gratis.',
  '2026-04-23',
  '2026-04-23T15:00:00+02:00',
  '2026-04-23T18:00:00+02:00',
  'mad',
  32.61, 'pi pi-image', 0, 'both',
  40.4160, -3.6946
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. Traslado a pie · Thyssen → Lavapiés
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-mad-apr23-caminata-thyssen-atocha',
  'traslado', 'walking',
  'mad-caminata-thyssen-lavapies-20260423',
  'A pie · Thyssen → Lavapiés',
  'Caminata de regreso al barrio, ~25 min por el centro.',
  '2026-04-23',
  '2026-04-23T18:00:00+02:00',
  '2026-04-23T18:25:00+02:00',
  'mad', 'mad',
  'pi pi-map-marker',
  0, 'both',
  40.4160, -3.6946, 'Museo Thyssen',
  40.4089, -3.7025, 'Airbnb Lavapiés'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-mad-apr23-caminata-thyssen-atocha', NULL, '0', 'walking', 25);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Hito · Descanso Airbnb + cena ligera barrio
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr23-descanso-cena',
  'hito', 'food',
  'mad-descanso-cena-20260423',
  'Descanso Airbnb + cena ligera barrio',
  'Última noche en Madrid tranquila antes del AVE 08:57 de mañana.',
  '2026-04-23',
  '2026-04-23T19:00:00+02:00',
  '2026-04-23T21:30:00+02:00',
  'mad',
  21.74, 'pi pi-home', 0, 'both',
  40.4089, -3.7025
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Hito · El Junco · jam session jazz (GRATIS) — OPCIONAL
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr23-jam-junco',
  'hito', 'music',
  'mad-junco-jam-20260423',
  'El Junco · jam session jazz (GRATIS)',
  '**Jam session gratis martes-jueves** (consumición mínima €10-15 pareja). Vibra informal, músicos rotando. Último Madrid con jazz vivo. **OPCIONAL** — si tienen energía con AVE 08:57 mañana.',
  '2026-04-23',
  '2026-04-23T22:00:00+02:00',
  '2026-04-23T23:59:00+02:00',
  'mad',
  16.30, 'pi pi-volume-up', 0, 'both',
  40.4287, -3.6968
);
