-- 0111_scl_apr19_salida.sql
-- Apr 19 was missing the early morning departure from Santiago.
-- Single hito at 06:00 (the SCL→MAD flight at 13:55 already exists later).
INSERT INTO events (id,type,subtype,slug,title,date,timestamp_in,timestamp_out,city_in,usd,icon,confirmed,variant,mandatory,done) VALUES
 ('ev-scl-apr19-salida','hito','transfer','scl-apr19-salida','Salida desde Santiago · 06:00','2026-04-19','2026-04-19T06:00:00-04:00','2026-04-19T06:30:00-04:00','scl',0,'transporte',1,'both',0,1);
