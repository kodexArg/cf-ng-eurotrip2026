-- 0109_mark_done_complete_may3to6.sql
-- Post-trip rectification (today 2026-05-17, whole trip already happened):
--  1) mark the whole trip as realizado (done=1)
--  2) fix the Apr 28 BCN→PMI flight (inverted timestamps)
--  3) build the empty days Sun May 3 and Mon May 4 (London)
--  4) complete Paris May 5 activities
--  5) Louvre 10–15h + 1h30 departure delay May 6 → cascades Rome arrival;
--     Rome check-in moved to 23:00 with a ❤️.
-- All new items are hito (no map route fields) → map untouched.

-- 1) Everything that happened is done.
UPDATE events SET done = 1;

-- 2) Apr 28: BCN→PMI flight, depart 10:00, ~55 min hop.
UPDATE events
SET timestamp_in  = '2026-04-28T10:00:00+02:00',
    timestamp_out = '2026-04-28T10:55:00+02:00'
WHERE id = 'ev-leg-bcn-pmi';

-- 3) Sun May 3 — Oxford → Stonehenge → Windsor day trip, then evening walk.
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-lon-may03-tour-salida','hito','bus','lon-may03-tour-salida','Salida del tour · Victoria Coach Station','2026-05-03','2026-05-03T07:30:00+01:00','2026-05-03T08:00:00+01:00','lon',0,'bus',1,'both',0,1),
 ('ev-lon-may03-oxford','hito','visit','lon-may03-oxford','Oxford','2026-05-03','2026-05-03T09:30:00+01:00','2026-05-03T11:30:00+01:00','lon',0,'monumento',1,'both',0,1),
 ('ev-lon-may03-stonehenge','hito','visit','lon-may03-stonehenge','Stonehenge','2026-05-03','2026-05-03T12:45:00+01:00','2026-05-03T14:00:00+01:00','lon',0,'monumento',1,'both',0,1),
 ('ev-lon-may03-windsor','hito','visit','lon-may03-windsor','Windsor Castle','2026-05-03','2026-05-03T15:00:00+01:00','2026-05-03T16:30:00+01:00','lon',0,'monumento',1,'both',0,1),
 ('ev-lon-may03-regreso','hito','bus','lon-may03-regreso','Regreso a Londres','2026-05-03','2026-05-03T17:30:00+01:00','2026-05-03T19:00:00+01:00','lon',0,'bus',1,'both',0,1),
 ('ev-lon-may03-tower-bridge','hito','walk','lon-may03-tower-bridge','Tower Bridge','2026-05-03','2026-05-03T19:30:00+01:00','2026-05-03T20:00:00+01:00','lon',0,'paseo',1,'both',0,1),
 ('ev-lon-may03-london-eye','hito','walk','lon-may03-london-eye','La noria · London Eye','2026-05-03','2026-05-03T20:00:00+01:00','2026-05-03T20:30:00+01:00','lon',0,'paseo',1,'both',0,1),
 ('ev-lon-may03-big-ben','hito','walk','lon-may03-big-ben','Big Ben','2026-05-03','2026-05-03T20:30:00+01:00','2026-05-03T21:00:00+01:00','lon',0,'paseo',1,'both',0,1);

-- 4) Mon May 4 — British Museum until closing, then walk to Coal Drops Yard.
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-lon-may04-british-museum','hito','museo','lon-may04-british-museum','Museo Británico · hasta el cierre','2026-05-04','2026-05-04T10:00:00+01:00','2026-05-04T17:00:00+01:00','lon',0,'museo',1,'both',0,1),
 ('ev-lon-may04-walk-kingscross','hito','walk','lon-may04-walk-kingscross','Caminata por Londres hacia King''s Cross','2026-05-04','2026-05-04T17:00:00+01:00','2026-05-04T19:00:00+01:00','lon',0,'paseo',1,'both',0,1),
 ('ev-lon-may04-coal-drops-dinner','hito','comida','lon-may04-coal-drops-dinner','Cena en Coal Drops Yard','2026-05-04','2026-05-04T19:00:00+01:00','2026-05-04T20:30:00+01:00','lon',0,'comida',1,'both',0,1),
 ('ev-lon-may04-canal-walk','hito','walk','lon-may04-canal-walk','Caminata por el canal','2026-05-04','2026-05-04T20:30:00+01:00','2026-05-04T21:30:00+01:00','lon',0,'paseo',1,'both',0,1);

