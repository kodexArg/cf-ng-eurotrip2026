-- 0076_sagrada_dedup.sql
-- Consolidar duplicados Sagrada Família: conservar ev-bk-sagrada (usd=78.26, 17:00 real)
-- y borrar ev-bcn-act-apr27-sagrada (usd=0, 15:00 placeholder).
-- Se mergean title limpio y description del evento borrado al sobreviviente.

-- Actualizar el sobreviviente con campos útiles del duplicado
UPDATE events
SET
  title       = 'Sagrada Família',
  description = 'Sagrada Família — acceso básico + Torre del Nacimiento. Ticket comprado.',
  subtype     = 'visit'
WHERE id = 'ev-bk-sagrada';

-- Eliminar el duplicado
DELETE FROM events WHERE id = 'ev-bcn-act-apr27-sagrada';
