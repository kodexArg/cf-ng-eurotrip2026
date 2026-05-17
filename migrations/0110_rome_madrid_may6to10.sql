-- 0110_rome_madrid_may6to10.sql
-- Rome + return rectification (post-trip bitácora).
--  6: late-night pizza note.
--  7: Vatican CLOSED (red+strikethrough via subtype 'cerrado') → walking day.
--  8: hop-on bus all day, Vatican basilica+square, Colosseo ~16h, center walk, forum, scooter back.
--  9: Fiumicino early but beach day-trip (Uber round trip) until late, then fly to Madrid.
-- 10: arrive Madrid ~00:00, center all night until 6AM, Five Guys farewell, 09:00 MAD→EZE.
-- Removes 6 mis-placed May-9 "noche Madrid" placeholders (rectification, per user).
-- All new items are hito → map untouched. New rows done=1.

-- 6) Late-night pizza.
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-rom-may06-pizza','hito','comida','rom-may06-pizza','Pizza a pay & go a última hora','2026-05-06','2026-05-06T23:30:00+02:00','2026-05-07T00:00:00+02:00','rom',0,'comida',1,'both',0,1);

-- 7) Vatican closed → walk across Rome (order preserved by timestamps).
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-rom-may07-vaticano-cerrado','hito','cerrado','rom-may07-vaticano-cerrado','Vaticano CERRADO','2026-05-07','2026-05-07T09:00:00+02:00','2026-05-07T09:30:00+02:00','rom',0,'cerrado',1,'both',0,1),
 ('ev-rom-may07-trevi','hito','visit','rom-may07-trevi','Fontana di Trevi','2026-05-07','2026-05-07T10:00:00+02:00','2026-05-07T10:45:00+02:00','rom',0,'monumento',1,'both',0,1),
 ('ev-rom-may07-pantheon','hito','visit','rom-may07-pantheon','Pantheon','2026-05-07','2026-05-07T11:00:00+02:00','2026-05-07T11:45:00+02:00','rom',0,'monumento',1,'both',0,1),
 ('ev-rom-may07-cordonata','hito','walk','rom-may07-cordonata','Escalinata a la Plaza del Campidoglio (Miguel Ángel)','2026-05-07','2026-05-07T12:00:00+02:00','2026-05-07T12:45:00+02:00','rom',0,'paseo',1,'both',0,1),
 ('ev-rom-may07-foro-vista','hito','visit','rom-may07-foro-vista','Vista al Foro Romano','2026-05-07','2026-05-07T12:45:00+02:00','2026-05-07T13:30:00+02:00','rom',0,'monumento',1,'both',0,1);

-- 8) Hop-on bus day, Vatican, Colosseo, center, forum, scooter back.
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-rom-may08-bus-turistico','hito','bus','rom-may08-bus-turistico','Colectivo turístico · todo el día','2026-05-08','2026-05-08T09:00:00+02:00','2026-05-08T18:00:00+02:00','rom',0,'bus',1,'both',0,1),
 ('ev-rom-may08-vaticano-basilica','hito','visit','rom-may08-vaticano-basilica','Basílica de San Pedro','2026-05-08','2026-05-08T10:00:00+02:00','2026-05-08T11:00:00+02:00','rom',0,'monumento',1,'both',0,1),
 ('ev-rom-may08-vaticano-plaza','hito','visit','rom-may08-vaticano-plaza','Plaza de San Pedro','2026-05-08','2026-05-08T11:00:00+02:00','2026-05-08T11:30:00+02:00','rom',0,'monumento',1,'both',0,1),
 ('ev-rom-may08-colosseo','hito','visit','rom-may08-colosseo','Coliseo','2026-05-08','2026-05-08T16:00:00+02:00','2026-05-08T18:00:00+02:00','rom',0,'monumento',1,'both',0,1),
 ('ev-rom-may08-quattro-fontane','hito','walk','rom-may08-quattro-fontane','Esquina de las Cuatro Fuentes','2026-05-08','2026-05-08T18:30:00+02:00','2026-05-08T19:00:00+02:00','rom',0,'paseo',1,'both',0,1),
 ('ev-rom-may08-escalera-espanola','hito','walk','rom-may08-escalera-espanola','Escalera Española','2026-05-08','2026-05-08T19:00:00+02:00','2026-05-08T19:30:00+02:00','rom',0,'paseo',1,'both',0,1),
 ('ev-rom-may08-foro-ultima','hito','visit','rom-may08-foro-ultima','Foro Romano · a última hora','2026-05-08','2026-05-08T19:45:00+02:00','2026-05-08T20:30:00+02:00','rom',0,'monumento',1,'both',0,1),
 ('ev-rom-may08-scooter-vuelta','hito','scooter','rom-may08-scooter-vuelta','Vuelta en scooter','2026-05-08','2026-05-08T20:30:00+02:00','2026-05-08T21:00:00+02:00','rom',0,'scooter',1,'both',0,1);

