# eurotrip2026 — Database Dump (Production)

_Snapshot del estado real de D1 producción. Regenerado junto con las migrations consolidadas._

_Este archivo es una red de seguridad legible. La fuente canónica de reconstrucción son `migrations/0001_schema.sql` + `migrations/0002_seed.sql`._

## `cities` (5 rows)

```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  arrival DATE NOT NULL,
  departure DATE NOT NULL,
  nights INTEGER NOT NULL,
  color TEXT NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL
)
```

| id | name | slug | arrival | departure | nights | color | lat | lon |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mad | Madrid | madrid | 2026-04-20 | 2026-04-24 | 4 | #e8a74e | 40.4168 | -3.7038 |
| bcn | Barcelona | barcelona | 2026-04-24 | 2026-04-24 | 0 | #e07b5a | 41.3874 | 2.1686 |
| par | París | paris | 2026-05-03 | 2026-05-05 | 2 | #7e8cc4 | 48.8566 | 2.3522 |
| rom | Roma | roma | 2026-05-05 | 2026-05-09 | 4 | #c27ba0 | 41.9028 | 12.4964 |
| pmi | Palma de Mallorca | palma | 2026-04-28 | 2026-05-03 | 5 | #f59e0b | 39.5696 | 2.6502 |

## `days` (22 rows)

```sql
CREATE TABLE days (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  date DATE NOT NULL,
  label TEXT,
  variant TEXT NOT NULL DEFAULT 'both'
)
```

| id | city_id | date | label | variant |
| --- | --- | --- | --- | --- |
| mad-day-apr20 | mad | 2026-04-20 | Llegada · 6AM · descanso | both |
| mad-day-apr21 | mad | 2026-04-21 | Aniversario | both |
| mad-day-apr22 | mad | 2026-04-22 | NULL | both |
| mad-day-apr23 | mad | 2026-04-23 | NULL | both |
| pmi-day-apr28 | pmi | 2026-04-28 | Llegada vuelo desde BCN · check-in hotel | both |
| pmi-day-apr29 | pmi | 2026-04-29 | NULL | both |
| pmi-day-apr30 | pmi | 2026-04-30 | NULL | both |
| pmi-day-may01 | pmi | 2026-05-01 | NULL | both |
| pmi-day-may02 | pmi | 2026-05-02 | NULL | both |
| par-day-may03 | par | 2026-05-03 | NULL | both |
| par-day-may04 | par | 2026-05-04 | NULL | both |
| rom-day-may06 | rom | 2026-05-06 | NULL | both |
| rom-day-may07 | rom | 2026-05-07 | NULL | both |
| rom-day-may08 | rom | 2026-05-08 | NULL | both |
| rom-day-may09 | rom | 2026-05-09 | Salida · IB0656 FCO→MAD 20:25 | both |
| bcn-day-apr28 | bcn | 2026-04-28 | Salida · Vuelo BCN → PMI | both |
| mad-day-may09-noche | mad | 2026-05-09 | Escala nocturna · Sábado noche en Madrid | both |
| rom-day-may05 | rom | 2026-05-05 | Llegada · Vuelo desde París al mediodía | both |
| bcn-day-apr24 | bcn | 2026-04-24 | NULL | both |
| bcn-day-apr25 | bcn | 2026-04-25 | NULL | both |
| bcn-day-apr26 | bcn | 2026-04-26 | NULL | both |
| bcn-day-apr27 | bcn | 2026-04-27 | NULL | both |

## `activities` (78 rows)

```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  day_id TEXT NOT NULL REFERENCES days(id),
  time_slot TEXT NOT NULL CHECK(time_slot IN ('morning','afternoon','evening','all-day')),
  description TEXT NOT NULL,
  cost_hint TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0,
  variant TEXT NOT NULL DEFAULT 'both'
, tipo TEXT NOT NULL DEFAULT 'visit', tag  TEXT NOT NULL DEFAULT '', fare    TEXT, company TEXT)
```

