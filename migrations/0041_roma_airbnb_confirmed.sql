-- 0041_roma_airbnb_confirmed.sql
-- Confirmar estadia Roma: Airbnb Colosseo (May 6-9 2026).
-- Setea confirmed = 1. No modifica usd ni ningún otro campo.

UPDATE events
SET confirmed = 1
WHERE id = 'est-rom-airbnb-colosseo';