-- 5) Paris May 5 — activities (existing Eurostar/metro/stay kept).
UPDATE events SET timestamp_in = '2026-05-05T15:00:00+02:00' WHERE id = 'ev-stay-auto-par';
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-par-may05-caminata-almuerzo','hito','comida','par-may05-caminata-almuerzo','Caminata por la ciudad y almuerzo en el centro','2026-05-05','2026-05-05T12:30:00+02:00','2026-05-05T14:30:00+02:00','par',0,'comida',1,'both',0,1),
 ('ev-par-may05-checkin','hito','hotel','par-may05-checkin','Check-in alojamiento · 15:00','2026-05-05','2026-05-05T15:00:00+02:00','2026-05-05T15:30:00+02:00','par',0,'hotel',1,'both',0,1),
 ('ev-par-may05-caminata-arco','hito','walk','par-may05-caminata-arco','Caminata Moulin Rouge → Arco del Triunfo','2026-05-05','2026-05-05T15:45:00+02:00','2026-05-05T16:45:00+02:00','par',0,'paseo',1,'both',0,1),
 ('ev-par-may05-arco','hito','visit','par-may05-arco','Arco del Triunfo','2026-05-05','2026-05-05T16:45:00+02:00','2026-05-05T17:30:00+02:00','par',0,'monumento',1,'both',0,1),
 ('ev-par-may05-eiffel','hito','visit','par-may05-eiffel','Torre Eiffel bajo la lluvia','2026-05-05','2026-05-05T17:45:00+02:00','2026-05-05T19:15:00+02:00','par',0,'monumento',1,'both',0,1),
 ('ev-par-may05-moulin-noche','hito','walk','par-may05-moulin-noche','Moulin Rouge de noche · paseo','2026-05-05','2026-05-05T21:00:00+02:00','2026-05-05T21:45:00+02:00','par',0,'paseo',1,'both',0,1),
 ('ev-par-may05-fiveguys','hito','comida','par-may05-fiveguys','Cena en Five Guys','2026-05-05','2026-05-05T22:00:00+02:00','2026-05-05T23:00:00+02:00','par',0,'comida',1,'both',0,1);

-- 6) May 6 — Louvre 10–15h, +1h30 departure delay cascades to Rome 23:00.
UPDATE events SET timestamp_in='2026-05-06T09:30:00+02:00', timestamp_out='2026-05-06T09:55:00+02:00' WHERE id='ev-leg-par-hotel-louvre';
UPDATE events SET timestamp_in='2026-05-06T10:00:00+02:00', timestamp_out='2026-05-06T15:00:00+02:00', title='Museo del Louvre · 10:00' WHERE id='ev-par-may06-louvre';
UPDATE events SET timestamp_in='2026-05-06T15:15:00+02:00', timestamp_out='2026-05-06T15:45:00+02:00' WHERE id='ev-leg-par-metro14-ory';
UPDATE events SET timestamp_in='2026-05-06T18:20:00+02:00', timestamp_out='2026-05-06T20:25:00+02:00', notes='Demora de 1h30 en la salida' WHERE id='ev-leg-par-rom';
UPDATE events SET timestamp_in='2026-05-06T21:00:00+02:00', timestamp_out='2026-05-06T21:32:00+02:00' WHERE id='ev-leg-leo-express';
UPDATE events SET timestamp_in='2026-05-06T21:35:00+02:00', timestamp_out='2026-05-06T21:55:00+02:00' WHERE id='ev-leg-rom-termini-hotel';
UPDATE events SET timestamp_in='2026-05-06T23:00:00+02:00', title='Airbnb Colosseo ❤️' WHERE id='est-rom-airbnb-colosseo';