| id | day_id | time_slot | description | cost_hint | confirmed | variant | tipo | tag | fare | company |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mad-act-apr20-arrival | mad-day-apr20 | morning | Llegada desde Santiago (vuelo SCL → MAD) ~6AM | NULL | 1 | both | transport | Llegada Madrid | NULL | NULL |
| mad-act-apr20-transfer | mad-day-apr20 | morning | Traslado al AirBnB — C. del Ave María 42, Lavapiés | NULL | 1 | both | transport | Traslado AirBnB | NULL | NULL |
| pmi-apr28-am | pmi-day-apr28 | morning | Vuelo BCN → PMI · llegada ~09:00 · check-in hotel | NULL | 0 | both | transport | Vueling / Ryanair | NULL | NULL |
| pmi-apr28-pm | pmi-day-apr28 | afternoon | Casco Antiguo de Palma · Catedral La Seu exterior + Parc de la Mar · Paseo Marítimo | gratis | 0 | both | visit | Casco Antiguo | NULL | NULL |
| pmi-apr28-ev | pmi-day-apr28 | evening | Barrio de La Lonja · cena en Plaça de la Llotja | NULL | 0 | both | visit | La Lonja | NULL | NULL |
| pmi-apr29-am | pmi-day-apr29 | morning | Catedral La Seu interior · acceso con guía audioguía incluida · accesible | €10 · €8 mayores | 0 | both | visit | Catedral La Seu | NULL | NULL |
| pmi-apr29-pm | pmi-day-apr29 | afternoon | Barrio de Santa Catalina · Mercado de Santa Catalina · tapas y vermut | gratis | 0 | both | visit | Santa Catalina | NULL | NULL |
| pmi-apr29-ev | pmi-day-apr29 | evening | Paseo del Borne · heladerías y bares de la avenida principal | gratis | 0 | both | visit | Paseo del Borne | NULL | NULL |
| pmi-apr30-am | pmi-day-apr30 | morning | Excursión Valldemossa · Bus 203 desde Palma (~30 min) · Real Cartuja de Valldemossa · celda de Chopin | €3 bus · €10 cartuja | 0 | both | visit | Valldemossa | NULL | NULL |
| pmi-apr30-pm | pmi-day-apr30 | afternoon | Valldemossa pueblo · cafés con vistas a la Serra de Tramuntana · regreso en bus | NULL | 0 | both | visit | Valldemossa | NULL | NULL |
| pmi-apr30-ev | pmi-day-apr30 | evening | Cena en Palma · descanso | NULL | 0 | both | visit | Palma | NULL | NULL |
| pmi-may01-am | pmi-day-may01 | morning | Excursión Sóller · Bus 204 (~1h) · tranvía histórico 1913 hasta Port de Sóller · almuerzo en el puerto | €3 bus · €6 tranvía ida y vuelta | 0 | both | visit | Sóller | NULL | NULL |
| pmi-may01-pm | pmi-day-may01 | afternoon | Port de Sóller · paseo costero al nivel del mar · regreso a Palma en bus | NULL | 0 | both | visit | Port de Sóller | NULL | NULL |
| pmi-may01-ev | pmi-day-may01 | evening | Descanso · cena ligera en el hotel o barrio | NULL | 0 | both | visit | Palma | NULL | NULL |
| pmi-may02-am | pmi-day-may02 | morning | Castillo de Bellver · único castillo circular de España · vistas panorámicas a la bahía | €3 | 0 | both | visit | Castillo de Bellver | NULL | NULL |
| pmi-may02-pm | pmi-day-may02 | afternoon | Crucero catamarán desde el puerto de Palma · sin necesidad de caminar · vista de la costa | €35–€50 p/p · reservar online | 0 | both | visit | Crucero Bahía | NULL | NULL |
| pmi-may02-ev | pmi-day-may02 | evening | Cena de despedida en Palma · restaurante en Santa Catalina o La Lonja | NULL | 0 | both | visit | Palma | NULL | NULL |
| par-may03-am | par-day-may03 | morning | Vuelo PMI → CDG · llegada mediodía · check-in hotel | NULL | 0 | both | transport | Vueling / Ryanair | NULL | NULL |
| par-may03-pm | par-day-may03 | afternoon | Torre Eiffel · Champ de Mars · vista exterior · sin subir · Jardines del Trocadéro | gratis exterior | 0 | both | visit | Torre Eiffel | NULL | NULL |
| par-may03-ev | par-day-may03 | evening | Crucero nocturno por el Sena · sentado durante todo el recorrido · sin caminar | €15–€25 · reservar online | 0 | both | visit | Crucero Sena | NULL | NULL |
| par-may04-am | par-day-may04 | morning | Musée d'Orsay · impresionismo · ascensor disponible · reservar horario con anticipación (obligatorio abr–ago) | €16 · reservar online | 0 | both | visit | Musée d'Orsay | NULL | NULL |
| par-may04-pm | par-day-may04 | afternoon | Notre-Dame exterior (restauración, icónica igual) + Sainte-Chapelle · vitrales góticos · reservar skip-the-line | €11 Sainte-Chapelle · reservar | 0 | both | visit | Notre-Dame · Sainte-Chapelle | NULL | NULL |
| par-may04-ev | par-day-may04 | evening | Montmartre · funicular hasta Sacré-Cœur · vista de París al atardecer · Place du Tertre | gratis · funicular €2 | 0 | both | visit | Montmartre | NULL | NULL |
| rom-may06-am | rom-day-may06 | morning | Colosseo + Foro Romano + Palatino · entrada combinada · RESERVAR con 2+ semanas de anticipación · Metro B hasta Colosseo | €18 · reservar online | 0 | both | visit | Colosseo | NULL | NULL |
| rom-may06-pm | rom-day-may06 | afternoon | Barrio Monti · descanso · calles medievales · muchos lugares para sentarse | gratis | 0 | both | visit | Rione Monti | NULL | NULL |
| rom-may06-ev | rom-day-may06 | evening | Cena en Monti o regreso al hotel · descanso necesario post-Colosseo | NULL | 0 | both | visit | Roma | NULL | NULL |
| rom-may07-am | rom-day-may07 | morning | Musei Vaticani + Capilla Sixtina · entrada timed 8:00 o 9:00 · RESERVAR con anticipación · Metro A hasta Ottaviano | €22 · reservar online | 0 | both | visit | Musei Vaticani | NULL | NULL |
| rom-may07-pm | rom-day-may07 | afternoon | Basílica de San Pedro + Plaza San Pedro (gratis) · almuerzo en Prati · barrio tranquilo junto al Vaticano | gratis basílica | 0 | both | visit | San Pietro · Prati | NULL | NULL |
| rom-may07-ev | rom-day-may07 | evening | Regreso a Trastevere · última cena en el barrio o Pigneto | NULL | 0 | both | visit | Trastevere | NULL | NULL |
| rom-may08-am | rom-day-may08 | morning | Galería Borghese · RESERVA OBLIGATORIA (se agota rápido) · visita guiada 2h · turno 9:00 o 11:00 · Metro A hasta Spagna + taxi corto | €18 + €2 reserva · reservar 10+ días antes | 0 | both | visit | Galleria Borghese | NULL | NULL |
| rom-may08-pm | rom-day-may08 | afternoon | Villa Borghese · jardines con senderos planos y sombra · Piazza del Popolo · Piazza di Spagna exterior | gratis | 0 | both | visit | Villa Borghese | NULL | NULL |
| rom-may08-ev | rom-day-may08 | evening | Cena de despedida en Roma · Ghetto Ebraico o Campo de' Fiori · último paseo nocturno | NULL | 0 | both | visit | Roma | NULL | NULL |
| rom-may09-am | rom-day-may09 | morning | Mañana libre · desayuno en el barrio · actividad pendiente si queda algo | NULL | 0 | both | visit | Roma | NULL | NULL |
| rom-may09-pm | rom-day-may09 | afternoon | Transfer al aeropuerto FCO · salida desde hotel ~16:00–16:30 · Leonardo Express o taxi (~45 min) | €14 tren / €50 taxi | 0 | both | transport | FCO · IB0656 | NULL | NULL |
| bcn-apr28-am | bcn-day-apr28 | morning | Vuelo BCN → PMI · salida temprana · traslado aeropuerto El Prat (T1/T2) | NULL | 0 | both | transport | Vueling / Ryanair | NULL | NULL |
| pmi-apr28-rec-celler | pmi-day-apr28 | evening | Cena recomendada: Celler Sa Premsa · cocina mallorquina tradicional · menú del día o carta · especialidad en lechona y sopas mallorquinas · reservar con anticipación | €15–€25 p/p | 0 | both | food | La Lonja · Casco Antiguo | NULL | NULL |
| pmi-apr28-rec-tapas | pmi-day-apr28 | evening | Ruta de tapas a pie por La Lonja · 16°C perfecto para caminar de bar en bar · Plaça de la Drassana y calles adyacentes · pa amb oli (pan con aceite y tomate) + vino local | €5–€10 por parada | 0 | both | leisure | La Lonja | NULL | NULL |
| pmi-apr29-rec-mercado | pmi-day-apr29 | morning | Mercado de Santa Catalina · llegar 8:00–9:00 antes de la multitud y el calor · puestos de frutas locales, queso mallorquín, aceitunas · ambiente de mercado auténtico local | gratis entrar · €5–€15 compras | 0 | both | visit | Santa Catalina | NULL | NULL |
| pmi-apr29-rec-cafe-catedral | pmi-day-apr29 | afternoon | Café o almuerzo ligero cerca de la Catedral · Bar Bosch (histórico, Plaça del Rei Joan Carles I) o Café Lírico · ensaimada mallorquina + café con leche | €5–€12 p/p | 0 | both | food | Casco Antiguo | NULL | NULL |
| pmi-apr29-rec-rooftop | pmi-day-apr29 | evening | Terraza con vistas al atardecer · Hotel Nakar (Passeig del Born) o Bar Flexas (Plaça de la Drassana) · cócteles o vino local mientras cae el sol sobre la bahía · UV ya bajando después de 19:00 | €8–€15 copa | 0 | both | leisure | Paseo del Borne | NULL | NULL |
| pmi-apr30-rec-capas | pmi-day-apr30 | morning | Consejo clima Tramuntana · llevar chaqueta o capa ligera: la montaña está 3–5°C más fría que la costa · 16°C en Palma = ~11–13°C en Valldemossa · ideal para caminar sin sudar | NULL | 0 | both | leisure | Valldemossa · Serra de Tramuntana | NULL | NULL |
| pmi-apr30-rec-deia | pmi-day-apr30 | afternoon | Parada opcional en Deià de camino de regreso · pueblo de artistas colgado en la montaña · mirador sobre el Mediterráneo · 15 min desde Valldemossa en bus o taxi compartido · café en Sa Vinya des Senyor si está abierto | €2–€3 bus extra / taxi compartido | 0 | both | visit | Deià | NULL | NULL |
| pmi-apr30-rec-soller-mirador | pmi-day-apr30 | afternoon | Alternativa: mirador de Sa Foradada (carretera Valldemossa–Deià) · vistas espectaculares a los acantilados y el mar · parada corta de 20 min · gratis · llevar zapatos cómodos | gratis | 0 | both | visit | Serra de Tramuntana | NULL | NULL |
| pmi-may01-rec-kayak | pmi-day-may01 | afternoon | Port de Sóller · alquiler de kayak o paddleboard · mar a 15–16°C (frío para nadar, ideal para remar) · 19°C ambiente · bahía cerrada y calmada perfecta para principiantes · salir antes de 16:00 | €15–€25/hora alquiler | 0 | both | leisure | Port de Sóller | NULL | NULL |
| pmi-may01-rec-uv-snack | pmi-day-may01 | afternoon | UV 8 (alto) — aplicar protector solar SPF50+ al salir de Palma · en el puerto: merienda con naranja de Sóller (temporada) o zumo recién exprimido en los chiringuitos del paseo marítimo | €2–€4 zumo | 0 | both | leisure | Port de Sóller | NULL | NULL |
| pmi-may01-rec-naranjas | pmi-day-may01 | morning | Naranjas del Valle de Sóller · preguntar en tiendas locales del pueblo por naranjas y limones de cultivo propio · son más dulces que las de supermercado · el mercado local tiene puestos de productores los sábados | €2–€5 bolsa | 0 | both | food | Sóller | NULL | NULL |
| pmi-may02-rec-catamaran-tip | pmi-day-may02 | afternoon | Crucero catamarán · UV 8 — llevar protector solar SPF50+, sombrero y gafas obligatorios · mar a 16°C (frío pero posible bañarse si el barco para) · 22°C ambiente = día ideal para estar en cubierta todo el recorrido · reservar con antelación | €35–€50 p/p · reservar online | 0 | both | leisure | Crucero Bahía | NULL | NULL |
| pmi-may02-rec-cena-esbaluard | pmi-day-may02 | evening | Cena de despedida recomendada: barrio Es Baluard o Portixol · Es Baluard: La Cantina de Bellver con vistas al mar · Portixol: restaurantes frente al puerto pesquero, ambiente local y menos turístico · 22°C perfecto para mesa en terraza | €20–€40 p/p | 0 | both | food | Es Baluard · Portixol | NULL | NULL |
| pmi-may02-rec-mejor-dia | pmi-day-may02 | all-day | Nota clima: 22°C, 10 horas de sol, UV 8 — el mejor día de toda la estancia en Mallorca · aprovechar la mañana en Bellver (vistas a la bahía sin calor excesivo) y la tarde en el catamarán · evitar sol directo entre 11:00 y 16:00 | NULL | 0 | both | leisure | Palma | NULL | NULL |
| mad-may09-noche-llegada | mad-day-may09-noche | evening | Aterrizaje 23:00 · T4 → Sol en metro L8 (noche de sábado, servicio 24h) · carry-on solo, salida rápida | €5 metro | 0 | both | transport | Aeropuerto MAD | NULL | NULL |
| mad-may09-noche-cena | mad-day-may09-noche | evening | Cena tardía en el centro — medianoche del sábado, restaurantes llenos y en pleno servicio | NULL | 0 | both | food | Cena Madrid | NULL | NULL |
| mad-may09-noche-plaza-mayor | mad-day-may09-noche | evening | Plaza Mayor de noche — sin turistas, iluminada, el Madrid más auténtico | gratis | 0 | both | visit | Plaza Mayor | NULL | NULL |
| mad-may09-noche-la-latina | mad-day-may09-noche | evening | Bares de vino y tapas tardías en Cava Baja — el corazón de la noche madrileña | NULL | 0 | both | leisure | La Latina | NULL | NULL |
| mad-may09-noche-gran-via | mad-day-may09-noche | evening | Paseo por Gran Vía iluminada — 03:30hs, la ciudad todavía despierta | gratis | 0 | both | leisure | Gran Vía | NULL | NULL |
| mad-may09-noche-regreso-t4 | mad-day-may09-noche | morning | Metro L8 Nuevos Ministerios → T4 · 04:30hs · desayuno en terminal · vuelo IB0105 08:45 a EZE | €5 metro | 0 | both | transport | Aeropuerto MAD | NULL | NULL |
| rom-may05-am | rom-day-may05 | morning | Vuelo PAR → FCO · CDG ~12:00 → FCO ~14:00 · check-in hotel | NULL | 0 | both | transport | Vueling / EasyJet | NULL | NULL |
| rom-may05-pm | rom-day-may05 | afternoon | Pantheon (€5 recomendado) + Fontana di Trevi · circuito central a pie · calles planas | €5 Pantheon | 0 | both | visit | Pantheon · Trevi | NULL | NULL |
| rom-may05-ev | rom-day-may05 | evening | Trastevere · cena en trattoria local · barrio fotogénico con adoquines y hiedra | NULL | 0 | both | visit | Trastevere | NULL | NULL |
| bcn-apr24-boqueria | bcn-day-apr24 | afternoon | Mercat de la Boqueria · 300+ puestos de frutas, mariscos, zumos frescos · abierto hasta 20:30 · mejor ir después de las 16:00 para evitar multitudes | gratis entrada · €5–€15 compras | 0 | both | visit | La Rambla | NULL | NULL |
| bcn-apr24-born-vermut | bcn-day-apr24 | evening | Vermut y tapas en El Born · ritual del vermut en Bormuth o El Xampanyet · barrio medieval con encanto, galerías y ambiente nocturno | €15–€25 p/p | 0 | both | food | El Born | NULL | NULL |
| bcn-apr24-gotico | bcn-day-apr24 | afternoon | Barrio Gótico · calles medievales, Catedral de Barcelona, El Call (barrio judío) · restos de Sant Jordi: flores y libros en los puestos tardíos | gratis | 0 | both | visit | Barri Gòtic | NULL | NULL |
| bcn-apr25-feria | bcn-day-apr25 | evening | Feria de Abril en Parc del Fòrum · feria andaluza con casetas, flamenco, paella, vino · ambiente festivo · funciona desde el 25 abr hasta mayo | gratis entrada · €10–€20 comida | 0 | both | event | Parc del Fòrum | NULL | NULL |
| bcn-apr25-gracia | bcn-day-apr25 | afternoon | Barrio de Gràcia · plazas bohemias (Plaça del Sol, Virreina, Diamant), cafés artesanales · ambiente de pueblo dentro de la ciudad · Syra Coffee o vermut en La Vermuteria del Tano | €5–€15 café/vermut | 0 | both | leisure | Gràcia | NULL | NULL |
| bcn-apr25-guell | bcn-day-apr25 | morning | Park Güell · vistas panorámicas de Barcelona, mosaicos y arquitectura de Gaudí · reservar entrada con horario online · 2–3 horas mínimo · calzado cómodo | €18 p/p entrada | 0 | both | visit | Park Güell | NULL | NULL |
| bcn-act-apr26-park-guell | bcn-day-apr26 | morning | Park Güell — zona monumental + Casa Museo Gaudí | $59 total (2 personas) | 1 | both | visit | Park Güell | NULL | NULL |
| bcn-act-apr27-sagrada | bcn-day-apr27 | afternoon | Sagrada Família — acceso básico + Torre del Nacimiento. Ticket comprado. | NULL | 1 | both | visit | Sagrada Família | NULL | NULL |
| mad-apr21-aniversario-cena | mad-day-apr21 | evening | Cena de aniversario: Bodega de los Secretos · restaurante en bodega del siglo XVII, Barrio de Letras · alcobas de ladrillo, ambiente íntimo · reservar con anticipación | €30–€50 p/p | 0 | both | food | Barrio de las Letras | NULL | NULL |
| mad-apr21-retiro | mad-day-apr21 | morning | Paseo romántico por El Retiro · alquiler de bote en el Estanque Grande · jardines de Cecilio Rodríguez · ritmo relajado, bancos y sombra | €6–€8 bote · parque gratis | 0 | both | leisure | Parque del Retiro | NULL | NULL |
| mad-apr21-rooftop | mad-day-apr21 | evening | Atardecer en Azotea del Círculo · vistas 360° de Madrid · champagne para brindar el aniversario · llegar 18:30 para hora dorada | €40–€60 p/p cena · €10–€15 copa | 0 | both | leisure | Centro | NULL | NULL |
| mad-apr21-sanmiguel | mad-day-apr21 | afternoon | Mercado de San Miguel · tapas gourmet, jamón ibérico, vinos de Rioja · ir 16:00 para evitar multitudes · probar El Señor Martín (mariscos) y La Hora del Vermut | €15–€25 p/p | 0 | both | food | Plaza Mayor | NULL | NULL |
| mad-apr22-debod | mad-day-apr22 | afternoon | Templo de Debod al atardecer · templo egipcio auténtico con vistas a Casa de Campo · entrada gratuita · mejor luz 18:30–19:00 en abril | gratis | 0 | both | leisure | Moncloa | NULL | NULL |
| mad-apr22-letras | mad-day-apr22 | evening | Tapas por Barrio de las Letras · ruta a pie por calles de Lope de Vega y Huertas · bares tradicionales, ambiente literario · 18–21°C perfecto para terraza | €15–€30 p/p | 0 | both | food | Barrio de las Letras | NULL | NULL |
| mad-apr22-palacio | mad-day-apr22 | afternoon | Palacio Real de Madrid · 2400 salas, residencia oficial · gratis 17–19h lun-jue ciudadanos UE · comprar online si no aplica descuento | €12–€13 · gratis 17–19h | 0 | both | visit | Palacio Real | NULL | NULL |
| mad-apr22-prado | mad-day-apr22 | morning | Museo del Prado · Velázquez (Las Meninas), Goya, El Bosco (El jardín de las delicias) · 2–3 horas máximo · comprar entrada online · accesible con ascensor | €13 · gratis 18–20h | 0 | both | visit | Paseo del Prado | NULL | NULL |
| mad-apr23-cena-despedida | mad-day-apr23 | evening | Cena ligera de despedida de Madrid · barrio del hotel o cerca de Atocha · descanso temprano antes del viaje a Barcelona | €15–€20 p/p | 0 | both | food | Lavapiés · Atocha | NULL | NULL |
| mad-apr23-toledo-almuerzo | mad-day-apr23 | afternoon | Almuerzo típico toledano · carcamusas (guiso local), perdiz estofada, mazapán artesanal · restaurantes en el casco antiguo con vistas al Tajo | €15–€25 p/p | 0 | both | food | Toledo | NULL | NULL |
| mad-apr23-toledo-catedral | mad-day-apr23 | morning | Catedral Primada de Toledo · arte gótico, cuadros de El Greco · calles empedradas con tiendas de artesanía y mazapán · ritmo pausado con paradas en cafés | ~€13 catedral | 0 | both | visit | Toledo · Casco Antiguo | NULL | NULL |
| mad-apr23-toledo-tren | mad-day-apr23 | morning | Tren a Toledo desde Atocha · 30 min, viaje pintoresco · trenes cada hora · comprar ida y vuelta online · ciudad medieval Patrimonio UNESCO | ~€14 ida y vuelta | 0 | both | visit | Toledo | NULL | NULL |

