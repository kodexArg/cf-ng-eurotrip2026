-- Migration: 0035_card_links.sql
-- Tabla card_links: relación 1:N con cards para enlaces útiles por tarjeta
-- Cubre: Madrid, Barcelona, Palma de Mallorca, París, Roma

CREATE TABLE IF NOT EXISTS card_links (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  tooltip TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ── MADRID ──────────────────────────────────────────────────────────────────

-- mad-card-prado — Museo del Prado
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-prado-1', 'mad-card-prado',
   'https://www.museodelprado.es/en/visit-the-museum/online-ticket-purchase',
   'Comprar entradas online',
   'Comprar con anticipación evita colas de hasta 1 hora en temporada alta. La entrada gratuita (lun-sáb 18-20h, dom 17-19h) también requiere reservar horario online.',
   1),
  ('link-mad-prado-2', 'mad-card-prado',
   'https://maps.app.goo.gl/3Ld6RLQAXCJrHPFR7',
   'Cómo llegar — Google Maps',
   'Metro L2 (Banco de España) o L1 (Retiro). El museo tiene entrada por el Paseo del Prado (principal) y por la Puerta de Murillo (grupos). El aparcamiento más cercano está en el Paseo del Prado.',
   2),
  ('link-mad-prado-3', 'mad-card-prado',
   'https://www.museodelprado.es/en/the-collection/top-works',
   'Las obras imprescindibles',
   'Guía oficial del museo con las 14 obras que no se pueden perder: Las Meninas de Velázquez, El jardín de las delicias de El Bosco, y los Fusilamientos de Goya. Útil para planear la visita en 2-3 horas.',
   3);

-- mad-card-retiro — Parque del Retiro
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-retiro-1', 'mad-card-retiro',
   'https://maps.app.goo.gl/QgJfDtukPYpQR9Yw5',
   'Parque del Retiro — Google Maps',
   'El parque tiene 16 entradas. La principal está en la Plaza de la Independencia (M° Retiro, L9). Desde allí se llega al Estanque Grande en 5 minutos a pie. El Palacio de Cristal está a 10 minutos andando.',
   1),
  ('link-mad-retiro-2', 'mad-card-retiro',
   'https://www.esmadrid.com/en/tourist-information/el-retiro-park',
   'Guía oficial del Retiro',
   'Portal turístico oficial de Madrid con mapa del parque, horarios actualizados y eventos en curso. Incluye información sobre el Palacio de Cristal y el Palacio de Velázquez, que tienen exposiciones gratuitas.',
   2);

-- mad-card-palacio-real — Palacio Real
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-palacio-1', 'mad-card-palacio-real',
   'https://tickets.patrimonionacional.es',
   'Reservar entradas oficiales',
   'Única web oficial de venta. Permite elegir horario de entrada y evitar colas. El acceso gratuito (lun-jue 17-19h) también se gestiona desde aquí. Llevar el QR o PDF de la entrada.',
   1),
  ('link-mad-palacio-2', 'mad-card-palacio-real',
   'https://maps.app.goo.gl/XKcHDT7cQGVy5MUm6',
   'Cómo llegar — Google Maps',
   'Metro L2 (Ópera) o L5 (La Latina). A pie desde la Puerta del Sol: 15 minutos cruzando por la Calle Mayor. El acceso principal es por la Plaza de Armería; hay otro acceso por la Calle Bailén.',
   2),
  ('link-mad-palacio-3', 'mad-card-palacio-real',
   'https://www.patrimonionacional.es/visita/palacio-real-de-madrid',
   'Web oficial del Palacio Real',
   'Información completa sobre colecciones, horarios por temporada, y salas abiertas. Incluye planos de la planta y detalles de las salas más destacadas como el Salón del Trono y la Real Armería.',
   3);

-- mad-card-san-miguel — Mercado de San Miguel
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-sanmiguel-1', 'mad-card-san-miguel',
   'https://www.mercadodesanmiguel.es',
   'Web oficial del mercado',
   'Horarios actualizados, lista completa de puestos y eventos especiales. El mercado celebra catas de vino y otras actividades que se publican aquí con antelación.',
   1),
  ('link-mad-sanmiguel-2', 'mad-card-san-miguel',
   'https://maps.app.goo.gl/pRaT5gBrKvLZkd2t9',
   'Ubicación — Google Maps',
   'A 2 minutos a pie de la Plaza Mayor (salida por el Arco de Cuchilleros). Metro L2/L5 (Ópera) o L1/L2/L3 (Sol). Fácil combinarlo con una visita a la Plaza Mayor.',
   2);

