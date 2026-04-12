-- Destinos candidatos: ciudades en reconsideración para el itinerario.
-- Se agregan como type='excursion' por ahora (sin city_id).
-- Si alguno se confirma como ciudad del viaje, se crea entrada en 'cities'
-- y se actualiza type y city_id aquí.
-- Nota: 'naples' y 'vce' ya existen en map_pois.

INSERT INTO map_pois (id, name, type, lat, lon, color) VALUES
  ('muc',     'Múnich',           'excursion',  48.1351,  11.5820, '#64748b'),
  ('pmm',     'Palma de Mallorca','excursion',  39.5696,   2.6502, '#64748b'),
  ('mxp',     'Milán',            'excursion',  45.4654,   9.1859, '#64748b');