## `transport_legs` (5 rows)

```sql
CREATE TABLE transport_legs (
  id TEXT PRIMARY KEY,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  date DATE NOT NULL,
  mode TEXT NOT NULL CHECK(mode IN ('flight','train','daytrip','ferry')),
  label TEXT NOT NULL,
  duration TEXT,
  cost_hint TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0
, fare    TEXT, company TEXT, departure_time TEXT, arrival_time   TEXT)
```

| id | from_city | to_city | date | mode | label | duration | cost_hint | confirmed | fare | company | departure_time | arrival_time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| leg-scl-mad | SCL | mad | 2026-04-19 | flight | SCL → MAD | NULL | NULL | 1 | NULL | Iberia | 06:40 | NULL |
| leg-fco-mad | rom | mad | 2026-05-09 | flight | IB0656 FCO T1 → MAD | ~2h 35m | NULL | 1 | NULL | Iberia | 20:25 | 23:00 |
| leg-mad-eze | mad | eze | 2026-05-10 | flight | IB0105 MAD → EZE TIA | ~13h 40m | NULL | 1 | NULL | Iberia | 08:45 | 16:25 |
| leg-mad-bcn | mad | bcn | 2026-04-24 | train | AVE Madrid → Barcelona Sants | NULL | NULL | 1 | NULL | NULL | NULL | NULL |
| leg-par-rom | par | rom | 2026-05-05 | flight | Vuelo París CDG → Roma FCO · ~12:00 → ~14:00 | ~2h | NULL | 0 | NULL | Vueling / EasyJet | NULL | NULL |

## `bookings` (9 rows)

```sql
CREATE TABLE bookings (
  id             TEXT PRIMARY KEY,
  type           TEXT NOT NULL CHECK(type IN ('hito','viaje','hospedaje')),
  sort_date      DATE NOT NULL,
  time           TEXT,
  description    TEXT NOT NULL,
  origin         TEXT,
  destination    TEXT,
  mode           TEXT CHECK(mode IN ('flight','train','bus','ferry','car','other') OR mode IS NULL),
  carrier        TEXT,
  checkout_date  DATE,
  accommodation  TEXT,
  cost_usd       REAL,
  confirmed      INTEGER NOT NULL DEFAULT 0,
  notes          TEXT,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

| id | type | sort_date | time | description | origin | destination | mode | carrier | checkout_date | accommodation | cost_usd | confirmed | notes | created_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| bk-scl-mad | viaje | 2026-04-19 | 06:40 | Vuelo SCL → MAD | Santiago | Madrid | flight | Iberia | NULL | NULL | 1609 | 1 | NULL | 2026-04-12 05:06:15 |
| bk-fco-mad | viaje | 2026-05-09 | 20:25 | IB0656 FCO T1 → MAD | Roma | Madrid | flight | Iberia | NULL | NULL | NULL | 1 | NULL | 2026-04-12 05:06:15 |
| bk-mad-eze | viaje | 2026-05-10 | 08:45 | IB0105 MAD → EZE | Madrid | Buenos Aires | flight | Iberia | NULL | NULL | NULL | 1 | NULL | 2026-04-12 05:06:15 |
| bk-madrid-airbnb | hospedaje | 2026-04-20 | NULL | AirBNB Madrid — C. del Ave María 42, Lavapiés | NULL | NULL | NULL | NULL | 2026-04-24 | AirBNB Madrid | 468.84 | 1 | C. del Ave María, 42, 28012 Madrid · 2 viajeros | 2026-04-12 05:06:15 |
| bk-sagrada | hito | 2026-04-27 | 17:00 | Sagrada Família — acceso básico + Torre del Nacimiento | NULL | NULL | NULL | NULL | NULL | NULL | NULL | 1 | NULL | 2026-04-12 05:06:15 |
| bk-mad-bcn | viaje | 2026-04-24 | 08:57 | AVE Madrid P. Atocha → Barcelona Sants · Llegada 12:06 · 2 pasajes | Madrid | Barcelona | train | Renfe AVE | NULL | NULL | NULL | 1 | Localizador: S8GYKB · Coche 7 | 2026-04-12 05:38:03 |
| bk-bcn-airbnb | hospedaje | 2026-04-24 | NULL | Airbnb Barcelona — Poble Sec | NULL | NULL | NULL | NULL | 2026-04-28 | Airbnb Barcelona | 675.39 | 1 | C. de Blesa / Nou de la Rambla · 2 viajeros | 2026-04-12 05:38:48 |
| bk-parkguell | hito | 2026-04-26 | 13:30 | Park Güell — entrada reservada · 2 tickets | NULL | NULL | NULL | NULL | NULL | NULL | 56.24 | 1 | 48 EUR (2 entradas) | 2026-04-12 06:28:42 |
| booking-park-guell-apr26 | hito | 2026-04-26 | NULL | Park Güell — zona monumental + Casa Museo Gaudí (2 personas) | NULL | NULL | NULL | NULL | NULL | NULL | 59 | 1 | NULL | 2026-04-12 07:18:39 |

## `cards` (41 rows)

```sql
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  type TEXT NOT NULL CHECK(type IN ('info','link','note','photo')),
  title TEXT NOT NULL,
  body TEXT,
  url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