-- mad-card-transporte — Transporte en Madrid
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-transporte-1', 'mad-card-transporte',
   'https://www.metromadrid.es/en/travel_in_metro/metro-maps',
   'Mapa del metro de Madrid',
   'Mapa oficial en PDF con todas las líneas y estaciones. Útil para planear rutas entre museos y barrios. Las líneas más usadas en el viaje son L1, L2, L5 y L9.',
   1),
  ('link-mad-transporte-2', 'mad-card-transporte',
   'https://www.crtm.es/en/',
   'Consorcio Regional de Transportes',
   'Web oficial del transporte público de Madrid. Permite calcular rutas en metro, bus y tren de cercanías. También tiene información sobre el bono de 10 viajes y tarifas actualizadas.',
   2);

-- ── BARCELONA ───────────────────────────────────────────────────────────────

-- bcn-card-guell — Park Güell
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-guell-1', 'bcn-card-guell',
   'https://parkguell.barcelona/en/plan-your-visit/tickets',
   'Reservar entrada Park Güell',
   'RESERVA OBLIGATORIA. Sin entrada previa no se puede acceder al área monumental (terrazas, sala hipóstila, escalinata del dragón). En temporada alta se agota con 2-3 semanas de antelación. Elegir horario: mañana temprano (9:30) tiene mejor luz para fotos.',
   1),
  ('link-bcn-guell-2', 'bcn-card-guell',
   'https://maps.app.goo.gl/7ZnAjJD7RpJfj5Qv9',
   'Cómo llegar — Google Maps',
   'Bus 24 desde Passeig de Gràcia (30 min). Metro L3 (Lesseps o Vallcarca) + 10-15 min a pie cuesta arriba. El acceso desde Carmel es más empinado pero menos transitado. El parque tiene zonas gratuitas alrededor del área monumental.',
   2),
  ('link-bcn-guell-3', 'bcn-card-guell',
   'https://www.tripadvisor.com/Attraction_Review-g187497-d190452-Reviews-Park_Guell-Barcelona_Catalonia.html',
   'Reseñas en TripAdvisor',
   'Más de 100.000 reseñas con fotos recientes y consejos prácticos de otros viajeros. Especialmente útil para ver qué horarios tienen menos aglomeración y cuánto tiempo dedicarle.',
   3);

-- bcn-card-gotico — Barrio Gótico
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-gotico-1', 'bcn-card-gotico',
   'https://maps.app.goo.gl/TJN9FRfmBWM6kQRU9',
   'Barrio Gótico — Google Maps',
   'El Barrio Gótico está delimitado por Las Ramblas, Via Laietana, el mar y Plaça de Catalunya. Metro L3 (Liceu) para la Catedral o L4 (Jaume I) para la parte más medieval. Muchas calles son peatonales.',
   1),
  ('link-bcn-gotico-2', 'bcn-card-gotico',
   'https://www.catedralbcn.org',
   'Catedral de Barcelona — web oficial',
   'Entrada al interior de la catedral: gratuita en horario de culto. Acceso turístico con donativo (€7) incluye subida a la azotea con vistas. El claustro con los 13 gansos blancos es uno de los rincones más singulares.',
   2);

-- bcn-card-boqueria — Mercat de la Boqueria
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-boqueria-1', 'bcn-card-boqueria',
   'https://www.boqueria.barcelona',
   'Web oficial de La Boqueria',
   'Lista de puestos, horarios actualizados y eventos. También permite ver qué producto de temporada está en su mejor momento durante la visita.',
   1),
  ('link-bcn-boqueria-2', 'bcn-card-boqueria',
   'https://maps.app.goo.gl/Q3D6cTZ2mhzpV4xNA',
   'Cómo llegar — Google Maps',
   'Entrada principal en Las Ramblas, a la altura del número 89. Metro L3 (Liceu), a 2 minutos a pie. Ir entre 8:00-10:00 para ver el mercado en su ambiente más auténtico, antes de la llegada de los grupos turísticos.',
   2);

