-- 0003_sitios_toledo_bcn.sql
-- Nuevas entradas de sitios (places) para Toledo (excursión desde Madrid)
-- y daytrips desde Barcelona: Girona y Montserrat.
-- Nota: Bath (Londres) no se incluye porque Londres no existe en la base de datos.
--
-- Convenciones:
--   card id: {city_id}-card-{slug}
--   card_link id: link-{city_id}-{card-slug}-{n}
--   type 'info' para lugares con entrada/horarios concretos, 'note' para consejos/overview
--   created_at: 2026-04-12 00:00:00 (fecha de migración)

-- ─────────────────────────────────────────────────────
-- TOLEDO — card_links para la tarjeta overview existente
-- ─────────────────────────────────────────────────────

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-1', 'mad-card-toledo',
   'https://www.renfe.com/es/es/cercanias/cercanias-toledo',
   'Renfe Cercanías Toledo',
   'Trenes desde Madrid Atocha cada 30-60 min. El AVE tarda ~30 min, el regional ~1h20. Comprar ida y vuelta online con antelación para asegurar plaza y precio mejor.',
   1);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-2', 'mad-card-toledo',
   'https://www.toledo-turismo.com',
   'Toledo Turismo — web oficial',
   'Portal oficial de turismo de Toledo: mapas, rutas, horarios de monumentos y eventos. Útil para planear el recorrido del casco antiguo antes de salir desde Madrid.',
   2);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-3', 'mad-card-toledo',
   'https://en.wikipedia.org/wiki/Toledo,_Spain',
   'Toledo — Wikipedia',
   'Historia completa de la Ciudad de las Tres Culturas: cristiana, musulmana y judía. Contexto cultural imprescindible para entender el casco histórico Patrimonio UNESCO.',
   3);

-- ─────────────────────────────────────────────────────
-- TOLEDO — Catedral Primada
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('mad-card-toledo-catedral', 'mad', 'info',
   'Catedral Primada de Toledo',
   'Entrada ~€13 (incluye acceso al tesoro, sacristía y El Transparente). Horario: Lun-Sáb 10-18h, Dom 14-18h. Catedral gótica del s.XIII, una de las más importantes de España. Cuadros de El Greco en la sacristía. El Transparente: obra barroca única que crea un juego de luz natural en el presbiterio. Visita recomendada: 1,5-2 horas.',
   'https://www.catedralprimada.es',
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-catedral-1', 'mad-card-toledo-catedral',
   'https://www.catedralprimada.es',
   'Catedral Primada — web oficial',
   'Horarios y precios actualizados. La entrada incluye acceso a la sacristía con cuadros de El Greco, Goya y Van Dyck. Comprar en taquilla o en agencias de Toledo para evitar espera.',
   1);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-catedral-2', 'mad-card-toledo-catedral',
   'https://en.wikipedia.org/wiki/Toledo_Cathedral',
   'Catedral de Toledo — Wikipedia',
   'Historia arquitectónica detallada de la catedral gótica iniciada en 1226. Contexto sobre El Transparente (obra de Narciso Tomé, 1732) y las colecciones artísticas.',
   2);

-- ─────────────────────────────────────────────────────
-- TOLEDO — Alcázar de Toledo
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('mad-card-toledo-alcazar', 'mad', 'info',
   'Alcázar de Toledo (Museo del Ejército)',
   'Entrada €5 (gratis domingos). Horario: Mar-Dom 10-17h, cerrado lunes. Fortaleza medieval en el punto más alto de Toledo con vistas panorámicas sobre el río Tajo y el casco histórico. Alberga el Museo del Ejército con colecciones de armas, uniformes y maquetas históricas. El torreón ofrece las mejores vistas interiores de la ciudad.',
   'https://www.museo.ejercito.es',
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-alcazar-1', 'mad-card-toledo-alcazar',
   'https://www.museo.ejercito.es',
   'Museo del Ejército — web oficial',
   'Horarios, precios y colecciones permanentes del Museo del Ejército en el Alcázar. La entrada es gratuita los domingos. Incluye acceso a las terrazas con vistas a Toledo.',
   1);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-alcazar-2', 'mad-card-toledo-alcazar',
   'https://en.wikipedia.org/wiki/Alc%C3%A1zar_of_Toledo',
   'Alcázar de Toledo — Wikipedia',
   'Historia de la fortaleza desde época romana hasta su reconstrucción tras la Guerra Civil. Contexto sobre el asedio del Alcázar (1936) que marcó su historia reciente.',
   2);

