-- Migration: 0034_sitios_city_cards.sql
-- Tarjetas informativas para las páginas de ciudades en /sitios
-- Cubre: Madrid, Barcelona, Palma de Mallorca, París, Florencia, Roma
-- Tipos: info (referencia estructurada), link (reservas), note (consejos)

-- ── MADRID ──────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('mad-card-prado', 'mad', 'info',
   'Museo del Prado',
   'Horario: Lun-Sáb 10-20h, Dom 10-19h. Entrada €13 adultos. Gratis lun-sáb 18-20h y dom 17-19h. Comprar online para evitar colas. Obras imprescindibles: Velázquez, Goya, El Bosco. Visita recomendada: 2-3 horas.',
   'https://www.museodelprado.es'),

  ('mad-card-retiro', 'mad', 'info',
   'Parque del Retiro',
   'Entrada gratuita. Abr-Sep: 6-24h. Alquiler de botes en el estanque grande: €6-8. Palacio de Cristal: acceso gratuito. Ideal para un paseo relajado entre visitas.',
   NULL),

  ('mad-card-palacio-real', 'mad', 'info',
   'Palacio Real',
   'Entrada €12-13. Gratis lun-jue 17-19h (abr-sep, ciudadanos UE). 2.400 salas, una de las residencias reales más grandes de Europa. Comprar tickets online con anticipación.',
   'https://tickets.patrimonionacional.es'),

  ('mad-card-san-miguel', 'mad', 'info',
   'Mercado de San Miguel',
   'Horario: Dom-Jue 10-24h, Vie-Sáb 10-01h. Entrada gratuita. Tapas y degustación gourmet: €15-25 por persona. Muy concurrido entre 13-15h y 18-22h — evitar esos horarios si se puede.',
   NULL),

  ('mad-card-toledo', 'mad', 'note',
   'Excursión a Toledo',
   'Tren AVE desde Atocha: ~30 min, aprox €14 ida y vuelta. Ciudad medieval declarada Patrimonio UNESCO. Catedral de Toledo: ~€13. Llevar calzado muy cómodo — las calles son empedradas y hay muchas cuestas. Dedicar mínimo 5-6 horas.',
   NULL),

  ('mad-card-restaurantes', 'mad', 'note',
   'Restaurantes recomendados',
   'Romántico/aniversario: Bodega de los Secretos (bodega del s.XVII, €30-50 p/p, reservar con anticipación). Rooftop con vistas: Azotea del Círculo de Bellas Artes (vistas 360°, €40-60 p/p). Casual: tapas en Barrio de las Letras. Picoteo gourmet: Mercado de San Miguel.',
   NULL),

  ('mad-card-transporte', 'mad', 'note',
   'Transporte en Madrid',
   'Metro: 6:00-01:30h. Billete sencillo €2.60, bono 10 viajes €12.20. Mayores de 65 años: gratis con justificante de edad. Líneas útiles: L1 (Sol ↔ Retiro), L2 (Banco de España ↔ Museo del Prado).',
   NULL),

  ('mad-card-clima', 'mad', 'note',
   'Clima abril en Madrid',
   '18-21°C durante el día, 8-10°C por la noche. Lluvia moderada posible. 7-8 horas de sol diarias. Atardecer alrededor de las 20:30h. Llevar chaqueta ligera y calzado cómodo para caminar.',
   NULL);