| id | city_id | type | title | body | url | created_at |
| --- | --- | --- | --- | --- | --- | --- |
| mad-card-prado | mad | info | Museo del Prado | Horario: Lun-Sáb 10-20h, Dom 10-19h. Entrada €13 adultos. Gratis lun-sáb 18-20h y dom 17-19h. Comprar online para evitar colas. Obras imprescindibles: Velázquez, Goya, El Bosco. Visita recomendada: 2-3 horas. | https://www.museodelprado.es | 2026-04-12 17:37:58 |
| mad-card-retiro | mad | info | Parque del Retiro | Entrada gratuita. Abr-Sep: 6-24h. Alquiler de botes en el estanque grande: €6-8. Palacio de Cristal: acceso gratuito. Ideal para un paseo relajado entre visitas. | NULL | 2026-04-12 17:37:58 |
| mad-card-palacio-real | mad | info | Palacio Real | Entrada €12-13. Gratis lun-jue 17-19h (abr-sep, ciudadanos UE). 2.400 salas, una de las residencias reales más grandes de Europa. Comprar tickets online con anticipación. | https://tickets.patrimonionacional.es | 2026-04-12 17:37:58 |
| mad-card-san-miguel | mad | info | Mercado de San Miguel | Horario: Dom-Jue 10-24h, Vie-Sáb 10-01h. Entrada gratuita. Tapas y degustación gourmet: €15-25 por persona. Muy concurrido entre 13-15h y 18-22h — evitar esos horarios si se puede. | NULL | 2026-04-12 17:37:58 |
| mad-card-toledo | mad | note | Excursión a Toledo | Tren AVE desde Atocha: ~30 min, aprox €14 ida y vuelta. Ciudad medieval declarada Patrimonio UNESCO. Catedral de Toledo: ~€13. Llevar calzado muy cómodo — las calles son empedradas y hay muchas cuestas. Dedicar mínimo 5-6 horas. | NULL | 2026-04-12 17:37:58 |
| mad-card-restaurantes | mad | note | Restaurantes recomendados | Romántico/aniversario: Bodega de los Secretos (bodega del s.XVII, €30-50 p/p, reservar con anticipación). Rooftop con vistas: Azotea del Círculo de Bellas Artes (vistas 360°, €40-60 p/p). Casual: tapas en Barrio de las Letras. Picoteo gourmet: Mercado de San Miguel. | NULL | 2026-04-12 17:37:58 |
| mad-card-transporte | mad | note | Transporte en Madrid | Metro: 6:00-01:30h. Billete sencillo €2.60, bono 10 viajes €12.20. Mayores de 65 años: gratis con justificante de edad. Líneas útiles: L1 (Sol ↔ Retiro), L2 (Banco de España ↔ Museo del Prado). | NULL | 2026-04-12 17:37:58 |
| mad-card-clima | mad | note | Clima abril en Madrid | 18-21°C durante el día, 8-10°C por la noche. Lluvia moderada posible. 7-8 horas de sol diarias. Atardecer alrededor de las 20:30h. Llevar chaqueta ligera y calzado cómodo para caminar. | NULL | 2026-04-12 17:37:58 |
| bcn-card-guell | bcn | info | Park Güell | Entrada €18. Acceso con horario asignado — reservar online con antelación. Horario: 9:30-19:30h. Visita mínima recomendada: 2-3 horas. Diseño de Gaudí con terrazas y vistas panorámicas de la ciudad. | https://parkguell.barcelona | 2026-04-12 17:37:58 |
| bcn-card-gotico | bcn | note | Barrio Gótico | Visita gratuita. Calles medievales laberínticas. Catedral de Barcelona (entrada gratuita). El Call, el antiguo barrio judío de la ciudad. Mejor visitarlo temprano en la mañana cuando hay menos gente. Precaución con carteristas en zonas turísticas. | NULL | 2026-04-12 17:37:58 |
| bcn-card-boqueria | bcn | info | Mercat de la Boqueria | Horario: Lun-Sáb 8:00-20:30h, cerrado domingos. Más de 300 puestos de productos frescos. Ir antes de las 10h para evitar la avalancha de turistas. Zumos frescos, mariscos, frutas locales. No salir sin probar algo. | https://www.boqueria.barcelona | 2026-04-12 17:37:58 |
| bcn-card-montjuic | bcn | info | Montjuïc | Castillo de Montjuïc: €5. MNAC (Museo Nacional de Arte de Cataluña): €12. Fundació Joan Miró: €12. Subir en Bus 150 desde Plaça d'Espanya o en teleférico. Vistas panorámicas de Barcelona y el puerto. Dedicar 3-4 horas para una visita rápida. | NULL | 2026-04-12 17:37:58 |
| bcn-card-paella | bcn | note | Dónde comer paella en Barcelona | Can Majó (estilo familiar, ambiente de pescador, socarrat perfecto). Can Solé (más de 120 años de historia, arroz con bogavante). Xiringuito Escribà (en la playa de Bogatell, ambiente relajado). Todos requieren reserva con anticipación — especialmente en fin de semana. | NULL | 2026-04-12 17:37:58 |
| bcn-card-barrios | bcn | note | Barrios para explorar | El Born: barrio medieval con museos, tapas y ambiente nocturno (Bormuth, Xampanyet). Gràcia: bohemio y relajado, plazas animadas y cafés con encanto. Barceloneta: paseo marítimo, playa y mariscos frescos. Barrio Gótico: historia medieval y catedrales. | NULL | 2026-04-12 17:37:58 |
| bcn-card-eventos | bcn | note | Eventos abril 2026 en Barcelona | Sant Jordi (23 abr, con posible extensión 24-25): libros y rosas en Passeig de Gràcia — fiesta cultural única. Feria de Abril (desde 25 abr): Parc del Fòrum, casetas andaluzas, flamenco y ambiente festivo. Jazz Day (26 abr): conciertos gratuitos en distintos puntos. | NULL | 2026-04-12 17:37:58 |
| bcn-card-seguridad | bcn | note | Seguridad y consejos prácticos | Zonas de mayor riesgo de carteristas: La Rambla, estaciones de tren, metro en hora punta, playas. Usar bolso cruzado, evitar bolsillos traseros. Para el metro usar T-Casual: €13 por 10 viajes Zona 1 (no transferible entre personas). | NULL | 2026-04-12 17:37:58 |
| pmi-card-catedral | pmi | info | Catedral de Palma (La Seu) | Entrada €9-10. Horario hasta las 17h en la mayoría de los meses. Catedral gótica de más de 900 años con impresionantes vistas a la bahía de Palma. Evitar coincidencia con llegada de cruceros (suelen ser por la mañana). | https://palmacathedraltickets.com | 2026-04-12 17:37:58 |
| pmi-card-bellver | pmi | info | Castillo de Bellver | Entrada €4 (€2 pensionistas, gratuito domingos). Horario: Mar-Sáb 8:30-20h. Castillo circular gótico del s.XIV, único en su tipo en España. Vistas 360° de Palma y la bahía. Planta baja accesible para movilidad reducida. | https://castelldebellver.palma.es | 2026-04-12 17:37:58 |
| pmi-card-soller | pmi | info | Tren de Sóller | Ida €23, ida y vuelta €30. Tren histórico de 1912 que atraviesa 1 hora de montañas, túneles y paisajes únicos de Mallorca. Reservar online con al menos 7 días de antelación (se agota rápido). Tranvía desde Sóller hasta el Port de Sóller: €3-4 adicionales. | https://trendesoller.com | 2026-04-12 17:37:58 |
| pmi-card-valldemossa | pmi | note | Excursión a Valldemossa | Bus TIB línea 203, 35-45 min, €4-6 ida y vuelta. La Cartuja de Valldemossa: €12.50 (incluye concierto de música de Chopin ~10:30h). Pueblo pintoresco con calles empedradas y flores en las ventanas. 3-5°C más frío que en la costa — llevar chaqueta. | NULL | 2026-04-12 17:37:58 |
| pmi-card-mercados | pmi | note | Mercados de Palma | Mercat de l'Olivar: Lun-Vie 7-14:30h, Sáb hasta 15h. Ideal para desayunar tapas, ostras y cava. Santa Catalina: Lun-Sáb 7-17h. Productos frescos locales, ambiente artístico y bohemio. Ambos en el centro de Palma. | NULL | 2026-04-12 17:37:58 |
| pmi-card-playas | pmi | note | Playas recomendadas | Illetas: arena fina, aguas calmas y servicios completos (hamacas, duchas). Es Carnatge: cala de aguas turquesas más tranquila. Formentor: al norte de la isla, 1-2h en coche, espectacular pero requiere planificación. Temperatura del agua ~17°C (fresca para nadar, agradable para caminar por la orilla). | NULL | 2026-04-12 17:37:58 |
| pmi-card-gastronomia | pmi | note | Gastronomía mallorquina | Ensaimada: espiral de masa hojaldrada con azúcar (mejor en Ca'n Joan de S'Aigo, la pastelería más antigua de la isla). Sobrasada: embutido de cerdo con pimentón. Pa amb oli: pan con tomate y aceite de oliva. Tumbet: berenjenas y patatas al horno. Frito mallorquín. Para mariscos: MARiLUZ y Sa Roqueta. | NULL | 2026-04-12 17:37:58 |
| pmi-card-clima | pmi | note | Clima fin de abril / mayo en Mallorca | 19-22°C durante el día, 11-14°C por la noche. Mar a ~17°C. Mayormente soleado con alguna nube. Índice UV alto — usar protector solar SPF50+. Ideal para caminar y turismo sin el calor del verano. | NULL | 2026-04-12 17:37:58 |
| par-card-eiffel | par | info | Torre Eiffel | Entrada €14-35 según nivel (planta 1, 2 o cima). Horario: 9:00-00:45h. RESERVAR OBLIGATORIO con al menos 60 días de anticipación — se agotan todas las franjas horarias. Ascensor disponible para todos los niveles. Vista nocturna altamente recomendada. | https://ticket.toureiffel.paris | 2026-04-12 17:37:58 |
| par-card-orsay | par | info | Musée d'Orsay | Entrada €16. Horario: Mar-Dom 9:30-18h (jueves hasta las 21:45h), cerrado los lunes. Exposición actual: "Renoir and Love" (mar-jul 2026) — ideal para parejas. Colección impresionista más importante del mundo. | https://www.musee-orsay.fr | 2026-04-12 17:37:58 |
| par-card-notre-dame | par | info | Notre-Dame de París | REABIERTA en diciembre de 2024 tras el incendio de 2019. Entrada gratuita con reserva de horario obligatoria. Torres accesibles desde septiembre de 2025. Restauración completamente terminada. Una de las catedrales góticas más importantes del mundo. | https://www.notredamedeparis.fr | 2026-04-12 17:37:58 |
| par-card-montmartre | par | note | Montmartre | Sacré-Cœur: entrada gratuita (cúpula €6, 300 escalones). Place du Tertre: artistas pintando en vivo. Funicular disponible para subir la colina (cuesta arriba es empinada). PRECAUCIÓN: muchas cuestas y escaleras — evaluar movilidad del grupo. Metro L12 parada Abbesses (hay ascensor). | NULL | 2026-04-12 17:37:58 |
| par-card-cruceros | par | note | Cruceros por el Sena | Vedettes du Pont Neuf: €15/hora, opción más económica. Bateaux Parisiens: €17/hora, más conocido. Ducasse sur Seine: €110+ por persona, experiencia gourmet con estrella Michelin. Reservar con 3-5 días de anticipación. El crucero al atardecer es especialmente recomendado. | NULL | 2026-04-12 17:37:58 |
| par-card-comida | par | note | Dónde comer en París | Bouillon Chartier (desde 1896): menú de 3 platos ~€20-25, bullicioso y auténtico. Chez Fernand (Saint-Germain): ambiente romántico y cocina tradicional francesa. Du Pain et Des Idées: los mejores croissants de París (llegar temprano, se agotan). Stohrer: pastelería más antigua de París, desde 1730. | NULL | 2026-04-12 17:37:58 |
| par-card-museum-pass | par | note | Paris Museum Pass 2 días | Precio: ~€65 por persona. Incluye acceso a Louvre, Orsay, Arco del Triunfo y más de 50 museos. Vale la pena si planean visitar 4 o más museos. Importante: requiere igualmente reserva horaria para el Louvre y Versalles. Ahorra tiempo en colas de compra de entradas. | NULL | 2026-04-12 17:37:58 |
| par-card-transporte | par | note | Transporte en París | Billete individual: €2.55. Carnet de 10 viajes: €17.05. Abono 1 día (t+): €12.30 (rentable a partir de 5+ viajes diarios). Los tickets de papel están en extinción — usar tarjeta bancaria contactless directamente o la app Île-de-France Mobilités. | NULL | 2026-04-12 17:37:58 |
| rom-card-coliseo | rom | info | Coliseo + Foro Romano + Palatino | Entrada combinada: €18, válida 24 horas. RESERVAR OBLIGATORIO con al menos 30 días de anticipación. Horario: 8:30h hasta 1 hora antes del atardecer. Llevar documento de identidad — se verifica en la entrada. Sin reserva previa, la espera puede ser de 3-4 horas. | https://colosseo.it | 2026-04-12 17:37:58 |
| rom-card-vaticano | rom | info | Museos Vaticanos + Capilla Sixtina | Entrada: €20-25 (recomendado skip-the-line). Horario: Lun-Sáb 8:00-20h, cerrado domingos (excepto último domingo del mes, gratis pero con cola enorme). Reservar con 60 días de anticipación como mínimo. CÓDIGO DE VESTIMENTA OBLIGATORIO: hombros y rodillas cubiertos — no se puede entrar con pantalón corto o camiseta sin mangas. | https://www.museivaticani.va | 2026-04-12 17:37:58 |
| rom-card-san-pedro | rom | info | Basílica de San Pedro | Entrada GRATUITA. Horario: 7:00-19:00h diario. Cúpula: €10 subiendo a pie (551 escalones) o €8 con ascensor parcial. Mismo código de vestimenta que los Museos Vaticanos. La Piedad de Miguel Ángel está detrás de un cristal protector. Sin reserva necesaria. | NULL | 2026-04-12 17:37:58 |
| rom-card-panteon | rom | info | Panteón | Entrada: €5 (tarifa vigente hasta junio 2026). Horario: 9:00-19:00h todos los días. No requiere reserva previa. El edificio romano mejor conservado del mundo, con más de 1.900 años de antigüedad. El óculo del techo (9m de diámetro) permanece abierto al cielo. Visita: 30-45 minutos. | NULL | 2026-04-12 17:37:58 |
| rom-card-trastevere | rom | note | Trastevere | Barrio bohemio con calles empedradas cubiertas de hiedra. Piazza di Santa Maria in Trastevere: corazón del barrio. Mejor visitarlo al atardecer cuando cobra vida. Para cenar: Trattoria da Augusto (sin reserva, llegar entre 19-20h, cocina romana de toda la vida), Taverna Trilussa (reservar con anticipación). Pedir cacio e pepe o carbonara auténticos. | NULL | 2026-04-12 17:37:58 |
| rom-card-pasta-romana | rom | note | Las 4 pastas romanas | Cacio e Pepe: pecorino romano y pimienta negra, cremosa y potente. Carbonara: guanciale (carrillera curada), huevo, pecorino — sin nata, nunca. Amatriciana: guanciale, tomate y pecorino. Gricia: guanciale y pecorino sin huevo (la madre de todas). Probarlas en Trastevere o Monti. Evitar restaurantes turísticos cerca del Coliseo. | NULL | 2026-04-12 17:37:58 |
| rom-card-nasoni | rom | note | Fuentes nasoni — agua gratis en Roma | Más de 2.500 fuentes de agua potable repartidas por toda la ciudad. App "I Nasoni di Roma" muestra la fuente más cercana en tiempo real. Agua proveniente de acueductos de montaña, limpia y fresca. Llevar botella reutilizable y rellenarla durante el día — el calor en mayo puede sorprender. | NULL | 2026-04-12 17:37:58 |
| rom-card-transporte | rom | note | Transporte y consejos prácticos | Metro: billete €1.50 (válido 100 minutos). Abono diario: €7. Roma Pass NO recomendado (el ahorro es mínimo comparado con el precio). Al aeropuerto Fiumicino: Leonardo Express €14, 30 minutos directo desde Termini. Salir de Roma hacia FCO a las 18:00 como máximo para el vuelo de las 20:25. | NULL | 2026-04-12 17:37:58 |
| rom-card-clima | rom | note | Clima mayo en Roma | 22-23°C durante el día, 12-15°C por la noche. 12 horas de sol diarias. Lluvia improbable en mayo. Condiciones ideales para caminar y visitar todo a pie. Usar protector solar. Aprovechar las fuentes nasoni para mantenerse hidratado. | NULL | 2026-04-12 17:37:58 |