-- bcn-card-montjuic — Montjuïc
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-montjuic-1', 'bcn-card-montjuic',
   'https://www.telefericdemontjuic.cat/en',
   'Teleférico de Montjuïc — reservas',
   'Billete ida y vuelta €13. Funciona de 10:00 a 19:00h (mayo). Sale desde la estación Parc Montjuïc (funicular) o desde la estación del Puerto (teleférico del Puerto, €13 adicional). Reservar online para evitar esperas.',
   1),
  ('link-bcn-montjuic-2', 'bcn-card-montjuic',
   'https://www.museunacional.cat/en',
   'MNAC — Museu Nacional d''Art de Catalunya',
   'Entradas online €12. Cada primer domingo de mes y los sábados después de las 15h la entrada es gratuita. La escalinata exterior y las vistas de Barcelona desde la terraza del museo son gratuitas siempre.',
   2),
  ('link-bcn-montjuic-3', 'bcn-card-montjuic',
   'https://maps.app.goo.gl/ZVkVaUqpK5mJFgBe6',
   'Castillo de Montjuïc — Google Maps',
   'Subida en bus 150 desde Plaça d''Espanya (€2.55, 20 min). El castillo tiene vistas a 360° del mar y la ciudad. Entrada €5, domingos después de las 15h entrada gratuita.',
   3);

-- bcn-card-barrios — Barrios para explorar
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-barrios-1', 'bcn-card-barrios',
   'https://maps.app.goo.gl/7e2jYM1ZGKcJaFRb8',
   'El Born — Google Maps',
   'El Born está centrado en el Passeig del Born. Metro L4 (Jaume I). El Mercat del Born (centro cultural, entrada gratuita) tiene restos arqueológicos medievales bajo el suelo de cristal.',
   1),
  ('link-bcn-barrios-2', 'bcn-card-barrios',
   'https://maps.app.goo.gl/Bp3SiHoG43Kky9mz6',
   'Gràcia — Google Maps',
   'Barrio bohemio a pie desde Park Güell (15 min cuesta abajo). Metro L3 (Fontana o Diagonal). Las plazas más animadas: Plaça del Sol, Plaça de la Vila de Gràcia y Plaça de la Virreina.',
   2);

-- bcn-card-paella — Dónde comer paella en Barcelona
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-paella-1', 'bcn-card-paella',
   'https://www.canmajo.es',
   'Can Majó — reservas',
   'Uno de los mejores restaurantes de arroz de Barcelona, frente a la Barceloneta. Paella y fideuà desde €22 por persona. Reservar con 5-7 días de anticipación en fin de semana. Pedir el arroz negro con alioli.',
   1),
  ('link-bcn-paella-2', 'bcn-card-paella',
   'https://www.tripadvisor.com/Restaurant_Review-g187497-d1010923-Reviews-Can_Sole-Barcelona_Catalonia.html',
   'Can Solé — TripAdvisor',
   'Más de 120 años sirviendo arroces en el barrio de la Barceloneta. Reseñas actualizadas con fotos de platos recientes. El arroz con bogavante es el plato estrella. Precio medio €35-50 por persona.',
   2);

-- ── PALMA DE MALLORCA ────────────────────────────────────────────────────────

-- pmi-card-catedral — Catedral de Palma (La Seu)
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-pmi-catedral-1', 'pmi-card-catedral',
   'https://palmacathedraltickets.com',
   'Reservar entradas La Seu',
   'Entradas online €9-10. Sin cola de compra con reserva previa. Los cruceros desembarcan mayoritariamente entre 9-13h — visitar fuera de ese horario para una experiencia más tranquila.',
   1),
  ('link-pmi-catedral-2', 'pmi-card-catedral',
   'https://maps.app.goo.gl/Nc1LhGLAoEkswz6D7',
   'Catedral de Palma — Google Maps',
   'Situada junto al Parc de la Mar, con vistas al puerto. A 15 minutos a pie desde la Plaza Mayor. Aparcar en el Parc de la Mar (€2/hora) o llegar en bus EMT (línea 1 o 3).',
   2),
  ('link-pmi-catedral-3', 'pmi-card-catedral',
   'https://catedraldemallorca.org',
   'Web oficial de la Catedral',
   'Información sobre horarios, visitas especiales, y la obra de Gaudí en el interior (el baldaquino y la vidriera de la roseta). La catedral fue parcialmente reformada por Gaudí a principios del siglo XX.',
   3);

