-- 0070_valorizar_todo_pendiente.sql
-- Valoriza TODOS los eventos con usd=NULL: estimación realista o 0 explícito (gratis).
-- Política: "$0" significa GRATIS (frontend lo muestra como "gratis"); "NULL" = sin valuar (no debe quedar ninguno).
--
-- Conversión usada: EUR 1 ≈ USD 1.087 · GBP 1 ≈ USD 1.27
-- Fuentes web verificadas donde fue posible; los flights de Iberia y AVE Renfe usan estimación
-- de mercado por bloqueos anti-bot en scraping (documentado en notes).
--
-- Cleanup secundario: borra 3 eventos huérfanos Apr 23 toledo-* (stale del seed legacy,
-- ese día ya está cubierto por Reina Sofía + Thyssen + jam jazz tras 0066/0068).

-- ─────────────────────────────────────────────────────────────────────
-- 0. CLEANUP: stale Apr 23 toledo-* (Toledo es Apr 22, no Apr 23)
-- ─────────────────────────────────────────────────────────────────────

DELETE FROM events WHERE id IN (
  'ev-mad-apr23-toledo-catedral',
  'ev-mad-apr23-toledo-tren',
  'ev-mad-apr23-toledo-almuerzo'
);

-- ─────────────────────────────────────────────────────────────────────
-- 1. WALKINGS y leisure 100% gratis (usd=0 explícito)
-- ─────────────────────────────────────────────────────────────────────

