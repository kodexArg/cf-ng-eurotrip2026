-- Seed: placeholder photos for all 5 cities
-- r2_key: path within the R2 bucket (eurotrip2026-photos)
-- These are representative shots per day/place — actual files uploaded later

-- ── MADRID ──────────────────────────────────────────────────────────────────

INSERT INTO photos (id, city_id, r2_key, caption, date_taken, uploader_note) VALUES
  ('mad-photo-01', 'mad', 'madrid/gran-via-noche.jpg',
   'Gran Vía de noche — las luces de la ciudad al llegar',
   '2026-04-20', 'Primera noche. Cansados pero emocionados.'),

  ('mad-photo-02', 'mad', 'madrid/prado-velazquez.jpg',
   'Las Meninas de Velázquez — Museo del Prado',
   '2026-04-22', NULL),

  ('mad-photo-03', 'mad', 'madrid/retiro-estanque.jpg',
   'Estanque del Retiro con los botes de remos',
   '2026-04-22', 'Tarde en el parque después del Prado.'),

  ('mad-photo-04', 'mad', 'madrid/reina-sofia-guernica.jpg',
   'Frente al Guernica de Picasso — Museo Reina Sofía',
   '2026-04-22', 'No se permiten fotos del cuadro, pero sí de nosotros frente a él.'),

  ('mad-photo-05', 'mad', 'madrid/toledo-catedral.jpg',
   'Catedral Primada de Toledo desde el mirador del Valle',
   '2026-04-23', 'Excursión de día completo. La ciudad medieval te transporta.'),

  ('mad-photo-06', 'mad', 'madrid/toledo-puente-san-martin.jpg',
   'Puente de San Martín sobre el río Tajo, Toledo',
   '2026-04-23', NULL);

-- ── BARCELONA ───────────────────────────────────────────────────────────────

INSERT INTO photos (id, city_id, r2_key, caption, date_taken, uploader_note) VALUES
  ('bcn-photo-01', 'bcn', 'barcelona/park-guell-terraza.jpg',
   'Terraza del Park Güell con vista panorámica a Barcelona',
   '2026-04-25', 'Mosaicos increíbles. Llegar temprano para evitar las multitudes.'),

  ('bcn-photo-02', 'bcn', 'barcelona/gracia-calle.jpg',
   'Calles del barrio de Gràcia — calma después del Park Güell',
   '2026-04-25', NULL),

  ('bcn-photo-03', 'bcn', 'barcelona/casa-batllo-fachada.jpg',
   'Fachada de Casa Batlló en el Passeig de Gràcia',
   '2026-04-26', 'Diseño de Gaudí que parece vivo. Vista exterior sin pagar entrada.'),

  ('bcn-photo-04', 'bcn', 'barcelona/barceloneta-atardecer.jpg',
   'Atardecer desde la playa de la Barceloneta',
   '2026-04-26', NULL),

  ('bcn-photo-05', 'bcn', 'barcelona/sagrada-familia-interior.jpg',
   'Interior de la Sagrada Família — vitrales y columnas arbóreas',
   '2026-04-27', 'La luz de la tarde es mágica. Vale cada centavo.'),

  ('bcn-photo-06', 'bcn', 'barcelona/sagrada-familia-torre-nacimiento.jpg',
   'Vista desde la Torre del Nacimiento — Barcelona desde arriba',
   '2026-04-27', NULL),

  ('bcn-photo-07', 'bcn', 'barcelona/macba-plaza.jpg',
   'Plaza del MACBA — skaters frente al museo',
   '2026-04-28', NULL),

  ('bcn-photo-08', 'bcn', 'barcelona/montjuic-castillo.jpg',
   'Castillo de Montjuïc con vista al puerto de Barcelona',
   '2026-04-29', 'En scooter eléctrico. La bajada por Poble Sec fue lo mejor del día.');

-- ── PARIS ───────────────────────────────────────────────────────────────────