-- pmi-card-bellver — Castillo de Bellver
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-pmi-bellver-1', 'pmi-card-bellver',
   'https://castelldebellver.palma.es',
   'Castillo de Bellver — web oficial',
   'Entrada €4, gratis domingos. Horarios actualizados y descripción del museo histórico del castillo. El castillo circular del s.XIV es único en España y tiene vistas 360° de la bahía de Palma.',
   1),
  ('link-pmi-bellver-2', 'pmi-card-bellver',
   'https://maps.app.goo.gl/GKBJw9kWe1EhGBVY7',
   'Cómo llegar — Google Maps',
   'Bus EMT línea 50 desde el centro de Palma (20 min). En taxi: €8-10 desde el centro. Hay un pequeño aparcamiento en la entrada. El acceso a pie desde Cala Major es posible (30 min) pero con cuesta.',
   2);

-- pmi-card-soller — Tren de Sóller
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-pmi-soller-1', 'pmi-card-soller',
   'https://trendesoller.com/en/buy-tickets',
   'Comprar billetes del Tren de Sóller',
   'RESERVAR ONLINE CON ANTELACIÓN. El tren tiene capacidad limitada y se agota con días de antelación en temporada alta. Ida y vuelta €30. El horario de salida más popular es el de las 10:40 desde Palma.',
   1),
  ('link-pmi-soller-2', 'pmi-card-soller',
   'https://maps.app.goo.gl/jJrYU6B9gQ5hspqH7',
   'Estación de Palma — Google Maps',
   'La estación del Tren de Sóller en Palma está en Plaça d''Espanya, junto a la estación de autobuses. Metro o bus hasta Plaça d''Espanya, luego 2 minutos a pie.',
   2),
  ('link-pmi-soller-3', 'pmi-card-soller',
   'https://www.tripadvisor.com/Attraction_Review-g187460-d190587-Reviews-Tren_de_Soller-Palma_de_Mallorca_Majorca_Balearic_Islands.html',
   'Tren de Sóller — TripAdvisor',
   'Reseñas recientes con fotos del recorrido y consejos sobre en qué lado del vagón sentarse para mejor vista (lado derecho saliendo de Palma). Más de 10.000 reseñas.',
   3);

-- pmi-card-valldemossa — Excursión a Valldemossa
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-pmi-valldemossa-1', 'pmi-card-valldemossa',
   'https://www.cartujadevaldemossa.com',
   'La Cartuja de Valldemossa — web oficial',
   'Entrada €12.50 incluye el concierto de piano con música de Chopin (~10:30h). Aquí vivió Chopin con George Sand en el invierno de 1838-39. Se pueden ver las celdas donde vivieron y el piano original.',
   1),
  ('link-pmi-valldemossa-2', 'pmi-card-valldemossa',
   'https://www.tib.org/en/web/tib/linies-horaris',
   'TIB — horarios bus Palma-Valldemossa',
   'Línea 203, salida desde Palma Intermodal. Consultar horarios actualizados aquí antes de salir. El último bus de regreso suele ser a las 20:00-21:00h. Billete €4-6 ida y vuelta.',
   2);

-- pmi-card-mercados — Mercados de Palma
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-pmi-mercados-1', 'pmi-card-mercados',
   'https://maps.app.goo.gl/FhNXTg47WMiJCXts8',
   'Mercat de l''Olivar — Google Maps',
   'El mercado más grande de Palma, en el corazón del casco antiguo. Ideal para desayunar tapas y mariscos. Abrir: lun-vie 7-14:30h, sáb 7-15h. Especialidades: quesos mallorquines, sobrasada y ensaimadas.',
   1),
  ('link-pmi-mercados-2', 'pmi-card-mercados',
   'https://maps.app.goo.gl/qzYvqbntGYrdYDRv5',
   'Mercat de Santa Catalina — Google Maps',
   'Mercado del barrio bohemio de Santa Catalina. Lun-sáb 7-17h. Más pequeño y local que el Olivar. Alrededor del mercado hay cafés y tiendas de producto local con ambiente de barrio.',
   2);