-- ── BARCELONA ───────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('bcn-card-guell', 'bcn', 'info',
   'Park Güell',
   'Entrada €18. Acceso con horario asignado — reservar online con antelación. Horario: 9:30-19:30h. Visita mínima recomendada: 2-3 horas. Diseño de Gaudí con terrazas y vistas panorámicas de la ciudad.',
   'https://parkguell.barcelona'),

  ('bcn-card-gotico', 'bcn', 'note',
   'Barrio Gótico',
   'Visita gratuita. Calles medievales laberínticas. Catedral de Barcelona (entrada gratuita). El Call, el antiguo barrio judío de la ciudad. Mejor visitarlo temprano en la mañana cuando hay menos gente. Precaución con carteristas en zonas turísticas.',
   NULL),

  ('bcn-card-boqueria', 'bcn', 'info',
   'Mercat de la Boqueria',
   'Horario: Lun-Sáb 8:00-20:30h, cerrado domingos. Más de 300 puestos de productos frescos. Ir antes de las 10h para evitar la avalancha de turistas. Zumos frescos, mariscos, frutas locales. No salir sin probar algo.',
   'https://www.boqueria.barcelona'),

  ('bcn-card-montjuic', 'bcn', 'info',
   'Montjuïc',
   'Castillo de Montjuïc: €5. MNAC (Museo Nacional de Arte de Cataluña): €12. Fundació Joan Miró: €12. Subir en Bus 150 desde Plaça d\'Espanya o en teleférico. Vistas panorámicas de Barcelona y el puerto. Dedicar 3-4 horas para una visita rápida.',
   NULL),

  ('bcn-card-paella', 'bcn', 'note',
   'Dónde comer paella en Barcelona',
   'Can Majó (estilo familiar, ambiente de pescador, socarrat perfecto). Can Solé (más de 120 años de historia, arroz con bogavante). Xiringuito Escribà (en la playa de Bogatell, ambiente relajado). Todos requieren reserva con anticipación — especialmente en fin de semana.',
   NULL),

  ('bcn-card-barrios', 'bcn', 'note',
   'Barrios para explorar',
   'El Born: barrio medieval con museos, tapas y ambiente nocturno (Bormuth, Xampanyet). Gràcia: bohemio y relajado, plazas animadas y cafés con encanto. Barceloneta: paseo marítimo, playa y mariscos frescos. Barrio Gótico: historia medieval y catedrales.',
   NULL),

  ('bcn-card-eventos', 'bcn', 'note',
   'Eventos abril 2026 en Barcelona',
   'Sant Jordi (23 abr, con posible extensión 24-25): libros y rosas en Passeig de Gràcia — fiesta cultural única. Feria de Abril (desde 25 abr): Parc del Fòrum, casetas andaluzas, flamenco y ambiente festivo. Jazz Day (26 abr): conciertos gratuitos en distintos puntos.',
   NULL),

  ('bcn-card-seguridad', 'bcn', 'note',
   'Seguridad y consejos prácticos',
   'Zonas de mayor riesgo de carteristas: La Rambla, estaciones de tren, metro en hora punta, playas. Usar bolso cruzado, evitar bolsillos traseros. Para el metro usar T-Casual: €13 por 10 viajes Zona 1 (no transferible entre personas).',
   NULL);

