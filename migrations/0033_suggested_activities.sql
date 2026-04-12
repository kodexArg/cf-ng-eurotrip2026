-- Migration 0033: Actividades sugeridas — días vacíos Madrid y Barcelona
-- Cubre: Madrid Apr 21 (Aniversario), Apr 22, Apr 23 · Barcelona Apr 24, Apr 25
-- confirmed: 0 (sugerencias, no reservas)

-- ─────────────────────────────────────────────────────
-- Apr 21 · Madrid · ANIVERSARIO — día romántico especial
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('mad-apr21-retiro', 'mad-day-apr21', 'morning',
   'Paseo romántico por El Retiro · alquiler de bote en el Estanque Grande · jardines de Cecilio Rodríguez · ritmo relajado, bancos y sombra',
   '€6–€8 bote · parque gratis', 0, 'leisure', 'Parque del Retiro'),

  ('mad-apr21-sanmiguel', 'mad-day-apr21', 'afternoon',
   'Mercado de San Miguel · tapas gourmet, jamón ibérico, vinos de Rioja · ir 16:00 para evitar multitudes · probar El Señor Martín (mariscos) y La Hora del Vermut',
   '€15–€25 p/p', 0, 'food', 'Plaza Mayor'),

  ('mad-apr21-aniversario-cena', 'mad-day-apr21', 'evening',
   'Cena de aniversario: Bodega de los Secretos · restaurante en bodega del siglo XVII, Barrio de Letras · alcobas de ladrillo, ambiente íntimo · reservar con anticipación',
   '€30–€50 p/p', 0, 'food', 'Barrio de las Letras'),

  ('mad-apr21-rooftop', 'mad-day-apr21', 'evening',
   'Atardecer en Azotea del Círculo · vistas 360° de Madrid · champagne para brindar el aniversario · llegar 18:30 para hora dorada',
   '€40–€60 p/p cena · €10–€15 copa', 0, 'leisure', 'Centro');

-- ─────────────────────────────────────────────────────
-- Apr 22 · Madrid · día de cultura
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('mad-apr22-prado', 'mad-day-apr22', 'morning',
   'Museo del Prado · Velázquez (Las Meninas), Goya, El Bosco (El jardín de las delicias) · 2–3 horas máximo · comprar entrada online · accesible con ascensor',
   '€13 · gratis 18–20h', 0, 'visit', 'Paseo del Prado'),

  ('mad-apr22-palacio', 'mad-day-apr22', 'afternoon',
   'Palacio Real de Madrid · 2400 salas, residencia oficial · gratis 17–19h lun-jue ciudadanos UE · comprar online si no aplica descuento',
   '€12–€13 · gratis 17–19h', 0, 'visit', 'Palacio Real'),

  ('mad-apr22-debod', 'mad-day-apr22', 'afternoon',
   'Templo de Debod al atardecer · templo egipcio auténtico con vistas a Casa de Campo · entrada gratuita · mejor luz 18:30–19:00 en abril',
   'gratis', 0, 'leisure', 'Moncloa'),

  ('mad-apr22-letras', 'mad-day-apr22', 'evening',
   'Tapas por Barrio de las Letras · ruta a pie por calles de Lope de Vega y Huertas · bares tradicionales, ambiente literario · 18–21°C perfecto para terraza',
   '€15–€30 p/p', 0, 'food', 'Barrio de las Letras');

-- ─────────────────────────────────────────────────────
-- Apr 23 · Madrid · último día completo — excursión a Toledo
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('mad-apr23-toledo-tren', 'mad-day-apr23', 'morning',
   'Tren a Toledo desde Atocha · 30 min, viaje pintoresco · trenes cada hora · comprar ida y vuelta online · ciudad medieval Patrimonio UNESCO',
   '~€14 ida y vuelta', 0, 'visit', 'Toledo'),

  ('mad-apr23-toledo-catedral', 'mad-day-apr23', 'morning',
   'Catedral Primada de Toledo · arte gótico, cuadros de El Greco · calles empedradas con tiendas de artesanía y mazapán · ritmo pausado con paradas en cafés',
   '~€13 catedral', 0, 'visit', 'Toledo · Casco Antiguo'),

  ('mad-apr23-toledo-almuerzo', 'mad-day-apr23', 'afternoon',
   'Almuerzo típico toledano · carcamusas (guiso local), perdiz estofada, mazapán artesanal · restaurantes en el casco antiguo con vistas al Tajo',
   '€15–€25 p/p', 0, 'food', 'Toledo'),

  ('mad-apr23-cena-despedida', 'mad-day-apr23', 'evening',
   'Cena ligera de despedida de Madrid · barrio del hotel o cerca de Atocha · descanso temprano antes del viaje a Barcelona',
   '€15–€20 p/p', 0, 'food', 'Lavapiés · Atocha');

-- ─────────────────────────────────────────────────────
-- Apr 24 · Barcelona · llegada en AVE por la tarde
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('bcn-apr24-gotico', 'bcn-day-apr24', 'afternoon',
   'Barrio Gótico · calles medievales, Catedral de Barcelona, El Call (barrio judío) · restos de Sant Jordi: flores y libros en los puestos tardíos',
   'gratis', 0, 'visit', 'Barri Gòtic'),

  ('bcn-apr24-boqueria', 'bcn-day-apr24', 'afternoon',
   'Mercat de la Boqueria · 300+ puestos de frutas, mariscos, zumos frescos · abierto hasta 20:30 · mejor ir después de las 16:00 para evitar multitudes',
   'gratis entrada · €5–€15 compras', 0, 'visit', 'La Rambla'),

  ('bcn-apr24-born-vermut', 'bcn-day-apr24', 'evening',
   'Vermut y tapas en El Born · ritual del vermut en Bormuth o El Xampanyet · barrio medieval con encanto, galerías y ambiente nocturno',
   '€15–€25 p/p', 0, 'food', 'El Born');

-- ─────────────────────────────────────────────────────
-- Apr 25 · Barcelona · día completo de exploración
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('bcn-apr25-guell', 'bcn-day-apr25', 'morning',
   'Park Güell · vistas panorámicas de Barcelona, mosaicos y arquitectura de Gaudí · reservar entrada con horario online · 2–3 horas mínimo · calzado cómodo',
   '€18 p/p entrada', 0, 'visit', 'Park Güell'),

  ('bcn-apr25-gracia', 'bcn-day-apr25', 'afternoon',
   'Barrio de Gràcia · plazas bohemias (Plaça del Sol, Virreina, Diamant), cafés artesanales · ambiente de pueblo dentro de la ciudad · Syra Coffee o vermut en La Vermuteria del Tano',
   '€5–€15 café/vermut', 0, 'leisure', 'Gràcia'),

  ('bcn-apr25-feria', 'bcn-day-apr25', 'evening',
   'Feria de Abril en Parc del Fòrum · feria andaluza con casetas, flamenco, paella, vino · ambiente festivo · funciona desde el 25 abr hasta mayo',
   'gratis entrada · €10–€20 comida', 0, 'event', 'Parc del Fòrum');