-- pmi-card-gastronomia — Gastronomía mallorquina
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-pmi-gastro-1', 'pmi-card-gastronomia',
   'https://www.tripadvisor.com/Restaurant_Review-g187460-d950126-Reviews-Ca_n_Joan_de_S_Aigo-Palma_de_Mallorca_Majorca_Balearic_Islands.html',
   'Ca''n Joan de S''Aigo — TripAdvisor',
   'La pastelería más antigua de Palma (desde 1700). Famosa por sus ensaimadas, chocolate caliente y helados artesanales. Colas habituales los fines de semana — llegar temprano o entre semana.',
   1),
  ('link-pmi-gastro-2', 'pmi-card-gastronomia',
   'https://www.tripadvisor.com/Restaurants-g187460-Palma_de_Mallorca_Majorca_Balearic_Islands.html',
   'Restaurantes en Palma — TripAdvisor',
   'Lista filtrable de restaurantes con fotos y reseñas recientes. Filtrar por "mariscos" o "cocina mallorquina" para encontrar los más auténticos. Reservar siempre con antelación en temporada alta.',
   2);

-- ── PARIS ────────────────────────────────────────────────────────────────────

-- par-card-eiffel — Torre Eiffel
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-par-eiffel-1', 'par-card-eiffel',
   'https://ticket.toureiffel.paris/en',
   'Reservar entradas Torre Eiffel',
   'RESERVAR CON 60+ DÍAS DE ANTELACIÓN. La demanda es enorme y todas las franjas se agotan. Elegir entre acceso a planta 1+2 (€14) o con acceso a la cima (€29-35). El ascensor para la cima requiere reserva separada.',
   1),
  ('link-par-eiffel-2', 'par-card-eiffel',
   'https://maps.app.goo.gl/3WRanFRQq6L1Bhzn8',
   'Torre Eiffel — Google Maps',
   'Metro L6 (Bir-Hakeim) o RER C (Champ de Mars). Trocadéro (M° L9) da la mejor vista frontal para fotos. El Champ de Mars (jardín frente a la torre) es gratuito y perfecto para ver el espectáculo de luces nocturno.',
   2),
  ('link-par-eiffel-3', 'par-card-eiffel',
   'https://www.toureiffel.paris/en/the-monument/history',
   'Historia y datos de la torre',
   'Web oficial con información sobre la construcción (1887-1889), datos técnicos y programación cultural actual. Incluye el calendario del espectáculo de luces (cada hora desde el anochecer hasta medianoche).',
   3);

-- par-card-orsay — Musée d''Orsay
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-par-orsay-1', 'par-card-orsay',
   'https://www.musee-orsay.fr/en/visit/practical-information/tickets',
   'Comprar entradas Musée d''Orsay',
   'Entrada €16, reservar online para evitar cola de hasta 45 minutos en temporada alta. Los jueves el museo abre hasta las 21:45h con menos afluencia. Gratuito para menores de 18 años y el primer domingo de cada mes.',
   1),
  ('link-par-orsay-2', 'par-card-orsay',
   'https://maps.app.goo.gl/U3RSmZ64JqJiqx6z9',
   'Cómo llegar — Google Maps',
   'RER C (Musée d''Orsay) o Metro L12 (Solférino). A 15 minutos a pie desde el Louvre cruzando el río. Combinación habitual: visitar el Orsay y caminar hasta Notre-Dame por la orilla izquierda.',
   2),
  ('link-par-orsay-3', 'par-card-orsay',
   'https://www.musee-orsay.fr/en/exhibitions',
   'Exposiciones temporales actuales',
   'Programación actualizada de exposiciones. Para 2026 se esperan varias exposiciones temáticas sobre impresionismo. Comprobar antes del viaje qué exposición está activa para no perdérsela.',
   3);

