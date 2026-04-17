-- migrations/0082_toledo_apr22_confirm_pulsera_prado.sql
-- 1. Confirmar tren vuelta Toledo→Madrid 17:00-17:34 + valorizar ambos trenes
-- 2. Insertar primer hito Toledo: compra de Pulsera Turística (Arco de Palacio 3)
-- 3. Santo Tomé → usd=0 (cubierto por pulsera; la pulsera ya lo contabiliza)
-- 4. Confirmar Museo del Prado Apr 22 18-20h (gratis)
--
-- Precios RENFE Avant 2026: ~13.90 EUR/persona promedio → 27.80 EUR × 1.09 = USD 30.30 (2 pax)
-- Pulsera Turística Toledo Monumental: 14 EUR/persona → 28 EUR × 1.09 = USD 30.52 (2 pax)
-- Incluye: Santo Tomé, Sinagoga Blanca, San Juan de los Reyes, Cristo de la Luz + 3 más

-- 1a. Confirmar tren vuelta + precio
UPDATE events
SET confirmed = 1, usd = 30.30
WHERE id = 'ev-tol-apr22-avant-vuelta';

-- 1b. Corregir precio tren ida (era 39.13, precio correcto ~30.30 USD)
UPDATE events
SET usd = 30.30
WHERE id = 'ev-tol-apr22-avant-ida';

-- 2. Primer hito Toledo: compra Pulsera Turística (09:55-10:10, gap existente)
INSERT INTO events (
  id, type, subtype, slug, title,
  date, timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, variant,
  notes, lat, lon
) VALUES (
  'ev-tol-apr22-pulsera',
  'hito', 'tour',
  'tol-pulsera-20260422',
  'Pulsera Turística · Toledo Monumental',
  '2026-04-22',
  '2026-04-22T09:55:00+02:00',
  '2026-04-22T10:10:00+02:00',
  'mad',
  30.52,
  'pi-ticket',
  0, 'both',
  'Compra en Calle Arco de Palacio 3 (junto a la Catedral). Incluye: Santo Tomé, Sinagoga Blanca, San Juan de los Reyes, Cristo de la Luz, Iglesia del Salvador, San Ildefonso (Jesuitas), Colegio Doncellas. Validez 7 días.',
  39.8568, -4.0238
);

-- 3. Santo Tomé → usd=0 (cubierto por la pulsera)
UPDATE events
SET usd = 0
WHERE id = 'ev-tol-apr22-santotome';

-- 4. Confirmar Museo del Prado Apr 22 18-20h (gratuito)
UPDATE events
SET confirmed = 1
WHERE id = 'ev-mad-apr22-prado';