## `card_links` (73 rows)

```sql
CREATE TABLE card_links (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  tooltip TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
)
```

| id | card_id | url | label | tooltip | sort_order |
| --- | --- | --- | --- | --- | --- |
| link-mad-prado-1 | mad-card-prado | https://www.museodelprado.es/en/visit-the-museum/online-ticket-purchase | Comprar entradas online | Comprar con anticipación evita colas de hasta 1 hora en temporada alta. La entrada gratuita (lun-sáb 18-20h, dom 17-19h) también requiere reservar horario online. | 1 |
| link-mad-prado-2 | mad-card-prado | https://maps.app.goo.gl/3Ld6RLQAXCJrHPFR7 | Cómo llegar — Google Maps | Metro L2 (Banco de España) o L1 (Retiro). El museo tiene entrada por el Paseo del Prado (principal) y por la Puerta de Murillo (grupos). El aparcamiento más cercano está en el Paseo del Prado. | 2 |
| link-mad-prado-3 | mad-card-prado | https://www.museodelprado.es/en/the-collection/top-works | Las obras imprescindibles | Guía oficial del museo con las 14 obras que no se pueden perder: Las Meninas de Velázquez, El jardín de las delicias de El Bosco, y los Fusilamientos de Goya. Útil para planear la visita en 2-3 horas. | 3 |
| link-mad-retiro-1 | mad-card-retiro | https://maps.app.goo.gl/QgJfDtukPYpQR9Yw5 | Parque del Retiro — Google Maps | El parque tiene 16 entradas. La principal está en la Plaza de la Independencia (M° Retiro, L9). Desde allí se llega al Estanque Grande en 5 minutos a pie. El Palacio de Cristal está a 10 minutos andando. | 1 |
| link-mad-retiro-2 | mad-card-retiro | https://www.esmadrid.com/en/tourist-information/el-retiro-park | Guía oficial del Retiro | Portal turístico oficial de Madrid con mapa del parque, horarios actualizados y eventos en curso. Incluye información sobre el Palacio de Cristal y el Palacio de Velázquez, que tienen exposiciones gratuitas. | 2 |
| link-mad-palacio-1 | mad-card-palacio-real | https://tickets.patrimonionacional.es | Reservar entradas oficiales | Única web oficial de venta. Permite elegir horario de entrada y evitar colas. El acceso gratuito (lun-jue 17-19h) también se gestiona desde aquí. Llevar el QR o PDF de la entrada. | 1 |
| link-mad-palacio-2 | mad-card-palacio-real | https://maps.app.goo.gl/XKcHDT7cQGVy5MUm6 | Cómo llegar — Google Maps | Metro L2 (Ópera) o L5 (La Latina). A pie desde la Puerta del Sol: 15 minutos cruzando por la Calle Mayor. El acceso principal es por la Plaza de Armería; hay otro acceso por la Calle Bailén. | 2 |
| link-mad-palacio-3 | mad-card-palacio-real | https://www.patrimonionacional.es/visita/palacio-real-de-madrid | Web oficial del Palacio Real | Información completa sobre colecciones, horarios por temporada, y salas abiertas. Incluye planos de la planta y detalles de las salas más destacadas como el Salón del Trono y la Real Armería. | 3 |
| link-mad-sanmiguel-1 | mad-card-san-miguel | https://www.mercadodesanmiguel.es | Web oficial del mercado | Horarios actualizados, lista completa de puestos y eventos especiales. El mercado celebra catas de vino y otras actividades que se publican aquí con antelación. | 1 |
| link-mad-sanmiguel-2 | mad-card-san-miguel | https://maps.app.goo.gl/pRaT5gBrKvLZkd2t9 | Ubicación — Google Maps | A 2 minutos a pie de la Plaza Mayor (salida por el Arco de Cuchilleros). Metro L2/L5 (Ópera) o L1/L2/L3 (Sol). Fácil combinarlo con una visita a la Plaza Mayor. | 2 |
| link-mad-transporte-1 | mad-card-transporte | https://www.metromadrid.es/en/travel_in_metro/metro-maps | Mapa del metro de Madrid | Mapa oficial en PDF con todas las líneas y estaciones. Útil para planear rutas entre museos y barrios. Las líneas más usadas en el viaje son L1, L2, L5 y L9. | 1 |
| link-mad-transporte-2 | mad-card-transporte | https://www.crtm.es/en/ | Consorcio Regional de Transportes | Web oficial del transporte público de Madrid. Permite calcular rutas en metro, bus y tren de cercanías. También tiene información sobre el bono de 10 viajes y tarifas actualizadas. | 2 |
| link-bcn-guell-1 | bcn-card-guell | https://parkguell.barcelona/en/plan-your-visit/tickets | Reservar entrada Park Güell | RESERVA OBLIGATORIA. Sin entrada previa no se puede acceder al área monumental (terrazas, sala hipóstila, escalinata del dragón). En temporada alta se agota con 2-3 semanas de antelación. Elegir horario: mañana temprano (9:30) tiene mejor luz para fotos. | 1 |
| link-bcn-guell-2 | bcn-card-guell | https://maps.app.goo.gl/7ZnAjJD7RpJfj5Qv9 | Cómo llegar — Google Maps | Bus 24 desde Passeig de Gràcia (30 min). Metro L3 (Lesseps o Vallcarca) + 10-15 min a pie cuesta arriba. El acceso desde Carmel es más empinado pero menos transitado. El parque tiene zonas gratuitas alrededor del área monumental. | 2 |
| link-bcn-guell-3 | bcn-card-guell | https://www.tripadvisor.com/Attraction_Review-g187497-d190452-Reviews-Park_Guell-Barcelona_Catalonia.html | Reseñas en TripAdvisor | Más de 100.000 reseñas con fotos recientes y consejos prácticos de otros viajeros. Especialmente útil para ver qué horarios tienen menos aglomeración y cuánto tiempo dedicarle. | 3 |
| link-bcn-gotico-1 | bcn-card-gotico | https://maps.app.goo.gl/TJN9FRfmBWM6kQRU9 | Barrio Gótico — Google Maps | El Barrio Gótico está delimitado por Las Ramblas, Via Laietana, el mar y Plaça de Catalunya. Metro L3 (Liceu) para la Catedral o L4 (Jaume I) para la parte más medieval. Muchas calles son peatonales. | 1 |
| link-bcn-gotico-2 | bcn-card-gotico | https://www.catedralbcn.org | Catedral de Barcelona — web oficial | Entrada al interior de la catedral: gratuita en horario de culto. Acceso turístico con donativo (€7) incluye subida a la azotea con vistas. El claustro con los 13 gansos blancos es uno de los rincones más singulares. | 2 |
| link-bcn-boqueria-1 | bcn-card-boqueria | https://www.boqueria.barcelona | Web oficial de La Boqueria | Lista de puestos, horarios actualizados y eventos. También permite ver qué producto de temporada está en su mejor momento durante la visita. | 1 |
| link-bcn-boqueria-2 | bcn-card-boqueria | https://maps.app.goo.gl/Q3D6cTZ2mhzpV4xNA | Cómo llegar — Google Maps | Entrada principal en Las Ramblas, a la altura del número 89. Metro L3 (Liceu), a 2 minutos a pie. Ir entre 8:00-10:00 para ver el mercado en su ambiente más auténtico, antes de la llegada de los grupos turísticos. | 2 |
| link-bcn-montjuic-1 | bcn-card-montjuic | https://www.telefericdemontjuic.cat/en | Teleférico de Montjuïc — reservas | Billete ida y vuelta €13. Funciona de 10:00 a 19:00h (mayo). Sale desde la estación Parc Montjuïc (funicular) o desde la estación del Puerto (teleférico del Puerto, €13 adicional). Reservar online para evitar esperas. | 1 |
| link-bcn-montjuic-2 | bcn-card-montjuic | https://www.museunacional.cat/en | MNAC — Museu Nacional d'Art de Catalunya | Entradas online €12. Cada primer domingo de mes y los sábados después de las 15h la entrada es gratuita. La escalinata exterior y las vistas de Barcelona desde la terraza del museo son gratuitas siempre. | 2 |
| link-bcn-montjuic-3 | bcn-card-montjuic | https://maps.app.goo.gl/ZVkVaUqpK5mJFgBe6 | Castillo de Montjuïc — Google Maps | Subida en bus 150 desde Plaça d'Espanya (€2.55, 20 min). El castillo tiene vistas a 360° del mar y la ciudad. Entrada €5, domingos después de las 15h entrada gratuita. | 3 |
| link-bcn-barrios-1 | bcn-card-barrios | https://maps.app.goo.gl/7e2jYM1ZGKcJaFRb8 | El Born — Google Maps | El Born está centrado en el Passeig del Born. Metro L4 (Jaume I). El Mercat del Born (centro cultural, entrada gratuita) tiene restos arqueológicos medievales bajo el suelo de cristal. | 1 |
| link-bcn-barrios-2 | bcn-card-barrios | https://maps.app.goo.gl/Bp3SiHoG43Kky9mz6 | Gràcia — Google Maps | Barrio bohemio a pie desde Park Güell (15 min cuesta abajo). Metro L3 (Fontana o Diagonal). Las plazas más animadas: Plaça del Sol, Plaça de la Vila de Gràcia y Plaça de la Virreina. | 2 |
| link-bcn-paella-1 | bcn-card-paella | https://www.canmajo.es | Can Majó — reservas | Uno de los mejores restaurantes de arroz de Barcelona, frente a la Barceloneta. Paella y fideuà desde €22 por persona. Reservar con 5-7 días de anticipación en fin de semana. Pedir el arroz negro con alioli. | 1 |
| link-bcn-paella-2 | bcn-card-paella | https://www.tripadvisor.com/Restaurant_Review-g187497-d1010923-Reviews-Can_Sole-Barcelona_Catalonia.html | Can Solé — TripAdvisor | Más de 120 años sirviendo arroces en el barrio de la Barceloneta. Reseñas actualizadas con fotos de platos recientes. El arroz con bogavante es el plato estrella. Precio medio €35-50 por persona. | 2 |
| link-pmi-catedral-1 | pmi-card-catedral | https://palmacathedraltickets.com | Reservar entradas La Seu | Entradas online €9-10. Sin cola de compra con reserva previa. Los cruceros desembarcan mayoritariamente entre 9-13h — visitar fuera de ese horario para una experiencia más tranquila. | 1 |
| link-pmi-catedral-2 | pmi-card-catedral | https://maps.app.goo.gl/Nc1LhGLAoEkswz6D7 | Catedral de Palma — Google Maps | Situada junto al Parc de la Mar, con vistas al puerto. A 15 minutos a pie desde la Plaza Mayor. Aparcar en el Parc de la Mar (€2/hora) o llegar en bus EMT (línea 1 o 3). | 2 |
| link-pmi-catedral-3 | pmi-card-catedral | https://catedraldemallorca.org | Web oficial de la Catedral | Información sobre horarios, visitas especiales, y la obra de Gaudí en el interior (el baldaquino y la vidriera de la roseta). La catedral fue parcialmente reformada por Gaudí a principios del siglo XX. | 3 |
| link-pmi-bellver-1 | pmi-card-bellver | https://castelldebellver.palma.es | Castillo de Bellver — web oficial | Entrada €4, gratis domingos. Horarios actualizados y descripción del museo histórico del castillo. El castillo circular del s.XIV es único en España y tiene vistas 360° de la bahía de Palma. | 1 |
| link-pmi-bellver-2 | pmi-card-bellver | https://maps.app.goo.gl/GKBJw9kWe1EhGBVY7 | Cómo llegar — Google Maps | Bus EMT línea 50 desde el centro de Palma (20 min). En taxi: €8-10 desde el centro. Hay un pequeño aparcamiento en la entrada. El acceso a pie desde Cala Major es posible (30 min) pero con cuesta. | 2 |
| link-pmi-soller-1 | pmi-card-soller | https://trendesoller.com/en/buy-tickets | Comprar billetes del Tren de Sóller | RESERVAR ONLINE CON ANTELACIÓN. El tren tiene capacidad limitada y se agota con días de antelación en temporada alta. Ida y vuelta €30. El horario de salida más popular es el de las 10:40 desde Palma. | 1 |
| link-pmi-soller-2 | pmi-card-soller | https://maps.app.goo.gl/jJrYU6B9gQ5hspqH7 | Estación de Palma — Google Maps | La estación del Tren de Sóller en Palma está en Plaça d'Espanya, junto a la estación de autobuses. Metro o bus hasta Plaça d'Espanya, luego 2 minutos a pie. | 2 |
| link-pmi-soller-3 | pmi-card-soller | https://www.tripadvisor.com/Attraction_Review-g187460-d190587-Reviews-Tren_de_Soller-Palma_de_Mallorca_Majorca_Balearic_Islands.html | Tren de Sóller — TripAdvisor | Reseñas recientes con fotos del recorrido y consejos sobre en qué lado del vagón sentarse para mejor vista (lado derecho saliendo de Palma). Más de 10.000 reseñas. | 3 |
| link-pmi-valldemossa-1 | pmi-card-valldemossa | https://www.cartujadevaldemossa.com | La Cartuja de Valldemossa — web oficial | Entrada €12.50 incluye el concierto de piano con música de Chopin (~10:30h). Aquí vivió Chopin con George Sand en el invierno de 1838-39. Se pueden ver las celdas donde vivieron y el piano original. | 1 |
| link-pmi-valldemossa-2 | pmi-card-valldemossa | https://www.tib.org/en/web/tib/linies-horaris | TIB — horarios bus Palma-Valldemossa | Línea 203, salida desde Palma Intermodal. Consultar horarios actualizados aquí antes de salir. El último bus de regreso suele ser a las 20:00-21:00h. Billete €4-6 ida y vuelta. | 2 |
| link-pmi-mercados-1 | pmi-card-mercados | https://maps.app.goo.gl/FhNXTg47WMiJCXts8 | Mercat de l'Olivar — Google Maps | El mercado más grande de Palma, en el corazón del casco antiguo. Ideal para desayunar tapas y mariscos. Abrir: lun-vie 7-14:30h, sáb 7-15h. Especialidades: quesos mallorquines, sobrasada y ensaimadas. | 1 |
| link-pmi-mercados-2 | pmi-card-mercados | https://maps.app.goo.gl/qzYvqbntGYrdYDRv5 | Mercat de Santa Catalina — Google Maps | Mercado del barrio bohemio de Santa Catalina. Lun-sáb 7-17h. Más pequeño y local que el Olivar. Alrededor del mercado hay cafés y tiendas de producto local con ambiente de barrio. | 2 |
| link-pmi-gastro-1 | pmi-card-gastronomia | https://www.tripadvisor.com/Restaurant_Review-g187460-d950126-Reviews-Ca_n_Joan_de_S_Aigo-Palma_de_Mallorca_Majorca_Balearic_Islands.html | Ca'n Joan de S'Aigo — TripAdvisor | La pastelería más antigua de Palma (desde 1700). Famosa por sus ensaimadas, chocolate caliente y helados artesanales. Colas habituales los fines de semana — llegar temprano o entre semana. | 1 |
| link-pmi-gastro-2 | pmi-card-gastronomia | https://www.tripadvisor.com/Restaurants-g187460-Palma_de_Mallorca_Majorca_Balearic_Islands.html | Restaurantes en Palma — TripAdvisor | Lista filtrable de restaurantes con fotos y reseñas recientes. Filtrar por "mariscos" o "cocina mallorquina" para encontrar los más auténticos. Reservar siempre con antelación en temporada alta. | 2 |
| link-par-eiffel-1 | par-card-eiffel | https://ticket.toureiffel.paris/en | Reservar entradas Torre Eiffel | RESERVAR CON 60+ DÍAS DE ANTELACIÓN. La demanda es enorme y todas las franjas se agotan. Elegir entre acceso a planta 1+2 (€14) o con acceso a la cima (€29-35). El ascensor para la cima requiere reserva separada. | 1 |
| link-par-eiffel-2 | par-card-eiffel | https://maps.app.goo.gl/3WRanFRQq6L1Bhzn8 | Torre Eiffel — Google Maps | Metro L6 (Bir-Hakeim) o RER C (Champ de Mars). Trocadéro (M° L9) da la mejor vista frontal para fotos. El Champ de Mars (jardín frente a la torre) es gratuito y perfecto para ver el espectáculo de luces nocturno. | 2 |
| link-par-eiffel-3 | par-card-eiffel | https://www.toureiffel.paris/en/the-monument/history | Historia y datos de la torre | Web oficial con información sobre la construcción (1887-1889), datos técnicos y programación cultural actual. Incluye el calendario del espectáculo de luces (cada hora desde el anochecer hasta medianoche). | 3 |
| link-par-orsay-1 | par-card-orsay | https://www.musee-orsay.fr/en/visit/practical-information/tickets | Comprar entradas Musée d'Orsay | Entrada €16, reservar online para evitar cola de hasta 45 minutos en temporada alta. Los jueves el museo abre hasta las 21:45h con menos afluencia. Gratuito para menores de 18 años y el primer domingo de cada mes. | 1 |
| link-par-orsay-2 | par-card-orsay | https://maps.app.goo.gl/U3RSmZ64JqJiqx6z9 | Cómo llegar — Google Maps | RER C (Musée d'Orsay) o Metro L12 (Solférino). A 15 minutos a pie desde el Louvre cruzando el río. Combinación habitual: visitar el Orsay y caminar hasta Notre-Dame por la orilla izquierda. | 2 |
| link-par-orsay-3 | par-card-orsay | https://www.musee-orsay.fr/en/exhibitions | Exposiciones temporales actuales | Programación actualizada de exposiciones. Para 2026 se esperan varias exposiciones temáticas sobre impresionismo. Comprobar antes del viaje qué exposición está activa para no perdérsela. | 3 |
| link-par-notredame-1 | par-card-notre-dame | https://www.notredamedeparis.fr/en/visit/practical-information | Reservar visita Notre-Dame | La entrada es gratuita pero requiere reserva de horario. Las plazas se agotan con días de antelación. La catedral fue reinaugurada en diciembre 2024 tras 5 años de restauración — visita muy recomendada. | 1 |
| link-par-notredame-2 | par-card-notre-dame | https://maps.app.goo.gl/DxBJPdmCgRCJPMN68 | Notre-Dame — Google Maps | Metro L4 (Cité) o RER B/C/D (Saint-Michel - Notre-Dame). La Île de la Cité también tiene la Sainte-Chapelle (€13) a 5 minutos a pie, ideal para combinar en la misma visita. | 2 |
| link-par-montmartre-1 | par-card-montmartre | https://www.sacre-coeur-montmartre.com/english | Sacré-Cœur — web oficial | La basílica es de acceso gratuito. La cúpula (€6, 300 escalones) ofrece la mejor vista de París. Horario: 6:00-22:30h. El funicular sube desde M° Anvers (válido con billete de metro). | 1 |
| link-par-montmartre-2 | par-card-montmartre | https://maps.app.goo.gl/xFz8Jvma2UBsLa4u9 | Montmartre — Google Maps | Metro L12 (Abbesses, con ascensor) es la parada más cómoda. La subida a pie desde M° Anvers tiene escaleras pero pasa por el funicular. La Place du Tertre (artistas en vivo) está a 3 minutos de la basílica. | 2 |
| link-par-montmartre-3 | par-card-montmartre | https://www.tripadvisor.com/Attraction_Review-g187147-d188540-Reviews-Montmartre-Paris_Ile_de_France.html | Montmartre — TripAdvisor | Consejos de otros viajeros sobre el mejor momento para visitar (mañanas entre semana), los cafés más pintorescos (La Maison Rose, Le Consulat) y cómo evitar las trampas para turistas de Place du Tertre. | 3 |
| link-par-comida-1 | par-card-comida | https://www.bouillon-chartier.com/en/ | Bouillon Chartier — reservas | El restaurante histórico de París desde 1896. Menú de 3 platos ~€20-25. No acepta reservas (cola en la puerta), llegar 15 minutos antes de la apertura (11:30h almuerzo, 18:00h cena). La espera suele ser de 20-30 minutos. | 1 |
| link-par-comida-2 | par-card-comida | https://www.tripadvisor.com/Restaurant_Review-g187147-d718557-Reviews-Du_Pain_et_Des_Idees-Paris_Ile_de_France.html | Du Pain et Des Idées — TripAdvisor | Considerada la mejor panadería de París. Abrir mar-vie 7:00-20:00h, cerrada lun y fin de semana. Los escargots de croissant y los pains aux raisins se agotan antes de las 10:00. Metro L3 (République) o L8 (République). | 2 |
| link-par-museumpass-1 | par-card-museum-pass | https://en.parismuseumpass.com | Comprar Paris Museum Pass | Pase de 2 días €65, 4 días €80. Incluye más de 50 museos y monumentos: Louvre, Orsay, Arco del Triunfo, Sainte-Chapelle, Versalles. Importante: aun con el pase hay que reservar horario para el Louvre y Versalles. | 1 |
| link-par-museumpass-2 | par-card-museum-pass | https://www.louvre.fr/en/visit-the-louvre/practical-information/buy-your-ticket | Louvre — reservar entrada / horario | Entrada incluida con Museum Pass pero el horario debe reservarse por separado en la web del Louvre. Sin reserva de horario no se puede entrar aunque tengas el pase. Miércoles y viernes abre hasta las 21:45h. | 2 |
| link-par-transporte-1 | par-card-transporte | https://www.ratp.fr/en/titres-et-tarifs | RATP — tarifas y títulos de transporte | Web oficial de la red de transporte parisina. Tiene calculadora de rutas, precios actualizados y mapa de metro descargable. Desde 2021 se puede usar la tarjeta bancaria contactless directamente en torniquetes. | 1 |
| link-par-transporte-2 | par-card-transporte | https://maps.app.goo.gl/H6MvxFbDqaRfbkmW6 | Mapa del metro de París — Google Maps | El metro de París tiene 16 líneas. Las más útiles para los sitios del viaje: L1 (Louvre, Champs-Élysées), L4 (Notre-Dame, Saint-Germain), L6 (Torre Eiffel), L9 (Trocadéro), L12 (Orsay, Montmartre). | 2 |
| link-rom-coliseo-1 | rom-card-coliseo | https://www.colosseo.it/en/tickets/ | Comprar entradas Coliseo | RESERVAR CON 30+ DÍAS DE ANTELACIÓN. Entrada combinada €18 válida 24 horas (Coliseo + Foro Romano + Palatino). Sin reserva la espera puede ser de 3-4 horas. El acceso al Coliseo Arena (suelo de madera) cuesta €22 y también requiere reserva. | 1 |
| link-rom-coliseo-2 | rom-card-coliseo | https://maps.app.goo.gl/SX85F5CqPEiJLMsN9 | Coliseo — Google Maps | Metro B (Colosseo). La entrada principal está en Via Sacra. El Foro Romano tiene acceso incluido con la misma entrada por Via Sacra o por Via dei Fori Imperiali. Llevar agua — hay largas esperas al sol en verano. | 2 |
| link-rom-coliseo-3 | rom-card-coliseo | https://www.tripadvisor.com/Attraction_Review-g187791-d190420-Reviews-Colosseum-Rome_Lazio.html | Coliseo — TripAdvisor | Más de 200.000 reseñas con consejos sobre la mejor hora para visitar (temprano a las 9:00 o al atardecer), qué incluye la entrada y cómo orientarse dentro del complejo arqueológico. | 3 |
| link-rom-vaticano-1 | rom-card-vaticano | https://www.museivaticani.va/content/museivaticani/en/informazioni-e-contatti/biglietteria.html | Reservar entradas Museos Vaticanos | RESERVAR CON 60+ DÍAS DE ANTELACIÓN. Entrada €20, skip-the-line €27. Las entradas para las franjas de mañana son las primeras en agotarse. CÓDIGO DE VESTIMENTA OBLIGATORIO: hombros y rodillas cubiertos — guardan ropa en la entrada para quienes no cumplen. | 1 |
| link-rom-vaticano-2 | rom-card-vaticano | https://maps.app.goo.gl/J4JfFhqR2AqNaXEm7 | Museos Vaticanos — Google Maps | Metro A (Ottaviano - San Pietro). La entrada a los Museos está en Viale Vaticano, NO en la Plaza de San Pedro. Desde la plaza hasta la entrada de los museos son 15 minutos a pie rodeando la muralla vaticana. | 2 |
| link-rom-vaticano-3 | rom-card-vaticano | https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/cappella-sistina.html | Capilla Sixtina — guía oficial | La Capilla Sixtina está al final del recorrido de los museos. No se permite fotografía (aunque se hace de forma habitual). El fresco del techo de Miguel Ángel tardó 4 años en pintarse (1508-1512). Llevar prismáticos compactos para ver los detalles del techo. | 3 |
| link-rom-sanpedro-1 | rom-card-san-pedro | https://www.basilicasanpietro.va/en/visite/visit-the-basilica.html | Basílica de San Pedro — información oficial | Entrada gratuita sin reserva. La cúpula se puede subir a pie (551 escalones, €8) o con ascensor parcial + escalones (€10). La Pietà de Miguel Ángel está en la primera capilla a la derecha al entrar. Mismo horario y código de vestimenta que los museos. | 1 |
| link-rom-sanpedro-2 | rom-card-san-pedro | https://maps.app.goo.gl/aJSk4DRSPFRDhkVj9 | Plaza de San Pedro — Google Maps | Metro A (Ottaviano) + 15 min a pie o bus 40/64 desde el centro. La plaza es espectacular vista desde la cúpula. Las audiencias papales del miércoles a las 10:00 son gratuitas (requieren entrada gratuita solicitada con antelación al Vaticano). | 2 |
| link-rom-panteon-1 | rom-card-panteon | https://www.pantheonroma.com/en/visit/ | Panteón — entradas y horarios | Entrada €5. No requiere reserva previa. Horario: 9:00-19:00h todos los días. Los domingos a las 10:30h hay misa (acceso gratuito pero limitado). El edificio romano mejor conservado del mundo, con 1.900 años de historia. | 1 |
| link-rom-panteon-2 | rom-card-panteon | https://maps.app.goo.gl/SgW2kKKYXr4pjLXq7 | Panteón — Google Maps | En la Piazza della Rotonda, a 5 minutos de Piazza Navona. Metro A (Spagna o Barberini) + 20 min a pie, o bus desde el centro. El mejor momento para ver el óculo iluminado es a mediodía (la luz cae verticalmente). | 2 |
| link-rom-trastevere-1 | rom-card-trastevere | https://maps.app.goo.gl/7X9dJRJE2PFAvyeh8 | Trastevere — Google Maps | Sin metro directo: bus 8 desde Largo Argentina (10 min) o a pie desde el Vaticano (30 min). El corazón del barrio es Piazza di Santa Maria in Trastevere. Para cenar sin reserva: Trattoria da Augusto (llegar 19-20h, colas cortas). | 1 |
| link-rom-trastevere-2 | rom-card-trastevere | https://www.tripadvisor.com/Restaurant_Review-g187791-d1064688-Reviews-Taverna_Trilussa-Rome_Lazio.html | Taverna Trilussa — TripAdvisor | Uno de los mejores restaurantes de cocina romana tradicional en Trastevere. Reservar con 3-5 días de antelación para cena. Especialidades: cacio e pepe, carbonara, coda alla vaccinara. Precio medio €30-40 por persona. | 2 |
| link-rom-transporte-1 | rom-card-transporte | https://www.atac.roma.it/en/ | ATAC — transporte público de Roma | Web oficial con mapa de metro, rutas de bus y tarifas actualizadas. El billete individual cuesta €1.50 y es válido 100 minutos. El abono diario cuesta €7. Comprar en estancos (tabaccherie) o máquinas de metro para evitar el suplemento por compra a bordo. | 1 |
| link-rom-transporte-2 | rom-card-transporte | https://www.trenitalia.com/en/html/trenitalia/Leonardo_express.html | Leonardo Express — tren FCO-Termini | El tren más rápido y cómodo al aeropuerto Fiumicino: €14, 32 minutos directos desde Roma Termini. Sale cada 30 minutos. Comprar el billete online o en máquinas de la estación con antelación para no perder el tren. | 2 |
| link-rom-nasoni-1 | rom-card-nasoni | https://maps.app.goo.gl/search/nasoni+Roma | Nasoni en Google Maps | Buscar "nasoni" en Google Maps muestra las fuentes de agua potable más cercanas. También hay apps específicas como "Nasoni di Roma". El agua de las fuentes viene de acueductos de montaña y es segura para beber directamente. | 1 |
| link-rom-nasoni-2 | rom-card-nasoni | https://www.acea.it/en/customer-care/water/drinking-water | ACEA — calidad del agua en Roma | Información oficial sobre la calidad del agua potable en Roma, incluyendo las fuentes públicas. Confirma que el agua de las fuentes nasoni supera los estándares de calidad europeos. Llevar botella reutilizable y ahorrar en botellas de plástico. | 2 |