-- par-card-notre-dame — Notre-Dame
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-par-notredame-1', 'par-card-notre-dame',
   'https://www.notredamedeparis.fr/en/visit/practical-information',
   'Reservar visita Notre-Dame',
   'La entrada es gratuita pero requiere reserva de horario. Las plazas se agotan con días de antelación. La catedral fue reinaugurada en diciembre 2024 tras 5 años de restauración — visita muy recomendada.',
   1),
  ('link-par-notredame-2', 'par-card-notre-dame',
   'https://maps.app.goo.gl/DxBJPdmCgRCJPMN68',
   'Notre-Dame — Google Maps',
   'Metro L4 (Cité) o RER B/C/D (Saint-Michel - Notre-Dame). La Île de la Cité también tiene la Sainte-Chapelle (€13) a 5 minutos a pie, ideal para combinar en la misma visita.',
   2);

-- par-card-montmartre — Montmartre
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-par-montmartre-1', 'par-card-montmartre',
   'https://www.sacre-coeur-montmartre.com/english',
   'Sacré-Cœur — web oficial',
   'La basílica es de acceso gratuito. La cúpula (€6, 300 escalones) ofrece la mejor vista de París. Horario: 6:00-22:30h. El funicular sube desde M° Anvers (válido con billete de metro).',
   1),
  ('link-par-montmartre-2', 'par-card-montmartre',
   'https://maps.app.goo.gl/xFz8Jvma2UBsLa4u9',
   'Montmartre — Google Maps',
   'Metro L12 (Abbesses, con ascensor) es la parada más cómoda. La subida a pie desde M° Anvers tiene escaleras pero pasa por el funicular. La Place du Tertre (artistas en vivo) está a 3 minutos de la basílica.',
   2),
  ('link-par-montmartre-3', 'par-card-montmartre',
   'https://www.tripadvisor.com/Attraction_Review-g187147-d188540-Reviews-Montmartre-Paris_Ile_de_France.html',
   'Montmartre — TripAdvisor',
   'Consejos de otros viajeros sobre el mejor momento para visitar (mañanas entre semana), los cafés más pintorescos (La Maison Rose, Le Consulat) y cómo evitar las trampas para turistas de Place du Tertre.',
   3);

-- par-card-comida — Dónde comer en París
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-par-comida-1', 'par-card-comida',
   'https://www.bouillon-chartier.com/en/',
   'Bouillon Chartier — reservas',
   'El restaurante histórico de París desde 1896. Menú de 3 platos ~€20-25. No acepta reservas (cola en la puerta), llegar 15 minutos antes de la apertura (11:30h almuerzo, 18:00h cena). La espera suele ser de 20-30 minutos.',
   1),
  ('link-par-comida-2', 'par-card-comida',
   'https://www.tripadvisor.com/Restaurant_Review-g187147-d718557-Reviews-Du_Pain_et_Des_Idees-Paris_Ile_de_France.html',
   'Du Pain et Des Idées — TripAdvisor',
   'Considerada la mejor panadería de París. Abrir mar-vie 7:00-20:00h, cerrada lun y fin de semana. Los escargots de croissant y los pains aux raisins se agotan antes de las 10:00. Metro L3 (République) o L8 (République).',
   2);

-- par-card-museum-pass — Paris Museum Pass
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-par-museumpass-1', 'par-card-museum-pass',
   'https://en.parismuseumpass.com',
   'Comprar Paris Museum Pass',
   'Pase de 2 días €65, 4 días €80. Incluye más de 50 museos y monumentos: Louvre, Orsay, Arco del Triunfo, Sainte-Chapelle, Versalles. Importante: aun con el pase hay que reservar horario para el Louvre y Versalles.',
   1),
  ('link-par-museumpass-2', 'par-card-museum-pass',
   'https://www.louvre.fr/en/visit-the-louvre/practical-information/buy-your-ticket',
   'Louvre — reservar entrada / horario',
   'Entrada incluida con Museum Pass pero el horario debe reservarse por separado en la web del Louvre. Sin reserva de horario no se puede entrar aunque tengas el pase. Miércoles y viernes abre hasta las 21:45h.',
   2);