-- ─────────────────────────────────────────────────────
-- TOLEDO — Mirador del Valle
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('mad-card-toledo-mirador', 'mad', 'note',
   'Mirador del Valle — panorámica sobre el Tajo',
   'Entrada gratuita. El mejor punto de vista exterior de Toledo: panorámica completa de la ciudad medieval sobre el meandro del río Tajo. Acceso en taxi desde el centro (~€6-8) o a pie ~45 min (cuesta empinada, no recomendable con calor). Mejor momento: al atardecer, cuando el sol ilumina la fachada norte de la catedral. Desde aquí se reproduce la vista del cuadro "Vista de Toledo" de El Greco.',
   NULL,
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-mirador-1', 'mad-card-toledo-mirador',
   'https://en.wikipedia.org/wiki/View_of_Toledo',
   'Vista de Toledo — El Greco (Wikipedia)',
   'El famoso cuadro de El Greco (c.1599-1600) reproduce exactamente esta perspectiva de la ciudad. Actualmente en el Metropolitan Museum of Art, Nueva York. Ver la pintura antes de la visita enriquece mucho la experiencia en el mirador.',
   1);

-- ─────────────────────────────────────────────────────
-- TOLEDO — Judería y Santa María la Blanca
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('mad-card-toledo-juderia', 'mad', 'info',
   'Judería y Santa María la Blanca',
   'Santa María la Blanca: entrada ~€3.50. Horario: 10-18h (octubre-febrero), 10-19h (marzo-septiembre). Antigua sinagoga del s.XII convertida en iglesia, única en el mundo por sus columnas de estilo almohade. El Tránsito (sinagoga): €3 (gratis sábados 14-20h y domingos). La Judería de Toledo es uno de los barrios judíos medievales mejor conservados de Europa — Ciudad de las Tres Culturas (cristiana, musulmana y judía). Callejuelas laberínticas, tiendas de artesanía y ambiente medieval auténtico.',
   NULL,
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-juderia-1', 'mad-card-toledo-juderia',
   'https://en.wikipedia.org/wiki/Santa_Mar%C3%ADa_la_Blanca',
   'Santa María la Blanca — Wikipedia',
   'Historia de la sinagoga más antigua de Europa todavía en pie (s.XII). Construida por arquitectos musulmanes para la comunidad judía de Toledo. Arquería de herradura, columnas y capiteles únicos. Convertida en iglesia en 1405.',
   1);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-juderia-2', 'mad-card-toledo-juderia',
   'https://en.wikipedia.org/wiki/El_Tr%C3%A1nsito_Synagogue',
   'Sinagoga del Tránsito — Wikipedia',
   'La otra sinagoga medieval de Toledo, del s.XIV. Hoy alberga el Museo Sefardí. Las inscripciones en hebreo de sus paredes son excepcionales. Entrada €3, gratuita sábados tarde y domingos.',
   2);

-- ─────────────────────────────────────────────────────
-- TOLEDO — San Juan de los Reyes
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('mad-card-toledo-sanjuan', 'mad', 'info',
   'Monasterio de San Juan de los Reyes',
   'Entrada ~€4. Horario: 10-18h (oct-feb), 10-18:45h (mar-sep). Monasterio franciscano mandado construir por los Reyes Católicos (s.XV) para celebrar la victoria en la Batalla de Toro. Estilo gótico isabelino — el más elaborado de España. El claustro de dos pisos es una obra maestra: arcos flamígeros, tracería de piedra y gárgolas. En la fachada exterior cuelgan cadenas de prisioneros cristianos liberados de Granada.',
   NULL,
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-sanjuan-1', 'mad-card-toledo-sanjuan',
   'https://en.wikipedia.org/wiki/Monastery_of_San_Juan_de_los_Reyes',
   'San Juan de los Reyes — Wikipedia',
   'Historia del monasterio fundado en 1477 por Fernando e Isabel. Contexto sobre el estilo isabelino (gótico tardío español) y el simbolismo de las cadenas en la fachada. El monasterio fue saqueado durante la ocupación napoleónica (1808).',
   1);

-- ─────────────────────────────────────────────────────
-- TOLEDO — Puentes del Tajo
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('mad-card-toledo-puentes', 'mad', 'note',
   'Puentes históricos sobre el Tajo',
   'Puente de San Martín (oeste): medieval del s.XIV, el más fotogénico. Puente de Alcántara (este): de origen romano, reconstruido en época árabe. Ambos ofrecen vistas sobre el Tajo y la muralla de Toledo. Cruzar uno e ida y vuelta por el otro permite un paseo circular de ~2km con vistas al Alcázar y a los molinos del río. Calzado cómodo imprescindible — el descenso hasta los puentes tiene escaleras y adoquines.',
   NULL,
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-puentes-1', 'mad-card-toledo-puentes',
   'https://en.wikipedia.org/wiki/Bridge_of_Alcantara,_Toledo',
   'Puente de Alcántara (Toledo) — Wikipedia',
   'Historia del puente romano-árabe sobre el Tajo. Construido en época romana, reconstruido varias veces. Ofrece las mejores vistas del Alcázar desde abajo. Accesible a pie bajando por la Bajada del Barco desde el casco histórico.',
   1);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-mad-toledo-puentes-2', 'mad-card-toledo-puentes',
   'https://en.wikipedia.org/wiki/San_Mart%C3%ADn_Bridge',
   'Puente de San Martín — Wikipedia',
   'Puente gótico del s.XIV en el extremo oeste de Toledo. Sus cinco arcos ojivales y las torres defensivas son icónicos en la silueta de la ciudad. Pasa por delante de San Juan de los Reyes — se puede combinar en el mismo recorrido.',
   2);