-- ── PALMA DE MALLORCA ────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('pmi-card-catedral', 'pmi', 'info',
   'Catedral de Palma (La Seu)',
   'Entrada €9-10. Horario hasta las 17h en la mayoría de los meses. Catedral gótica de más de 900 años con impresionantes vistas a la bahía de Palma. Evitar coincidencia con llegada de cruceros (suelen ser por la mañana).',
   'https://palmacathedraltickets.com'),

  ('pmi-card-bellver', 'pmi', 'info',
   'Castillo de Bellver',
   'Entrada €4 (€2 pensionistas, gratuito domingos). Horario: Mar-Sáb 8:30-20h. Castillo circular gótico del s.XIV, único en su tipo en España. Vistas 360° de Palma y la bahía. Planta baja accesible para movilidad reducida.',
   'https://castelldebellver.palma.es'),

  ('pmi-card-soller', 'pmi', 'info',
   'Tren de Sóller',
   'Ida €23, ida y vuelta €30. Tren histórico de 1912 que atraviesa 1 hora de montañas, túneles y paisajes únicos de Mallorca. Reservar online con al menos 7 días de antelación (se agota rápido). Tranvía desde Sóller hasta el Port de Sóller: €3-4 adicionales.',
   'https://trendesoller.com'),

  ('pmi-card-valldemossa', 'pmi', 'note',
   'Excursión a Valldemossa',
   'Bus TIB línea 203, 35-45 min, €4-6 ida y vuelta. La Cartuja de Valldemossa: €12.50 (incluye concierto de música de Chopin ~10:30h). Pueblo pintoresco con calles empedradas y flores en las ventanas. 3-5°C más frío que en la costa — llevar chaqueta.',
   NULL),

  ('pmi-card-mercados', 'pmi', 'note',
   'Mercados de Palma',
   'Mercat de l\'Olivar: Lun-Vie 7-14:30h, Sáb hasta 15h. Ideal para desayunar tapas, ostras y cava. Santa Catalina: Lun-Sáb 7-17h. Productos frescos locales, ambiente artístico y bohemio. Ambos en el centro de Palma.',
   NULL),

  ('pmi-card-playas', 'pmi', 'note',
   'Playas recomendadas',
   'Illetas: arena fina, aguas calmas y servicios completos (hamacas, duchas). Es Carnatge: cala de aguas turquesas más tranquila. Formentor: al norte de la isla, 1-2h en coche, espectacular pero requiere planificación. Temperatura del agua ~17°C (fresca para nadar, agradable para caminar por la orilla).',
   NULL),

  ('pmi-card-gastronomia', 'pmi', 'note',
   'Gastronomía mallorquina',
   'Ensaimada: espiral de masa hojaldrada con azúcar (mejor en Ca\'n Joan de S\'Aigo, la pastelería más antigua de la isla). Sobrasada: embutido de cerdo con pimentón. Pa amb oli: pan con tomate y aceite de oliva. Tumbet: berenjenas y patatas al horno. Frito mallorquín. Para mariscos: MARiLUZ y Sa Roqueta.',
   NULL),

  ('pmi-card-clima', 'pmi', 'note',
   'Clima fin de abril / mayo en Mallorca',
   '19-22°C durante el día, 11-14°C por la noche. Mar a ~17°C. Mayormente soleado con alguna nube. Índice UV alto — usar protector solar SPF50+. Ideal para caminar y turismo sin el calor del verano.',
   NULL);

-- ── PARIS ────────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('par-card-eiffel', 'par', 'info',
   'Torre Eiffel',
   'Entrada €14-35 según nivel (planta 1, 2 o cima). Horario: 9:00-00:45h. RESERVAR OBLIGATORIO con al menos 60 días de anticipación — se agotan todas las franjas horarias. Ascensor disponible para todos los niveles. Vista nocturna altamente recomendada.',
   'https://ticket.toureiffel.paris'),

  ('par-card-orsay', 'par', 'info',
   'Musée d\'Orsay',
   'Entrada €16. Horario: Mar-Dom 9:30-18h (jueves hasta las 21:45h), cerrado los lunes. Exposición actual: "Renoir and Love" (mar-jul 2026) — ideal para parejas. Colección impresionista más importante del mundo.',
   'https://www.musee-orsay.fr'),

  ('par-card-notre-dame', 'par', 'info',
   'Notre-Dame de París',
   'REABIERTA en diciembre de 2024 tras el incendio de 2019. Entrada gratuita con reserva de horario obligatoria. Torres accesibles desde septiembre de 2025. Restauración completamente terminada. Una de las catedrales góticas más importantes del mundo.',
   'https://www.notredamedeparis.fr'),

  ('par-card-montmartre', 'par', 'note',
   'Montmartre',
   'Sacré-Cœur: entrada gratuita (cúpula €6, 300 escalones). Place du Tertre: artistas pintando en vivo. Funicular disponible para subir la colina (cuesta arriba es empinada). PRECAUCIÓN: muchas cuestas y escaleras — evaluar movilidad del grupo. Metro L12 parada Abbesses (hay ascensor).',
   NULL),

  ('par-card-cruceros', 'par', 'note',
   'Cruceros por el Sena',
   'Vedettes du Pont Neuf: €15/hora, opción más económica. Bateaux Parisiens: €17/hora, más conocido. Ducasse sur Seine: €110+ por persona, experiencia gourmet con estrella Michelin. Reservar con 3-5 días de anticipación. El crucero al atardecer es especialmente recomendado.',
   NULL),

  ('par-card-comida', 'par', 'note',
   'Dónde comer en París',
   'Bouillon Chartier (desde 1896): menú de 3 platos ~€20-25, bullicioso y auténtico. Chez Fernand (Saint-Germain): ambiente romántico y cocina tradicional francesa. Du Pain et Des Idées: los mejores croissants de París (llegar temprano, se agotan). Stohrer: pastelería más antigua de París, desde 1730.',
   NULL),

  ('par-card-museum-pass', 'par', 'note',
   'Paris Museum Pass 2 días',
   'Precio: ~€65 por persona. Incluye acceso a Louvre, Orsay, Arco del Triunfo y más de 50 museos. Vale la pena si planean visitar 4 o más museos. Importante: requiere igualmente reserva horaria para el Louvre y Versalles. Ahorra tiempo en colas de compra de entradas.',
   NULL),

  ('par-card-transporte', 'par', 'note',
   'Transporte en París',
   'Billete individual: €2.55. Carnet de 10 viajes: €17.05. Abono 1 día (t+): €12.30 (rentable a partir de 5+ viajes diarios). Los tickets de papel están en extinción — usar tarjeta bancaria contactless directamente o la app Île-de-France Mobilités.',
   NULL);

