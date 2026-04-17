-- Migration 0073: Self-evaluation + rectification (Apr 20 - May 10 window)
-- Agent: self-eval-rectify-push
-- Date: 2026-04-17
--
-- =========================================================================
-- FASE 1 — SELF-EVALUATION (audit queries ejecutadas contra D1 remote)
-- =========================================================================
--
-- A) Hitos confirmed=0 SIN coords (lat/lon NULL):
--    count = 1
--    · ev-par-may04-tarde (2026-05-05, "París tranquilo · día paseable", city_in=par)
--
-- B) Traslados confirmed=0 SIN origin/destination coords:
--    count = 0  -> OK
--
-- C) Events con usd NULL:
--    count = 0  -> OK
--
-- D) Comidas confirmed=0 con icon != 'ms-lunch_dining':
--    count = 0  -> OK (wave 0070 ya normalizó)
--
-- E) Overlaps hito/hito confirmed=0:
--    count = 0  -> OK (waves 0067 + 0072 resolvieron)
--
-- F) Días sin cena (timestamp_in >= 19, usando substr para evitar bug tz strftime):
--    count = 2
--    · 2026-04-21 (aniversario: Café Central 20:00-23:00 es music, no food; cena implícita)
--    · 2026-05-02 (Londres llegada: almuerzo 16:00 + Denmark bars 18-22; falta cena formal)
--
-- G) Días sin almuerzo (timestamp_in 12-15, usando substr):
--    count = 2
--    · 2026-05-02 (almuerzo 16:00 cuenta como tardío; borderline)
--    · 2026-05-03 (Stonehenge excursion 8-19, no hay lunch event)
--
-- NOTA: La spec original usaba strftime('%H', timestamp_in) pero falla con ISO+offset
--       (interpreta como UTC). Substr(_, 12, 2) es el fix correcto.
--
-- =========================================================================
-- FASE 2 — BACKLOG priorizado
-- =========================================================================
--
-- P0 (bloqueante convención): ninguno  (usd NULL=0, icons food=0)
-- P1 (importante, impacta mapa/overlap):
--     - 1 hito París sin coords (ev-par-may04-tarde)
-- P2 (mejora completitud itinerario):
--     - Apr 21: agregar cena ligera pre-jazz (antes de Café Central 20:00)
--     - May 2: agregar cena ligera Soho post-Denmark bars
--     - May 3: agregar lunch on-road (parada coach Windsor/Oxford)
--
-- =========================================================================
-- FASE 3 — RECTIFICACIÓN
-- =========================================================================

-- Fix 1: usd NULL → 0 (salvaguarda defensiva, count actual = 0)
UPDATE events
SET usd = 0
WHERE usd IS NULL
  AND confirmed = 0
  AND type IN ('hito','traslado')
  AND date BETWEEN '2026-04-20' AND '2026-05-10';

-- Fix 2: icons food (salvaguarda defensiva, count actual = 0)
UPDATE events
SET icon = 'ms-lunch_dining'
WHERE subtype = 'food'
  AND confirmed = 0
  AND icon != 'ms-lunch_dining'
  AND date BETWEEN '2026-04-20' AND '2026-05-10';

-- Fix 3: Coords para hito sin lat/lon
-- ev-par-may04-tarde ("París tranquilo") → centro de París (Île de la Cité / Notre-Dame area)
UPDATE events
SET lat = 48.8566, lon = 2.3522
WHERE id = 'ev-par-may04-tarde'
  AND confirmed = 0
  AND lat IS NULL;

-- Fix 4: Overlaps (none remaining) — no-op

-- Fix 5: Meals faltantes (confirmed=0, icon ms-lunch_dining)

-- 5a) Apr 21 · Cena ligera pre-jazz en Lavapiés (tapas rápidas antes de caminar al Café Central)
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-mad-apr21-cena-prejazz', 'hito', 'food', 'madrid-cena-prejazz-20260421', 'Cena ligera pre-jazz · Lavapiés',
 'Tapas rápidas en Lavapiés antes de caminar al Café Central (Ateneo). Aniversario 30: noche principal es el jazz club.',
 '2026-04-21', '2026-04-21T19:00:00+02:00', '2026-04-21T19:45:00+02:00', 'mad', 43.48, 'ms-lunch_dining', 0, 'both', 40.4089, -3.7025);

-- 5b) May 2 · Cena Soho (después de Denmark Street bars)
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-lon-may02-cena', 'hito', 'food', 'london-cena-20260502', 'Cena · Soho pub',
 'Cena tardía en pub de Soho tras Denmark Street bars. Fish & chips o gastropub típico.',
 '2026-05-02', '2026-05-02T22:15:00+01:00', '2026-05-02T23:30:00+01:00', 'lon', 43.48, 'ms-lunch_dining', 0, 'both', 51.5074, -0.1278);

-- 5c) May 3 · Almuerzo on-road (parada coach típicamente en Windsor o Oxford)
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-lon-may03-almuerzo', 'hito', 'food', 'london-almuerzo-20260503', 'Almuerzo on-road · parada excursión',
 'Almuerzo rápido durante excursión Windsor/Stonehenge/Oxford (parada típica Oxford o pub campestre).',
 '2026-05-03', '2026-05-03T13:00:00+01:00', '2026-05-03T14:00:00+01:00', 'lon', 32.61, 'ms-lunch_dining', 0, 'both', 51.5074, -0.1278);
