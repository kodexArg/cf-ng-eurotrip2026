-- 0101_fix_flight_date.sql
-- El vuelo SCL→MAD sale 19 abr CLT pero llega 20 abr CEST.
-- No existe el 19 abr en el viaje. Mover el vuelo al 20 abr.

UPDATE events SET date = '2026-04-20', timestamp_in = '2026-04-20T06:00:00+02:00', description = 'Vuelo SCL → MAD. Iberia, salida 06:40 CLT del 19 abr. Larga travesía sobre el Atlántico. Aterrizaje en Barajas a primera hora del 20 de abril. Sin incidentes.' WHERE id = 'ev-leg-scl-mad';