UPDATE events SET usd = 0 WHERE id IN (
  'ev-leg-mad-apr20-caminata',
  'ev-tol-apr22-caminata-prado',
  'ev-mad-apr23-caminata-thyssen-atocha',
  'ev-tol-apr22-llegada',
  -- Barrios y miradores libres
  'ev-bcn-apr24-boqueria',
  'ev-bcn-apr24-gotico',
  'ev-bcn-apr25-gracia',
  'ev-bcn-apr25-feria',
  'ev-pmi-apr28-pm',
  'ev-pmi-apr28-ev',
  'ev-pmi-apr28-rec-tapas',
  'ev-pmi-apr29-rec-mercado',
  'ev-pmi-apr29-pm',
  'ev-pmi-apr29-ev',
  'ev-pmi-apr30-rec-capas',
  'ev-pmi-apr30-pm',
  'ev-pmi-apr30-rec-deia',
  'ev-pmi-apr30-rec-soller-mirador',
  'ev-pmi-apr30-ev',
  'ev-pmi-may01-rec-naranjas',
  'ev-pmi-may01-pm',
  'ev-pmi-may01-rec-uv-snack',
  'ev-pmi-may01-ev',
  'ev-rom-may06-pm',
  'ev-rom-may08-pm',
  'ev-rom-may09-am',
  'ev-mad-may09-noche-gran-via',
  'ev-mad-may09-noche-plaza-mayor',
  'ev-par-may04-tarde',
  -- Atracciones gratis confirmadas (notes lo indican)
  'ev-lon-may04-minalima',     -- House of MinaLima · gratis
  'ev-lon-may04-skygarden'     -- Sky Garden · reserva gratuita
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. METRO/BUS/TRENES URBANOS (€ exactos)
-- ─────────────────────────────────────────────────────────────────────

-- Metro Madrid €1.50 pp ZonaA → €3.00 total = USD 3.26
UPDATE events SET usd = 3.26 WHERE id IN (
  'ev-tol-apr22-metro-ida',
  'ev-mad-apr22-metro-prado-sol'
);

-- Metro L8 Nuevos Ministerios ↔ T4 (suplemento aeropuerto) €5 pp = €10 total = USD 10.87
UPDATE events SET usd = 10.87 WHERE id IN (
  'ev-mad-may09-noche-regreso-t4',
  'ev-mad-may09-noche-llegada'
);

-- Bus urbano Toledo L5 €1.40 pp = €2.80 total = USD 3.04
UPDATE events SET usd = 3.04 WHERE id = 'ev-tol-apr22-bus-l5';

-- ─────────────────────────────────────────────────────────────────────
-- 3. RENFE AVANT Madrid ↔ Toledo (RT €36 total cargado en ida)
-- ─────────────────────────────────────────────────────────────────────

UPDATE events SET usd = 39.13 WHERE id = 'ev-tol-apr22-avant-ida';   -- €18 pp RT × 2 = €36
UPDATE events SET usd = 0     WHERE id = 'ev-tol-apr22-avant-vuelta'; -- incluido en ida (RT)

-- ─────────────────────────────────────────────────────────────────────
-- 4. AVE Madrid → Barcelona Sants (Apr 24, mañana, 2 pax Turista)
--    Estimación €70 pp típica viernes mañana = €140 total = USD 152.18
--    (Renfe.com bloqueó scraping; valor de mercado shoulder season)
-- ─────────────────────────────────────────────────────────────────────

UPDATE events SET usd = 152.18 WHERE id = 'ev-leg-mad-bcn';

-- ─────────────────────────────────────────────────────────────────────
-- 5. SAGRADA FAMÍLIA (Acceso básico + Torre del Nacimiento)
--    Verificado en sagradafamilia.org/en/prices: €36 pp = €72 total = USD 78.26
--    Hay duplicado: ev-bcn-act-apr27-sagrada (activity) + ev-bk-sagrada (booking).
--    Cargo el precio en el booking (canónico) y dejo 0 en la activity para no doblar.
-- ─────────────────────────────────────────────────────────────────────

UPDATE events SET usd = 78.26 WHERE id = 'ev-bk-sagrada';
UPDATE events SET usd = 0     WHERE id = 'ev-bcn-act-apr27-sagrada';

-- ─────────────────────────────────────────────────────────────────────
-- 6. COMIDAS Y BARES (estimación realista por 2 pax)
-- ─────────────────────────────────────────────────────────────────────

UPDATE events SET usd = 39.13 WHERE id = 'ev-mad-apr23-cena-despedida';   -- cena ligera €18 pp
UPDATE events SET usd = 39.13 WHERE id = 'ev-bcn-apr24-born-vermut';      -- vermut+tapas €18 pp
UPDATE events SET usd = 65.22 WHERE id = 'ev-pmi-apr28-rec-celler';       -- Celler Sa Premsa €30 pp
UPDATE events SET usd = 17.39 WHERE id = 'ev-pmi-apr29-rec-cafe-catedral';-- café+ensaimada €8 pp
UPDATE events SET usd = 26.09 WHERE id = 'ev-pmi-apr29-rec-rooftop';      -- cocktail €12 pp
UPDATE events SET usd = 32.61 WHERE id = 'ev-rom-may06-ev';               -- cena Monti €15 pp
UPDATE events SET usd = 32.61 WHERE id = 'ev-rom-may07-pm';               -- almuerzo Prati €15 pp
UPDATE events SET usd = 39.13 WHERE id = 'ev-rom-may07-ev';               -- cena Trastevere €18 pp
UPDATE events SET usd = 43.48 WHERE id = 'ev-rom-may08-ev';               -- cena Ghetto €20 pp
UPDATE events SET usd = 54.35 WHERE id = 'ev-mad-may09-noche-cena';       -- cena tardía €25 pp
UPDATE events SET usd = 43.48 WHERE id = 'ev-mad-may09-noche-la-latina';  -- vinos+tapas €20 pp

-- ─────────────────────────────────────────────────────────────────────
-- 7. ENTRADAS Y EXCURSIONES MALLORCA + ROMA (entradas oficiales)
-- ─────────────────────────────────────────────────────────────────────

-- Catedral La Seu Palma €9 pp × 2 = €18 = USD 19.57
UPDATE events SET usd = 19.57 WHERE id = 'ev-pmi-apr29-am';

-- Valldemossa: Bus 203 €4.50 RT pp + Cartuja €11 pp → €31 pax × 2 = €62 = USD 67.39
UPDATE events SET usd = 67.39 WHERE id = 'ev-pmi-apr30-am';

-- Sóller day-trip: Bus 204 €5 RT + tranvía €8 OW + lunch €25 pp → €38 pp × 2 = €76 = USD 82.61
UPDATE events SET usd = 82.61 WHERE id = 'ev-pmi-may01-am';

-- Kayak Port de Sóller €20/h pp × 2 = €40 = USD 43.48
UPDATE events SET usd = 43.48 WHERE id = 'ev-pmi-may01-rec-kayak';

-- Colosseo + Foro + Palatino combinada €24 pp × 2 = €48 = USD 52.17
UPDATE events SET usd = 52.17 WHERE id = 'ev-rom-may06-am';

-- Musei Vaticani + Sistina €25 pp × 2 = €50 = USD 54.35
UPDATE events SET usd = 54.35 WHERE id = 'ev-rom-may07-am';

-- Galleria Borghese €20 pp × 2 = €40 = USD 43.48
UPDATE events SET usd = 43.48 WHERE id = 'ev-rom-may08-am';

-- ─────────────────────────────────────────────────────────────────────
-- 8. LONDRES: ABBA Voyage + Soho bars
-- ─────────────────────────────────────────────────────────────────────

-- Soho/Denmark St pubs · ~£12 pp × 2 = £24 = USD 30.48
UPDATE events SET usd = 30.48 WHERE id = 'ev-lon-may02-denmark';

-- ABBA Voyage Dance Floor estándar £56 pp × 2 = £112 = USD 142.24
-- (sitio oficial usa pricing dinámico, valor mid-range Dance Floor)
UPDATE events SET usd = 142.24 WHERE id = 'ev-lon-may04-abba';

-- ─────────────────────────────────────────────────────────────────────
-- 9. LEONARDO EXPRESS Roma Termini → FCO (regreso al aeropuerto)
--    €14 pp × 2 = €28 = USD 30.44 (mismo precio que el outbound ya cargado)
-- ─────────────────────────────────────────────────────────────────────

UPDATE events SET usd = 30.44 WHERE id = 'ev-rom-may09-pm';

-- ─────────────────────────────────────────────────────────────────────
-- 10. VUELOS IBERIA REGRESO (estimación: posible ya incluido en RT IB SCL-MAD $1609)
--     Marco con valor estimado de mercado · si están en el RT principal, ajustar a 0.
-- ─────────────────────────────────────────────────────────────────────

-- IB0656 FCO → MAD intra-Europe OW · €120 pp × 2 = €240 = USD 260.87
UPDATE events SET usd = 260.87 WHERE id = 'ev-leg-fco-mad';

-- IB0105 MAD → EZE long-haul OW economy · €600 pp × 2 = €1200 = USD 1304.35
UPDATE events SET usd = 1304.35 WHERE id = 'ev-leg-mad-eze';

-- ─────────────────────────────────────────────────────────────────────
-- 11. HOTELES sin valuar
-- ─────────────────────────────────────────────────────────────────────

-- Hotel Diego de Almagro Pudahuel · 1 noche tránsito · ~CLP 80k = USD 85
UPDATE events SET usd = 85.00 WHERE id = '3de5f213-152b-41de-b891-09ce0969b8b4';

-- Alojamiento Roma 3 noches · placeholder mid-range (Trastevere/Monti)
-- ~€110/noche × 3 = €330 = USD 358.71 (similar a Londres $320 / Mallorca $428)
UPDATE events SET usd = 358.71 WHERE id = 'ev-stay-auto-rom';
