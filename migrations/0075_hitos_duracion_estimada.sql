-- Migration 0075: Duración estimada para hitos confirmed=0 con timestamp_out NULL
-- 40 hitos de tipo "hito" sin duración asignada.
-- Duraciones inferidas por subtype, título y contexto de eventos adyacentes.
-- Timestamps sin zona horaria respetan el formato original del registro.

-- ============================================================
-- APR 23 · MADRID
-- ============================================================

-- "Lavapiés · Atocha" · food · 20:00
-- Cena de despedida; adyacente a ev-mad-apr23-descanso-cena (19:00-21:30).
-- Se solapa en el mismo slot; se le asigna 1h (rango propio dentro del bloque).
UPDATE events
SET timestamp_out = '2026-04-23T21:00:00'
WHERE id = 'ev-mad-apr23-cena-despedida';

-- ============================================================
-- APR 28 · PALMA DE MALLORCA
-- ============================================================

-- "Casco Antiguo" · visit · 15:00
-- Tarde en el casco histórico; siguiente evento: Playa Peguera 16:00.
UPDATE events
SET timestamp_out = '2026-04-28T16:00:00'
WHERE id = 'ev-pmi-apr28-pm';

-- "La Lonja" · visit · 20:00
-- Paseo nocturno por La Lonja; siguiente bloque al día siguiente.
UPDATE events
SET timestamp_out = '2026-04-28T21:30:00'
WHERE id = 'ev-pmi-apr28-ev';

-- "La Lonja · Casco Antiguo" · food · 20:00
-- Recomendación de restaurante (celler); cena completa ~1.5h.
UPDATE events
SET timestamp_out = '2026-04-28T21:30:00'
WHERE id = 'ev-pmi-apr28-rec-celler';

-- "La Lonja" · leisure · 20:00
-- Recomendación tapas; más liviano que cena formal.
UPDATE events
SET timestamp_out = '2026-04-28T21:00:00'
WHERE id = 'ev-pmi-apr28-rec-tapas';

-- ============================================================
-- APR 29 · PALMA DE MALLORCA
-- ============================================================

-- "Catedral La Seu" · visit · 10:00
-- Visita rápida exterior/interior; siguiente hito 10:30.
UPDATE events
SET timestamp_out = '2026-04-29T10:30:00'
WHERE id = 'ev-pmi-apr29-am';

-- "Santa Catalina" (mercado) · visit · 10:00
-- Recorrida de mercado; siguiente hito 10:30.
UPDATE events
SET timestamp_out = '2026-04-29T10:30:00'
WHERE id = 'ev-pmi-apr29-rec-mercado';

-- "Santa Catalina" · visit · 15:00
-- Barrio de tarde; siguiente hito: Deià 15:30.
UPDATE events
SET timestamp_out = '2026-04-29T15:30:00'
WHERE id = 'ev-pmi-apr29-pm';

-- "Casco Antiguo" · food · 15:00
-- Café post-catedral; corto, siguiente hito 15:30.
UPDATE events
SET timestamp_out = '2026-04-29T15:30:00'
WHERE id = 'ev-pmi-apr29-rec-cafe-catedral';

-- "Paseo del Borne" · visit · 20:00
-- Paseo nocturno corto; siguiente evento: cena 20:30.
UPDATE events
SET timestamp_out = '2026-04-29T20:30:00'
WHERE id = 'ev-pmi-apr29-ev';

-- "Paseo del Borne" · leisure · 20:00
-- Recomendación rooftop; hasta cena 20:30.
UPDATE events
SET timestamp_out = '2026-04-29T20:30:00'
WHERE id = 'ev-pmi-apr29-rec-rooftop';

-- ============================================================
-- APR 30 · MALLORCA (ruta serra + sur)
-- ============================================================

-- "Valldemossa" · visit · 10:00
-- Pueblo histórico; bloque hasta almuerzo 14:00 (2h razonables).
UPDATE events
SET timestamp_out = '2026-04-30T12:00:00'
WHERE id = 'ev-pmi-apr30-am';