## `map_pois` (10 rows)

```sql
CREATE TABLE map_pois (
  id      TEXT PRIMARY KEY,
  name    TEXT NOT NULL,
  type    TEXT NOT NULL CHECK(type IN ('city','excursion')),
  lat     REAL NOT NULL,
  lon     REAL NOT NULL,
  color   TEXT NOT NULL DEFAULT '#64748b',
  city_id TEXT REFERENCES cities(id)
)
```

| id | name | type | lat | lon | color | city_id |
| --- | --- | --- | --- | --- | --- | --- |
| mad | Madrid | city | 40.4168 | -3.7038 | #e8a74e | mad |
| bcn | Barcelona | city | 41.3874 | 2.1686 | #e07b5a | bcn |
| par | París | city | 48.8566 | 2.3522 | #7e8cc4 | par |
| rom | Roma | city | 41.9028 | 12.4964 | #c27ba0 | rom |
| pmi | Palma de Mallorca | city | 39.5696 | 2.6502 | #f59e0b | pmi |
| scl | Santiago | excursion | -33.4489 | -70.6693 | #64748b | NULL |
| eze | Buenos Aires | excursion | -34.8222 | -58.5358 | #64748b | NULL |
| muc | Múnich | excursion | 48.1351 | 11.582 | #64748b | NULL |
| pmm | Palma de Mallorca | excursion | 39.5696 | 2.6502 | #64748b | NULL |
| mxp | Milán | excursion | 45.4654 | 9.1859 | #64748b | NULL |

