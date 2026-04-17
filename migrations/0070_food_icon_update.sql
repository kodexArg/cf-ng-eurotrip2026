-- 0070_food_icon_update.sql
-- Actualiza icono de eventos food no-confirmados a Material Symbols lunch_dining (sandwich).
-- Scope: viaje completo Apr 20 - May 10 2026.
-- Filtros: solo confirmed=0 (los pagados/confirmados conservan su icono original).
UPDATE events
SET icon = 'ms-lunch_dining'
WHERE confirmed = 0
  AND subtype = 'food'
  AND date BETWEEN '2026-04-20' AND '2026-05-10';
