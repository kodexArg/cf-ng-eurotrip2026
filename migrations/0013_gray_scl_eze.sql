-- 0013_gray_scl_eze.sql
-- Santiago de Chile y Buenos Aires pasan a gris neutro
-- (origen y destino del viaje — no son "ciudades del itinerario" per se).

UPDATE cities SET color = '#6b7280' WHERE id IN ('scl', 'eze');
