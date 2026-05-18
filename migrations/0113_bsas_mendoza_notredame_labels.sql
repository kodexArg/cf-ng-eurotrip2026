-- 0113_bsas_mendoza_notredame_labels.sql
--  • May 10 continues after Buenos Aires: Ezeiza→Aeroparque transfer,
--    flight to Mendoza 19:00, arrival Mendoza 22:00 (end of trip).
--  • May 5 Paris: Notre Dame (a bit before Arco del Triunfo) + bridges walk.
--  • Improve flagship transfer endpoint labels (no bare-city "mediocre" destinations).
-- All hito/transfer; no map route coords added → map untouched.

-- May 10 — Buenos Aires → Mendoza, end of trip.
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,city_out,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-eze-may10-transfer-aeroparque','traslado','transfer','eze-may10-transfer-aeroparque','Traslado Ezeiza → Aeroparque','2026-05-10','2026-05-10T17:00:00-03:00','2026-05-10T18:00:00-03:00','eze','eze',0,'transporte',1,'both',0,1),
 ('ev-leg-eze-mza','traslado','flight','eze-mza','Vuelo Buenos Aires (Aeroparque) → Mendoza','2026-05-10','2026-05-10T19:00:00-03:00','2026-05-10T21:00:00-03:00','eze','eze',0,'aterriza',1,'both',0,1),
 ('ev-mza-may10-fin','hito','visit','mza-may10-fin','Llegada a Mendoza · fin del viaje 🎉','2026-05-10','2026-05-10T22:00:00-03:00','2026-05-10T22:30:00-03:00','eze',NULL,0,'monumento',1,'both',0,1);

-- May 5 Paris — Notre Dame (slightly before Arco) + bridges walk; reflow afternoon.
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-par-may05-notredame','hito','visit','par-may05-notredame','Notre Dame','2026-05-05','2026-05-05T15:45:00+02:00','2026-05-05T16:30:00+02:00','par',0,'monumento',1,'both',0,1),
 ('ev-par-may05-puentes','hito','walk','par-may05-puentes','Paseo por los puentes','2026-05-05','2026-05-05T16:30:00+02:00','2026-05-05T17:00:00+02:00','par',0,'paseo',1,'both',0,1);
UPDATE events SET timestamp_in='2026-05-05T17:00:00+02:00', timestamp_out='2026-05-05T17:30:00+02:00' WHERE id='ev-par-may05-caminata-arco';
UPDATE events SET timestamp_in='2026-05-05T17:30:00+02:00', timestamp_out='2026-05-05T18:00:00+02:00' WHERE id='ev-par-may05-arco';
UPDATE events SET timestamp_in='2026-05-05T18:15:00+02:00', timestamp_out='2026-05-05T19:45:00+02:00' WHERE id='ev-par-may05-eiffel';

-- Better transfer endpoint labels for the flagship flights.
UPDATE events SET origin_label='Aeropuerto de Santiago (SCL)', destination_label='Madrid-Barajas T4' WHERE id='ev-leg-scl-mad';
UPDATE events SET origin_label='Barcelona El Prat T1',        destination_label='Palma · Son Sant Joan' WHERE id='ev-leg-bcn-pmi';
UPDATE events SET origin_label='Roma Fiumicino T1',           destination_label='Madrid-Barajas T4' WHERE id='ev-leg-fco-mad';
UPDATE events SET origin_label='Madrid-Barajas T4',           destination_label='Buenos Aires · Ezeiza (EZE)' WHERE id='ev-leg-mad-eze';
UPDATE events SET origin_label='París Orly',                  destination_label='Roma Fiumicino' WHERE id='ev-leg-par-rom';