-- par-card-transporte — Transporte en París
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-par-transporte-1', 'par-card-transporte',
   'https://www.ratp.fr/en/titres-et-tarifs',
   'RATP — tarifas y títulos de transporte',
   'Web oficial de la red de transporte parisina. Tiene calculadora de rutas, precios actualizados y mapa de metro descargable. Desde 2021 se puede usar la tarjeta bancaria contactless directamente en torniquetes.',
   1),
  ('link-par-transporte-2', 'par-card-transporte',
   'https://maps.app.goo.gl/H6MvxFbDqaRfbkmW6',
   'Mapa del metro de París — Google Maps',
   'El metro de París tiene 16 líneas. Las más útiles para los sitios del viaje: L1 (Louvre, Champs-Élysées), L4 (Notre-Dame, Saint-Germain), L6 (Torre Eiffel), L9 (Trocadéro), L12 (Orsay, Montmartre).',
   2);

-- ── ROMA ─────────────────────────────────────────────────────────────────────

-- rom-card-coliseo — Coliseo + Foro + Palatino
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-rom-coliseo-1', 'rom-card-coliseo',
   'https://www.colosseo.it/en/tickets/',
   'Comprar entradas Coliseo',
   'RESERVAR CON 30+ DÍAS DE ANTELACIÓN. Entrada combinada €18 válida 24 horas (Coliseo + Foro Romano + Palatino). Sin reserva la espera puede ser de 3-4 horas. El acceso al Coliseo Arena (suelo de madera) cuesta €22 y también requiere reserva.',
   1),
  ('link-rom-coliseo-2', 'rom-card-coliseo',
   'https://maps.app.goo.gl/SX85F5CqPEiJLMsN9',
   'Coliseo — Google Maps',
   'Metro B (Colosseo). La entrada principal está en Via Sacra. El Foro Romano tiene acceso incluido con la misma entrada por Via Sacra o por Via dei Fori Imperiali. Llevar agua — hay largas esperas al sol en verano.',
   2),
  ('link-rom-coliseo-3', 'rom-card-coliseo',
   'https://www.tripadvisor.com/Attraction_Review-g187791-d190420-Reviews-Colosseum-Rome_Lazio.html',
   'Coliseo — TripAdvisor',
   'Más de 200.000 reseñas con consejos sobre la mejor hora para visitar (temprano a las 9:00 o al atardecer), qué incluye la entrada y cómo orientarse dentro del complejo arqueológico.',
   3);

-- rom-card-vaticano — Museos Vaticanos + Capilla Sixtina
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-rom-vaticano-1', 'rom-card-vaticano',
   'https://www.museivaticani.va/content/museivaticani/en/informazioni-e-contatti/biglietteria.html',
   'Reservar entradas Museos Vaticanos',
   'RESERVAR CON 60+ DÍAS DE ANTELACIÓN. Entrada €20, skip-the-line €27. Las entradas para las franjas de mañana son las primeras en agotarse. CÓDIGO DE VESTIMENTA OBLIGATORIO: hombros y rodillas cubiertos — guardan ropa en la entrada para quienes no cumplen.',
   1),
  ('link-rom-vaticano-2', 'rom-card-vaticano',
   'https://maps.app.goo.gl/J4JfFhqR2AqNaXEm7',
   'Museos Vaticanos — Google Maps',
   'Metro A (Ottaviano - San Pietro). La entrada a los Museos está en Viale Vaticano, NO en la Plaza de San Pedro. Desde la plaza hasta la entrada de los museos son 15 minutos a pie rodeando la muralla vaticana.',
   2),
  ('link-rom-vaticano-3', 'rom-card-vaticano',
   'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/cappella-sistina.html',
   'Capilla Sixtina — guía oficial',
   'La Capilla Sixtina está al final del recorrido de los museos. No se permite fotografía (aunque se hace de forma habitual). El fresco del techo de Miguel Ángel tardó 4 años en pintarse (1508-1512). Llevar prismáticos compactos para ver los detalles del techo.',
   3);

-- rom-card-san-pedro — Basílica de San Pedro
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-rom-sanpedro-1', 'rom-card-san-pedro',
   'https://www.basilicasanpietro.va/en/visite/visit-the-basilica.html',
   'Basílica de San Pedro — información oficial',
   'Entrada gratuita sin reserva. La cúpula se puede subir a pie (551 escalones, €8) o con ascensor parcial + escalones (€10). La Pietà de Miguel Ángel está en la primera capilla a la derecha al entrar. Mismo horario y código de vestimenta que los museos.',
   1),
  ('link-rom-sanpedro-2', 'rom-card-san-pedro',
   'https://maps.app.goo.gl/aJSk4DRSPFRDhkVj9',
   'Plaza de San Pedro — Google Maps',
   'Metro A (Ottaviano) + 15 min a pie o bus 40/64 desde el centro. La plaza es espectacular vista desde la cúpula. Las audiencias papales del miércoles a las 10:00 son gratuitas (requieren entrada gratuita solicitada con antelación al Vaticano).',
   2);

