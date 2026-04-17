-- 0076_hitos_coords.sql
-- Completar coordenadas para 4 hitos de Madrid (apr20) que tenían lat/lon NULL.
-- Fuentes: OpenStreetMap Nominatim + Apple Maps (Plaza de Tirso de Molina)

-- ev-mad-apr20-paseo-tirso
-- Plaza de Tirso de Molina, 28012 Madrid (Barrio de Embajadores / Lavapiés)
-- Source: Apple Maps / Nominatim → 40.412303, -3.704723
UPDATE events
SET lat = 40.412303, lon = -3.704723
WHERE id = 'ev-mad-apr20-paseo-tirso';

-- ev-mad-apr20-cafe-pre-checkin
-- Plaza Lavapiés, 28012 Madrid
-- Description: "Café o caña en bar de Lavapiés (Plaza Lavapiés o C. Argumosa)"
-- Source: Nominatim → 40.410801, -3.707629
UPDATE events
SET lat = 40.410801, lon = -3.707629
WHERE id = 'ev-mad-apr20-cafe-pre-checkin';

-- ev-mad-apr20-siesta
-- Airbnb Lavapiés (sin dirección específica) → Plaza Lavapiés como punto de referencia del barrio
-- Source: Nominatim Plaza Lavapiés → 40.410801, -3.707629
UPDATE events
SET lat = 40.410801, lon = -3.707629
WHERE id = 'ev-mad-apr20-siesta';

-- ev-mad-apr20-malasana
-- C. del Pez + Plaza Dos de Mayo, Malasaña, Madrid
-- Description: "Paseo tranquilo C. del Pez + Plaza Dos de Mayo · 1 cerveza en bar"
-- Using Plaza Dos de Mayo as main reference point for Malasaña
-- Source: Nominatim → 40.426968, -3.704092
UPDATE events
SET lat = 40.426968, lon = -3.704092
WHERE id = 'ev-mad-apr20-malasana';