## `map_routes` (7 rows)

```sql
CREATE TABLE map_routes (
  sku        TEXT PRIMARY KEY,
  from_poi   TEXT NOT NULL REFERENCES map_pois(id),
  to_poi     TEXT NOT NULL REFERENCES map_pois(id),
  mode       TEXT NOT NULL CHECK(mode IN ('flight','train','daytrip','ferry')),
  waypoints  TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

| sku | from_poi | to_poi | mode | waypoints | created_at |
| --- | --- | --- | --- | --- | --- |
| mad-bcn | mad | bcn | train | [[40.4065,-3.6893],[40.6337,-3.1664],[41.3527,-1.6432],[41.6592,-0.9108],[41.6148,0.6302],[41.1950,1.2447],[41.3874,2.1686]] | 2026-04-12 05:45:50 |
| scl-mad | scl | mad | flight | [[-33.4489, -70.6693], [-32.3038, -69.3317], [-31.1449, -68.0277], [-29.9732, -66.7553], [-28.7896, -65.5128], [-27.5949, -64.2983], [-26.3898, -63.1101], [-25.1751, -61.9465], [-23.9515, -60.806], [-22.7196, -59.687], [-21.4801, -58.588], [-20.2335, -57.5077], [-18.9805, -56.4445], [-17.7214, -55.3973], [-16.4569, -54.3647], [-15.1873, -53.3455], [-13.9133, -52.3386], [-12.6352, -51.3427], [-11.3534, -50.3567], [-10.0683, -49.3795], [-8.7805, -48.4101], [-7.4901, -47.4474], [-6.1977, -46.4904], [-4.9036, -45.5381], [-3.6081, -44.5895], [-2.3116, -43.6436], [-1.0146, -42.6994], [0.2828, -41.7559], [1.5801, -40.8123], [2.8769, -39.8675], [4.173, -38.9205], [5.4679, -37.9704], [6.7613, -37.0161], [8.0529, -36.0568], [9.3422, -35.0913], [10.6289, -34.1186], [11.9126, -33.1378], [13.1928, -32.1476], [14.4692, -31.147], [15.7414, -30.1348], [17.0088, -29.11], [18.271, -28.0712], [19.5275, -27.0172], [20.7778, -25.9467], [22.0214, -24.8584], [23.2576, -23.7508], [24.486, -22.6226], [25.7058, -21.4723], [26.9164, -20.2982], [28.117, -19.0987], [29.307, -17.8722], [30.4855, -16.6169], [31.6517, -15.331], [32.8047, -14.0125], [33.9435, -12.6597], [35.0672, -11.2704], [36.1745, -9.8426], [37.2644, -8.3742], [38.3356, -6.8631], [39.3869, -5.307], [40.4168, -3.7038]] | 2026-04-12 05:46:37 |
| rom-eze | rom | eze | flight | [[41.9028, 12.4964], [40.8614, 10.7469], [39.7944, 9.0523], [38.7034, 7.41], [37.5902, 5.8176], [36.4563, 4.2725], [35.303, 2.7723], [34.1317, 1.3146], [32.9437, -0.1029], [31.7401, -1.4826], [30.522, -2.8267], [29.2904, -4.1374], [28.0464, -5.4167], [26.7908, -6.6665], [25.5244, -7.8889], [24.2481, -9.0857], [22.9627, -10.2586], [21.6688, -11.4093], [20.3671, -12.5395], [19.0582, -13.6507], [17.7428, -14.7445], [16.4215, -15.8223], [15.0947, -16.8856], [13.763, -17.9356], [12.4269, -18.9736], [11.0869, -20.0011], [9.7434, -21.0192], [8.397, -22.0291], [7.048, -23.032], [5.6969, -24.029], [4.3441, -25.0214], [2.9899, -26.0103], [1.6349, -26.9967], [0.2795, -27.9817], [-1.0761, -28.9666], [-2.4314, -29.9523], [-3.7859, -30.94], [-5.1393, -31.9308], [-6.4912, -32.9258], [-7.8411, -33.9262], [-9.1886, -34.933], [-10.5334, -35.9476], [-11.8749, -36.971], [-13.2126, -38.0046], [-14.5462, -39.0495], [-15.8751, -40.1071], [-17.1987, -41.1787], [-18.5167, -42.2658], [-19.8283, -43.3696], [-21.133, -44.4918], [-22.4302, -45.6339], [-23.7192, -46.7974], [-24.9994, -47.9842], [-26.2699, -49.1958], [-27.53, -50.4341], [-28.779, -51.701], [-30.0158, -52.9984], [-31.2395, -54.3285], [-32.4493, -55.6933], [-33.6439, -57.0949], [-34.8222, -58.5358]] | 2026-04-12 05:46:37 |
| rom-mad | rom | mad | flight | [[41.9028, 12.4964], [41.8924, 12.0257], [41.88, 11.5551], [41.8657, 11.0848], [41.8495, 10.6147], [41.8314, 10.1448], [41.8114, 9.6752], [41.7895, 9.2059], [41.7656, 8.737], [41.7399, 8.2684], [41.7122, 7.8002], [41.6827, 7.3324], [41.6512, 6.8651], [41.6179, 6.3982], [41.5827, 5.9319], [41.5456, 5.466], [41.5066, 5.0007], [41.4657, 4.536], [41.423, 4.0719], [41.3784, 3.6084], [41.332, 3.1455], [41.2837, 2.6833], [41.2336, 2.2218], [41.1816, 1.7611], [41.1278, 1.301], [41.0721, 0.8418], [41.0147, 0.3833], [40.9554, -0.0743], [40.8943, -0.5312], [40.8314, -0.9871], [40.7668, -1.4422], [40.7003, -1.8964], [40.6321, -2.3497], [40.5621, -2.802], [40.4903, -3.2534], [40.4168, -3.7038]] | 2026-04-12 07:18:39 |
| bcn-pmi | bcn | pmi | flight | [[41.3874, 2.1686], [41.2966, 2.1933], [41.2057, 2.218], [41.1149, 2.2425], [41.024, 2.267], [40.9331, 2.2915], [40.8423, 2.3158], [40.7514, 2.3401], [40.6605, 2.3644], [40.5696, 2.3886], [40.4787, 2.4127], [40.3879, 2.4367], [40.297, 2.4607], [40.2061, 2.4846], [40.1151, 2.5084], [40.0242, 2.5322], [39.9333, 2.5559], [39.8424, 2.5796], [39.7515, 2.6032], [39.6605, 2.6267], [39.5696, 2.6502]] | 2026-04-12 17:37:15 |
| pmi-par | pmi | par | flight | [[39.5696, 2.6502], [39.8792, 2.6416], [40.1888, 2.633], [40.4983, 2.6243], [40.8079, 2.6155], [41.1175, 2.6066], [41.4271, 2.5977], [41.7366, 2.5886], [42.0462, 2.5795], [42.3558, 2.5703], [42.6653, 2.561], [42.9749, 2.5516], [43.2845, 2.5421], [43.5941, 2.5325], [43.9036, 2.5228], [44.2132, 2.513], [44.5228, 2.5031], [44.8323, 2.4931], [45.1419, 2.4829], [45.4515, 2.4727], [45.761, 2.4624], [46.0706, 2.4519], [46.3801, 2.4414], [46.6897, 2.4307], [46.9993, 2.4198], [47.3088, 2.4089], [47.6184, 2.3978], [47.9279, 2.3866], [48.2375, 2.3753], [48.547, 2.3638], [48.8566, 2.3522]] | 2026-04-12 17:37:15 |
| par-rom | par | rom | flight | [[48.8566,2.3522],[48.1,3.8],[47.2,5.3],[46.1,6.9],[44.9,8.5],[43.8,10.0],[43.0,11.2],[42.3,11.9],[41.9028,12.4964]] | 2026-04-12 17:37:52 |

## `photos` (0 rows)

```sql
CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  r2_key TEXT NOT NULL,
  caption TEXT,
  date_taken DATE,
  uploader_note TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

_(empty)_

## `sessions` (0 rows)

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
)
```

_(empty)_

## `access_requests` (0 rows)

```sql
CREATE TABLE access_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
)
```

_(empty)_

---

**Total: 250 filas en 12 tablas**
