-- migrations/0086_pulsera_toledo_address_waypoint.sql
-- Agrega dirección exacta en notes y waypoint a hito de pulsera Toledo Monumental.
-- Fuente: toledomonumental.com/contacto/

UPDATE events
SET
  notes     = 'Calle Arco de Palacio, 3 · 45002 Toledo (junto a la Catedral). Tel: 925 951 200 · 9:00–19:00. Incluye: Santo Tomé, Sinagoga Blanca, San Juan de los Reyes, Cristo de la Luz, Iglesia del Salvador, San Ildefonso (Jesuitas), Colegio Doncellas. Validez 7 días.',
  waypoints = '[[39.8572918,-4.0244966]]',
  lat       = 39.8572918,
  lon       = -4.0244966
WHERE id = 'ev-tol-apr22-pulsera';