-- rom-card-panteon — Panteón
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-rom-panteon-1', 'rom-card-panteon',
   'https://www.pantheonroma.com/en/visit/',
   'Panteón — entradas y horarios',
   'Entrada €5. No requiere reserva previa. Horario: 9:00-19:00h todos los días. Los domingos a las 10:30h hay misa (acceso gratuito pero limitado). El edificio romano mejor conservado del mundo, con 1.900 años de historia.',
   1),
  ('link-rom-panteon-2', 'rom-card-panteon',
   'https://maps.app.goo.gl/SgW2kKKYXr4pjLXq7',
   'Panteón — Google Maps',
   'En la Piazza della Rotonda, a 5 minutos de Piazza Navona. Metro A (Spagna o Barberini) + 20 min a pie, o bus desde el centro. El mejor momento para ver el óculo iluminado es a mediodía (la luz cae verticalmente).',
   2);

-- rom-card-trastevere — Trastevere
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-rom-trastevere-1', 'rom-card-trastevere',
   'https://maps.app.goo.gl/7X9dJRJE2PFAvyeh8',
   'Trastevere — Google Maps',
   'Sin metro directo: bus 8 desde Largo Argentina (10 min) o a pie desde el Vaticano (30 min). El corazón del barrio es Piazza di Santa Maria in Trastevere. Para cenar sin reserva: Trattoria da Augusto (llegar 19-20h, colas cortas).',
   1),
  ('link-rom-trastevere-2', 'rom-card-trastevere',
   'https://www.tripadvisor.com/Restaurant_Review-g187791-d1064688-Reviews-Taverna_Trilussa-Rome_Lazio.html',
   'Taverna Trilussa — TripAdvisor',
   'Uno de los mejores restaurantes de cocina romana tradicional en Trastevere. Reservar con 3-5 días de antelación para cena. Especialidades: cacio e pepe, carbonara, coda alla vaccinara. Precio medio €30-40 por persona.',
   2);

-- rom-card-transporte — Transporte y consejos prácticos (Roma)
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-rom-transporte-1', 'rom-card-transporte',
   'https://www.atac.roma.it/en/',
   'ATAC — transporte público de Roma',
   'Web oficial con mapa de metro, rutas de bus y tarifas actualizadas. El billete individual cuesta €1.50 y es válido 100 minutos. El abono diario cuesta €7. Comprar en estancos (tabaccherie) o máquinas de metro para evitar el suplemento por compra a bordo.',
   1),
  ('link-rom-transporte-2', 'rom-card-transporte',
   'https://www.trenitalia.com/en/html/trenitalia/Leonardo_express.html',
   'Leonardo Express — tren FCO-Termini',
   'El tren más rápido y cómodo al aeropuerto Fiumicino: €14, 32 minutos directos desde Roma Termini. Sale cada 30 minutos. Comprar el billete online o en máquinas de la estación con antelación para no perder el tren.',
   2);

-- rom-card-nasoni — Fuentes nasoni
INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-rom-nasoni-1', 'rom-card-nasoni',
   'https://maps.app.goo.gl/search/nasoni+Roma',
   'Nasoni en Google Maps',
   'Buscar "nasoni" en Google Maps muestra las fuentes de agua potable más cercanas. También hay apps específicas como "Nasoni di Roma". El agua de las fuentes viene de acueductos de montaña y es segura para beber directamente.',
   1),
  ('link-rom-nasoni-2', 'rom-card-nasoni',
   'https://www.acea.it/en/customer-care/water/drinking-water',
   'ACEA — calidad del agua en Roma',
   'Información oficial sobre la calidad del agua potable en Roma, incluyendo las fuentes públicas. Confirma que el agua de las fuentes nasoni supera los estándares de calidad europeos. Llevar botella reutilizable y ahorrar en botellas de plástico.',
   2);
