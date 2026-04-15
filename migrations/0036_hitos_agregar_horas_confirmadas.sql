-- 0036_hitos_agregar_horas_confirmadas.sql
-- Agregar horas confirmadas a títulos de hitos para visibilidad en UI
-- (info-row solo muestra h.title, no renderiza timestamp_in)

-- Louvre: timed-entry 09:30 CEST
UPDATE events
SET title = 'Museo del Louvre · 09:30'
WHERE id = 'ev-par-may06-louvre';

-- Sky Garden: time-slot confirmado 16:00
UPDATE events
SET title = 'Sky Garden · 20 Fenchurch (Walkie-Talkie) · 16:00'
WHERE id = 'ev-lon-may04-skygarden';

-- Sagrada Família: booking confirmado 17:00
UPDATE events
SET title = 'Sagrada Família — acceso básico + Torre del Nacimiento · 17:00'
WHERE id = 'ev-bk-sagrada';

-- Park Güell: confirmed, timestamp 10:00
UPDATE events
SET title = 'Park Güell · 10:00'
WHERE id = 'ev-bcn-act-apr26-park-guell';

-- Tour Windsor · Stonehenge · Oxford: salida 08:00 confirmada
UPDATE events
SET title = 'Windsor · Stonehenge · Oxford — excursión día completo · 08:00'
WHERE id = 'ev-lon-may03-stonehenge';