-- "Valldemossa · Serra de Tramuntana" · leisure · 10:00
-- Recomendación de rutas/capas; bloque de mañana, 1.5h.
UPDATE events
SET timestamp_out = '2026-04-30T11:30:00'
WHERE id = 'ev-pmi-apr30-rec-capas';

-- "Valldemossa" · visit · 15:00
-- Tarde en Valldemossa; siguiente bloque: cena 20:00, dar 1.5h.
UPDATE events
SET timestamp_out = '2026-04-30T16:30:00'
WHERE id = 'ev-pmi-apr30-pm';

-- "Deià" · visit · 15:00
-- Pueblo de tarde; recomendación alternativa, 1.5h.
UPDATE events
SET timestamp_out = '2026-04-30T16:30:00'
WHERE id = 'ev-pmi-apr30-rec-deia';

-- "Serra de Tramuntana" · visit · 15:00
-- Mirador tipo; más corto, 1h.
UPDATE events
SET timestamp_out = '2026-04-30T16:00:00'
WHERE id = 'ev-pmi-apr30-rec-soller-mirador';

-- "Palma" · visit · 20:00
-- Paseo nocturno Palma; cena adyacente 20:00, dar 30min de stroll.
UPDATE events
SET timestamp_out = '2026-04-30T20:30:00'
WHERE id = 'ev-pmi-apr30-ev';

-- ============================================================
-- MAY 1 · MALLORCA (Sóller + Port de Sóller)
-- ============================================================

-- "Sóller" · visit · 10:00
-- Pueblo tren histórico; bloque hasta almuerzo 13:30, dar 2h.
UPDATE events
SET timestamp_out = '2026-05-01T12:00:00'
WHERE id = 'ev-pmi-may01-am';

-- "Sóller" · food · 10:00
-- Recomendación naranjas/zumo; degustación corta, 30min.
UPDATE events
SET timestamp_out = '2026-05-01T10:30:00'
WHERE id = 'ev-pmi-may01-rec-naranjas';

-- "Port de Sóller" · visit · 15:00
-- Puerto de tarde; siguiente evento: Paseo Marítimo 17:00.
UPDATE events
SET timestamp_out = '2026-05-01T17:00:00'
WHERE id = 'ev-pmi-may01-pm';

-- "Port de Sóller" · leisure · 15:00
-- Recomendación kayak; actividad acuática ~2h.
UPDATE events
SET timestamp_out = '2026-05-01T17:00:00'
WHERE id = 'ev-pmi-may01-rec-kayak';

-- "Port de Sóller" · leisure · 15:00
-- Recomendación UV/snack; liviano, 1h.
UPDATE events
SET timestamp_out = '2026-05-01T16:00:00'
WHERE id = 'ev-pmi-may01-rec-uv-snack';

-- "Palma" · visit · 20:00
-- Llegada nocturna a Palma; cena 20:30.
UPDATE events
SET timestamp_out = '2026-05-01T20:30:00'
WHERE id = 'ev-pmi-may01-ev';

-- ============================================================
-- MAY 6 · ROMA (llegada día)
-- ============================================================

-- "Colosseo" · visit · 10:00
-- Coliseo + Foro Romano; visita completa ~2.5h.
UPDATE events
SET timestamp_out = '2026-05-06T12:30:00'
WHERE id = 'ev-rom-may06-am';

-- "Rione Monti" · visit · 15:00
-- Barrio de callejeo; tarde, dar 2h.
UPDATE events
SET timestamp_out = '2026-05-06T17:00:00'
WHERE id = 'ev-rom-may06-pm';

-- "Roma" · visit · 20:00
-- Paseo nocturno post-llegada; cena Colosseo 21:30.
UPDATE events
SET timestamp_out = '2026-05-06T21:00:00'
WHERE id = 'ev-rom-may06-ev';

