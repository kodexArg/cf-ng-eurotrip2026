-- Ciudades del itinerario (type='city', coordenadas = mismas que cities table)
INSERT INTO map_pois (id, name, type, lat, lon, color, city_id) VALUES
  ('mad', 'Madrid',    'city', 40.4168,  -3.7038, '#e8a74e', 'mad'),
  ('bcn', 'Barcelona', 'city', 41.3874,   2.1686, '#e07b5a', 'bcn'),
  ('par', 'París',     'city', 48.8566,   2.3522, '#7e8cc4', 'par'),
  ('vce', 'Venecia',   'city', 45.4408,  12.3155, '#0d9488', 'vce'),
  ('rom', 'Roma',      'city', 41.9028,  12.4964, '#c27ba0', 'rom');

-- Excursiones y aeropuertos externos (type='excursion', sin city_id)
INSERT INTO map_pois (id, name, type, lat, lon, color) VALUES
  ('toledo',  'Toledo',        'excursion',  39.8628,  -4.0273, '#a16207'),
  ('naples',  'Nápoles',       'excursion',  40.8518,  14.2681, '#7f1d1d'),
  ('pompeii', 'Pompeya',       'excursion',  40.7506,  14.4893, '#7f1d1d'),
  ('scl',     'Santiago',      'excursion', -33.3933, -70.7870, '#475569'),
  ('eze',     'Buenos Aires',  'excursion', -34.8222, -58.5358, '#475569');