-- ── FLORENCIA ────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('fir-card-duomo', 'fir', 'info',
   'Duomo — Santa Maria del Fiore',
   'Catedral: entrada gratuita. Cúpula de Brunelleschi: incluida en el pase combinado €30 (463 escalones sin ascensor, vista espectacular desde arriba). Mejor al atardecer para aprovechar la luz. Reservar horario con anticipación.',
   'https://duomo.firenze.it'),

  ('fir-card-ponte-vecchio', 'fir', 'note',
   'Ponte Vecchio',
   'Acceso gratuito. El puente más icónico de Florencia, repleto de joyerías y orfebres desde el s.XVI. Las mejores vistas al puente se consiguen desde las orillas del Arno (especialmente la orilla sur). Ideal al atardecer. Dedicar 20-30 minutos.',
   NULL),

  ('fir-card-piazzale', 'fir', 'note',
   'Piazzale Michelangelo',
   'Acceso gratuito. El mirador con la mejor panorámica de Florencia — el Duomo, el Arno y los tejados de la ciudad. Subida a pie: 30-40 minutos desde el centro (algo empinada). Amanecer (~5:50h) o atardecer son los momentos ideales. Llevar agua.',
   NULL),

  ('fir-card-gastronomia', 'fir', 'note',
   'Gastronomía florentina',
   'Bistecca alla Fiorentina: chuletón de Chianina a la brasa, el plato estrella de la ciudad. Lampredotto: sándwich de callos en salsa verde, comida callejera auténtica. Gelato: Gelateria dei Neri y Vivoli (los mejores). Cantuccini con Vin Santo: galletas de almendra para mojar en vino dulce. Ribollita: guiso de verduras y pan toscano.',
   NULL),

  ('fir-card-consejos', 'fir', 'note',
   'Consejos para 18 horas en Florencia',
   'El centro histórico es compacto y todo se puede hacer a pie. Las calles son empedradas — calzado muy cómodo imprescindible. Fuentes de agua potable gratuitas repartidas por la ciudad. Museos cierran entre las 17-18h. Posibles eventos del Maggio Musicale Fiorentino (festival de ópera y música) — consultar cartelera.',
   NULL);