-- ============================================================
-- MAY 7 · ROMA (Vaticano)
-- ============================================================

-- "Musei Vaticani" · visit · 10:00
-- Museos Vaticanos + Capilla Sixtina; visita intensa ~3h.
UPDATE events
SET timestamp_out = '2026-05-07T13:00:00'
WHERE id = 'ev-rom-may07-am';

-- "San Pietro · Prati" · visit · 15:00
-- Basílica San Pietro + barrio Prati; ~2h.
UPDATE events
SET timestamp_out = '2026-05-07T17:00:00'
WHERE id = 'ev-rom-may07-pm';

-- "Trastevere" · visit · 20:00
-- Paseo por Trastevere; cena 20:30, dar 30min.
UPDATE events
SET timestamp_out = '2026-05-07T20:30:00'
WHERE id = 'ev-rom-may07-ev';

-- ============================================================
-- MAY 8 · ROMA (Borghese)
-- ============================================================

-- "Galleria Borghese" · visit · 10:00
-- Entrada cronometrada Borghese (2h exactas); estándar.
UPDATE events
SET timestamp_out = '2026-05-08T12:00:00'
WHERE id = 'ev-rom-may08-am';

-- "Villa Borghese" · visit · 15:00
-- Parque Villa Borghese; paseo tranquilo ~2h.
UPDATE events
SET timestamp_out = '2026-05-08T17:00:00'
WHERE id = 'ev-rom-may08-pm';

-- "Roma" · visit · 20:00
-- Última noche en Roma; cena 20:30.
UPDATE events
SET timestamp_out = '2026-05-08T20:30:00'
WHERE id = 'ev-rom-may08-ev';

-- ============================================================
-- MAY 9 · REGRESO (Roma → Madrid)
-- ============================================================

-- "Aeropuerto MAD" · transfer · 08:00 (llegada nocturna vuelo anterior)
-- Llegada/recogida en T4 MAD; ~1h proceso aeropuerto.
UPDATE events
SET timestamp_out = '2026-05-09T09:00:00'
WHERE id = 'ev-mad-may09-noche-regreso-t4';

-- "Roma" · visit · 10:00
-- Última mañana libre en Roma; almuerzo 13:00.
UPDATE events
SET timestamp_out = '2026-05-09T12:00:00'
WHERE id = 'ev-rom-may09-am';

-- "FCO · IB0656" · transfer · 15:00
-- Check-in + seguridad + sala espera FCO; vuelo sale 20:25.
UPDATE events
SET timestamp_out = '2026-05-09T16:30:00'
WHERE id = 'ev-rom-may09-pm';

-- "Aeropuerto MAD" · transfer · 19:00
-- Llegada vuelo IB0656; desembarco + baggage ~30min.
UPDATE events
SET timestamp_out = '2026-05-09T19:30:00'
WHERE id = 'ev-mad-may09-noche-llegada';

-- "Cena Madrid" · food · 20:00
-- Cena post-regreso; ~1.5h.
UPDATE events
SET timestamp_out = '2026-05-09T21:30:00'
WHERE id = 'ev-mad-may09-noche-cena';

-- "Plaza Mayor" · visit · 20:00
-- Paseo nocturno Plaza Mayor; 30min.
UPDATE events
SET timestamp_out = '2026-05-09T20:30:00'
WHERE id = 'ev-mad-may09-noche-plaza-mayor';

-- "La Latina" · leisure · 20:00
-- Barrio La Latina de noche; 45min.
UPDATE events
SET timestamp_out = '2026-05-09T20:45:00'
WHERE id = 'ev-mad-may09-noche-la-latina';

-- "Gran Vía" · leisure · 20:00
-- Paseo Gran Vía nocturno; 30min.
UPDATE events
SET timestamp_out = '2026-05-09T20:30:00'
WHERE id = 'ev-mad-may09-noche-gran-via';