INSERT INTO photos (id, city_id, r2_key, caption, date_taken, uploader_note) VALUES
  ('par-photo-01', 'par', 'paris/torre-eiffel-trocadero.jpg',
   'Torre Eiffel desde el Trocadéro — el clásico',
   '2026-04-30', 'La foto obligada. Llegamos al atardecer y la luz era perfecta.'),

  ('par-photo-02', 'par', 'paris/sena-pont-alexandre.jpg',
   'Pont Alexandre III sobre el Sena al caer la noche',
   '2026-04-30', NULL),

  ('par-photo-03', 'par', 'paris/louvre-piramide.jpg',
   'Pirámide del Louvre — I.M. Pei, 1989',
   '2026-04-30', 'No alcanzamos a entrar pero la pirámide de noche está buenísima.'),

  ('par-photo-04', 'par', 'paris/marais-rue-des-rosiers.jpg',
   'Rue des Rosiers en el Marais — el barrio judío de París',
   '2026-04-30', 'Cena aquí: falafel de L''As du Fallafel. Recomendado.');

-- ── VENECIA ─────────────────────────────────────────────────────────────────

INSERT INTO photos (id, city_id, r2_key, caption, date_taken, uploader_note) VALUES
  ('vce-photo-01', 'vce', 'venecia/gran-canal-amanecer.jpg',
   'Gran Canal al amanecer desde el Ponte dell''Accademia',
   '2026-05-02', 'Sin turistas a las 6:30am. Venecia es otra ciudad de madrugada.'),

  ('vce-photo-02', 'vce', 'venecia/san-marco-basilica.jpg',
   'Basílica de San Marco — mosaicos dorados del siglo IX',
   '2026-05-02', NULL),

  ('vce-photo-03', 'vce', 'venecia/rialto-canal.jpg',
   'Puente de Rialto con el Gran Canal debajo',
   '2026-05-02', 'Foto al mediodía — luz fuerte pero el reflejo en el agua quedó bien.'),

  ('vce-photo-04', 'vce', 'venecia/burano-casas-colores.jpg',
   'Casas de colores en Burano — cada fachada un color diferente',
   '2026-05-03', 'El más fotogénico del viaje. Pasamos 2h sin darnos cuenta.'),

  ('vce-photo-05', 'vce', 'venecia/murano-vidrio-soplado.jpg',
   'Artesano soplando vidrio en Murano — demostración en vivo',
   '2026-05-03', 'Gratis verlo. Compramos un par de piezas pequeñas para llevar.');

-- ── ROMA ────────────────────────────────────────────────────────────────────

INSERT INTO photos (id, city_id, r2_key, caption, date_taken, uploader_note) VALUES
  ('rom-photo-01', 'rom', 'roma/fontana-di-trevi.jpg',
   'Fontana di Trevi — la moneda va',
   '2026-05-04', 'Llegamos de tarde, menos gente. Tiramos la moneda para volver.'),

  ('rom-photo-02', 'rom', 'roma/pantheon-interior.jpg',
   'Cúpula del Panteón de Agripa — el óculo y la lluvia',
   '2026-05-04', 'Llovió un poco. Vimos llover a través del óculo. Increíble.'),

  ('rom-photo-03', 'rom', 'roma/coliseo-arena.jpg',
   'Vista del Coliseo desde la arena — los subterráneos expuestos',
   '2026-05-05', 'Entrada de mañana temprana. Casi solos los primeros 20 minutos.'),

  ('rom-photo-04', 'rom', 'roma/foro-romano-via-sacra.jpg',
   'Vía Sacra en el Foro Romano — Roma antigua a cielo abierto',
   '2026-05-05', NULL),

  ('rom-photo-05', 'rom', 'roma/vaticano-capilla-sixtina.jpg',
   'Capilla Sixtina — el Juicio Final de Miguel Ángel',
   '2026-05-06', 'No se puede fotografiar el techo pero sí las paredes. La magnitud es imposible de capturar.'),

  ('rom-photo-06', 'rom', 'roma/san-pedro-cupula-vista.jpg',
   'Vista desde la cúpula de San Pedro — Roma a vista de pájaro',
   '2026-05-06', '551 escalones. Valió cada uno.'),

  ('rom-photo-07', 'rom', 'roma/pompeya-foro.jpg',
   'Foro de Pompeya con el Vesubio al fondo',
   '2026-05-07', 'El volcán todavía activo detrás de una ciudad de 2000 años. Te para el tiempo.'),

  ('rom-photo-08', 'rom', 'roma/trastevere-noche.jpg',
   'Trastevere de noche — la despedida',
   '2026-05-08', 'Última cena. Cacio e pepe y vino tinto. Viaje terminado. Ya quiero volver.');