-- ── ROMA ─────────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('rom-card-coliseo', 'rom', 'info',
   'Coliseo + Foro Romano + Palatino',
   'Entrada combinada: €18, válida 24 horas. RESERVAR OBLIGATORIO con al menos 30 días de anticipación. Horario: 8:30h hasta 1 hora antes del atardecer. Llevar documento de identidad — se verifica en la entrada. Sin reserva previa, la espera puede ser de 3-4 horas.',
   'https://colosseo.it'),

  ('rom-card-vaticano', 'rom', 'info',
   'Museos Vaticanos + Capilla Sixtina',
   'Entrada: €20-25 (recomendado skip-the-line). Horario: Lun-Sáb 8:00-20h, cerrado domingos (excepto último domingo del mes, gratis pero con cola enorme). Reservar con 60 días de anticipación como mínimo. CÓDIGO DE VESTIMENTA OBLIGATORIO: hombros y rodillas cubiertos — no se puede entrar con pantalón corto o camiseta sin mangas.',
   'https://www.museivaticani.va'),

  ('rom-card-san-pedro', 'rom', 'info',
   'Basílica de San Pedro',
   'Entrada GRATUITA. Horario: 7:00-19:00h diario. Cúpula: €10 subiendo a pie (551 escalones) o €8 con ascensor parcial. Mismo código de vestimenta que los Museos Vaticanos. La Piedad de Miguel Ángel está detrás de un cristal protector. Sin reserva necesaria.',
   NULL),

  ('rom-card-panteon', 'rom', 'info',
   'Panteón',
   'Entrada: €5 (tarifa vigente hasta junio 2026). Horario: 9:00-19:00h todos los días. No requiere reserva previa. El edificio romano mejor conservado del mundo, con más de 1.900 años de antigüedad. El óculo del techo (9m de diámetro) permanece abierto al cielo. Visita: 30-45 minutos.',
   NULL),

  ('rom-card-trastevere', 'rom', 'note',
   'Trastevere',
   'Barrio bohemio con calles empedradas cubiertas de hiedra. Piazza di Santa Maria in Trastevere: corazón del barrio. Mejor visitarlo al atardecer cuando cobra vida. Para cenar: Trattoria da Augusto (sin reserva, llegar entre 19-20h, cocina romana de toda la vida), Taverna Trilussa (reservar con anticipación). Pedir cacio e pepe o carbonara auténticos.',
   NULL),

  ('rom-card-pasta-romana', 'rom', 'note',
   'Las 4 pastas romanas',
   'Cacio e Pepe: pecorino romano y pimienta negra, cremosa y potente. Carbonara: guanciale (carrillera curada), huevo, pecorino — sin nata, nunca. Amatriciana: guanciale, tomate y pecorino. Gricia: guanciale y pecorino sin huevo (la madre de todas). Probarlas en Trastevere o Monti. Evitar restaurantes turísticos cerca del Coliseo.',
   NULL),

  ('rom-card-nasoni', 'rom', 'note',
   'Fuentes nasoni — agua gratis en Roma',
   'Más de 2.500 fuentes de agua potable repartidas por toda la ciudad. App "I Nasoni di Roma" muestra la fuente más cercana en tiempo real. Agua proveniente de acueductos de montaña, limpia y fresca. Llevar botella reutilizable y rellenarla durante el día — el calor en mayo puede sorprender.',
   NULL),

  ('rom-card-transporte', 'rom', 'note',
   'Transporte y consejos prácticos',
   'Metro: billete €1.50 (válido 100 minutos). Abono diario: €7. Roma Pass NO recomendado (el ahorro es mínimo comparado con el precio). Al aeropuerto Fiumicino: Leonardo Express €14, 30 minutos directo desde Termini. Salir de Roma hacia FCO a las 18:00 como máximo para el vuelo de las 20:25.',
   NULL),

  ('rom-card-clima', 'rom', 'note',
   'Clima mayo en Roma',
   '22-23°C durante el día, 12-15°C por la noche. 12 horas de sol diarias. Lluvia improbable en mayo. Condiciones ideales para caminar y visitar todo a pie. Usar protector solar. Aprovechar las fuentes nasoni para mantenerse hidratado.',
   NULL);