-- 9) Remove mis-placed May-9 "noche Madrid" placeholders.
DELETE FROM events WHERE id IN (
 'ev-mad-may09-noche-regreso-t4','ev-mad-may09-noche-llegada','ev-mad-may09-noche-cena',
 'ev-mad-may09-noche-plaza-mayor','ev-mad-may09-noche-la-latina','ev-mad-may09-noche-gran-via');

-- 9) Fiumicino early, beach day-trip (Uber round trip) until late, then fly.
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-rom-may09-fco-temprano','hito','transfer','rom-may09-fco-temprano','Temprano al aeropuerto · Fiumicino','2026-05-09','2026-05-09T08:00:00+02:00','2026-05-09T09:00:00+02:00','rom',0,'transporte',1,'both',0,1),
 ('ev-rom-may09-playa-daytrip','hito','beach','rom-may09-playa-daytrip','Day trip a la playa · Uber ida y vuelta','2026-05-09','2026-05-09T09:30:00+02:00','2026-05-09T18:00:00+02:00','rom',0,'playa',1,'both',0,1),
 ('ev-rom-may09-playa-tarde','hito','beach','rom-may09-playa-tarde','Playa hasta muy tarde','2026-05-09','2026-05-09T18:00:00+02:00','2026-05-09T20:30:00+02:00','rom',0,'playa',1,'both',0,1);
-- Flight FCO→MAD departs late May 9, lands Madrid ~midnight.
UPDATE events SET timestamp_in='2026-05-09T21:30:00+02:00', timestamp_out='2026-05-10T00:00:00+02:00' WHERE id='ev-leg-fco-mad';

-- 10) Arrive Madrid ~00:00 → night in the centre until 6AM → 09:00 MAD→EZE.
UPDATE events SET date='2026-05-10', timestamp_in='2026-05-10T00:10:00+02:00', timestamp_out='2026-05-10T00:50:00+02:00' WHERE id='ev-leg-mad-t4-cibeles-night';
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-mad-may10-centro-noche','hito','walk','mad-may10-centro-noche','Centro de Madrid toda la noche','2026-05-10','2026-05-10T01:00:00+02:00','2026-05-10T05:15:00+02:00','mad',0,'paseo',1,'both',0,1),
 ('ev-mad-may10-fiveguys','hito','comida','mad-may10-fiveguys','Despedida · cena en Five Guys','2026-05-10','2026-05-10T03:30:00+02:00','2026-05-10T04:30:00+02:00','mad',0,'comida',1,'both',0,1);
UPDATE events SET timestamp_in='2026-05-10T08:30:00+02:00', timestamp_out='2026-05-10T09:00:00+02:00' WHERE id='ev-leg-mad-cibeles-t4-dawn';
UPDATE events SET timestamp_in='2026-05-10T09:00:00+02:00', timestamp_out='2026-05-10T16:40:00+02:00' WHERE id='ev-leg-mad-eze';