-- ─────────────────────────────────────────────────────
-- BARCELONA — Excursión a Girona
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('bcn-card-girona', 'bcn', 'info',
   'Excursión a Girona',
   'Tren de alta velocidad desde Barcelona Sants: ~38 min, ~€10-15 ida y vuelta. Frecuencia cada 30-60 min. Ciudad medieval excepcionalmente conservada. Catedral: nave gótica más ancha del mundo. Call Jueu (barrio judío medieval): uno de los mejor preservados de Europa. Murallas romanas transitables con vistas panorámicas. Casas de colores del Onyar reflejadas en el río — imagen icónica. Muy manejable en un día completo desde Barcelona.',
   NULL,
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-girona-1', 'bcn-card-girona',
   'https://www.girona.cat/turisme/eng/index.php',
   'Girona Turisme — web oficial',
   'Portal oficial de turismo de Girona con mapas, rutas temáticas, horarios de monumentos y calendario de eventos. Incluye la ruta por el Call Jueu y las murallas.',
   1);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-girona-2', 'bcn-card-girona',
   'https://en.wikipedia.org/wiki/Girona_Cathedral',
   'Catedral de Girona — Wikipedia',
   'La catedral tiene la nave gótica más ancha del mundo (23m). Construcción entre s.XI y s.XVIII. Alberga el Tapiz de la Creación (s.XI o XII), una de las mejores obras medievales de Europa. Entrada ~€7.',
   2);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-girona-3', 'bcn-card-girona',
   'https://en.wikipedia.org/wiki/Jewish_quarter_of_Girona',
   'Call Jueu de Girona — Wikipedia',
   'El barrio judío medieval de Girona fue uno de los más importantes de la Corona de Aragón. El Museo de Historia de los Judíos (entrada ~€4) explica la vida de la comunidad hasta su expulsión en 1492. Las callejuelas del Call son laberínticas y sorprendentes.',
   3);

-- ─────────────────────────────────────────────────────
-- BARCELONA — Excursión a Montserrat
-- ─────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url, created_at) VALUES
  ('bcn-card-montserrat', 'bcn', 'info',
   'Excursión a Montserrat',
   'Tren FGC desde Plaça Espanya + cable car o cremallera: ~1h total, ~€30-35 ida y vuelta (combinado tren + teleférico). Monasteri benedictino fundado en s.IX, en lo alto de formaciones rocosas únicas. La Moreneta (Virgen Negra de Montserrat): patrona de Cataluña, s.XII. Basílica acceso gratuito. Múltiples rutas de senderismo desde el monasterio. La Escolanía de Montserrat: coro de niños que actúa diariamente al mediodía (L''Hora Nona) — escucharles en la basílica es una experiencia única. Llevar ropa de abrigo — a 725m de altitud hace más frío.',
   'https://www.montserratvisita.com',
   '2026-04-12 00:00:00');

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-montserrat-1', 'bcn-card-montserrat',
   'https://www.montserratvisita.com',
   'Montserrat Visita — web oficial',
   'Comprar el pack combinado de tren FGC + teleférico (Aeri de Montserrat) o cremallera desde Plaça Espanya. Horarios actualizados, precios y acceso a la basílica. Reservar con antelación en fines de semana y festivos.',
   1);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-montserrat-2', 'bcn-card-montserrat',
   'https://www.escolania.cat/en',
   'Escolanía de Montserrat — web oficial',
   'El coro de niños de Montserrat es uno de los más antiguos de Europa (s.XIII). Actúa diariamente en la basílica: L''Hora Nona ~13:00h de lunes a viernes, misa de mediodía sábados y domingos. Consultar horarios antes de salir — ocasionalmente no actúan (vacaciones escolares).',
   2);

INSERT INTO card_links (id, card_id, url, label, tooltip, sort_order) VALUES
  ('link-bcn-montserrat-3', 'bcn-card-montserrat',
   'https://en.wikipedia.org/wiki/Montserrat_(mountain)',
   'Montserrat — Wikipedia',
   'Las formaciones rocosas de Montserrat son de conglomerado y tienen entre 50 y 1.236m de altura. El macizo incluye rutas de senderismo para todos los niveles desde el monasterio. La cresta más alta (Sant Jeroni, 1.236m) se puede alcanzar en ~2h.',
   3);
