-- 0035_london_cards_windsor_stonehenge_oxford.sql
-- Agregar cards de Windsor Castle, Stonehenge y Oxford para Londres
-- (excursión del día May 3 — tour Viator confirmado ref 1385295633)

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
(
  'lon-card-stonehenge',
  'lon',
  'info',
  'Stonehenge',
  'Patrimonio UNESCO en Salisbury Plain, ~2h al suroeste de Londres. Círculo megalítico de ~5.000 años de antigüedad, propósito aún debatido (observatorio solar, santuario funerario). Mejor vista: desde el sendero circular exterior, incluido en la entrada. La entrada da acceso al museo Visitor Centre con esqueletos y herramientas neolíticas originales. Recomendado llegar temprano — los tours organizados llegan en oleadas desde las 10h. Ropa de abrigo incluso en mayo: viento constante en la llanura. Incluido en el tour Viator (ref 1385295633) del May 3.',
  'https://www.english-heritage.org.uk/visit/places/stonehenge/',
  '2026-04-14 00:00:00'
),
(
  'lon-card-windsor',
  'lon',
  'info',
  'Windsor Castle',
  'Residencia real habitada más antigua del mundo (~1.000 años), ~40 min al oeste de Londres. Imprescindibles: St George''s Chapel (sepultura de 10 reyes, incluyendo Enrique VIII y Carlos III enterrará aquí), State Apartments (sala del trono, armería real), y el Cambio de Guardia (días alternos, 11h). El castillo sigue siendo residencia activa de la Familia Real — posibilidad de verlos si hay actividad oficial. Pueblo de Windsor a los pies del castillo: The Long Walk (3km recto hasta el castillo, vistas espectaculares). Incluido en el tour Viator del May 3.',
  'https://www.rct.uk/visit/windsor-castle',
  '2026-04-14 00:00:00'
),
(
  'lon-card-oxford',
  'lon',
  'info',
  'Oxford',
  'Ciudad universitaria medieval a ~1h al noroeste de Londres. Universidad más antigua del mundo angloparlante (s.XI). Highlights: Christ Church College (escenario real de Hogwarts en Harry Potter — Great Hall, claustros), Bodleian Library (una de las más antiguas del mundo, s.XV), Radcliffe Camera (cúpula icónica, s.XVIII), Covered Market (1774, artesanía y comida local). El centro es 100% caminable. La mayoría de los colleges cobran £3-8 de entrada individual; en tour organizado se hace walking tour exterior. Pub icónico: The Eagle and Child (Tolkien y C.S. Lewis eran asiduos). Incluido en el tour Viator del May 3.',
  'https://www.visitoxfordandoxfordshire.com',
  '2026-04-14 00:00:00'
);
