-- Migration 0072: Overlap resolution + transports walking inter-hitos (Wave 2b)
-- Date: 2026-04-17
-- Safety: all targets confirmed=0, type='hito'. Never touches confirmed=1 or type='estadia'.
--
-- =============================================================================
-- PARTE A: OVERLAP RESOLUTION
-- =============================================================================
-- Audit ran detected 6 hito-hito overlaps (confirmed=0) in range Apr 20 - May 10.
-- Decision rule hierarchy:
--   (b) food vs non-food -> keep non-food (meals are flexible)
--   (c) both food        -> keep best slot match
--   (d) profile match    -> arte > music jazz > landscape > spa
--   (e) tiebreak price   -> cheaper wins
--
-- Overlap table:
-- | Date       | Winner                          | Loser / Action                  | Rationale                                      |
-- |------------|----------------------------------|---------------------------------|------------------------------------------------|
-- | 2026-04-25 | ev-bcn-apr25-font-magica (21:00-21:30 GRATIS, unique spectacle) | ev-bcn-apr25-cena SHRINK 20:30-21:00 + retitle "Tapas rapidas" | food vs visit -> tapa rapida pre-spectacle |
-- | 2026-04-30 | ev-pmi-apr30-estrenc (10:00-14:00 leisure beach, anchor)         | ev-pmi-apr30-almuerzo SHIFT 14:00-15:00 | food vs beach anchor -> lunch post-beach |
-- | 2026-05-02 | ev-lon-may02-citytour (11:00-15:00 tour, 38 usd)                 | ev-lon-may02-almuerzo SHIFT 16:00-17:00 (post-bus a Soho) | food vs tour anchor |
-- | 2026-05-02 | ev-lon-may02-denmark (18:00-22:00 bars, pub food included)       | ev-lon-may02-cena DELETE | cena redundante con pub food en bars |
-- | 2026-05-05 | ev-par-may05-almuerzo + ev-par-may05-cena (concrete meals)       | ev-par-may04-tarde SHRINK 14:30-19:30 | vague bucket shrinks around meals |
--
-- SHIFTS (UPDATE timestamp_in/timestamp_out, confirmed=0 gate):

-- 1) Apr 25 BCN: Apr 25 timeline is MNAC 18:00-20:15 -> fontmagica 21:00-21:30 -> metro 21:45 -> jamboree 22:15.
--    The only free slot is 20:30-21:00 (pre-fontmagica) for a quick tapas bite.
--    Shrink cena to 20:30-21:00 (30 min tapa rapida - realistic BCN pre-show).
UPDATE events
SET timestamp_in  = '2026-04-25T20:30:00+02:00',
    timestamp_out = '2026-04-25T21:00:00+02:00',
    title         = 'Tapas rapidas pre-Font Magica',
    description   = 'Tapa rapida en Pl. Espanya antes del espectaculo de la Font Magica (21:00). Cena completa post-Jamboree si hace falta.'
WHERE id = 'ev-bcn-apr25-cena'
  AND confirmed = 0
  AND type = 'hito';

-- 2) Apr 30 PMI: beach Es Trenc 10:00-14:00, coloniastjordi 14:30-17:00.
--    Slot 14:00-14:30 (30 min quick bite post-beach pre-next-leisure).
UPDATE events
SET timestamp_in  = '2026-04-30T14:00:00+02:00',
    timestamp_out = '2026-04-30T14:30:00+02:00',
    description   = 'Bocata rapido / chiringuito en Ses Covetes entre Es Trenc y Colonia St. Jordi.'
WHERE id = 'ev-pmi-apr30-almuerzo'
  AND confirmed = 0
  AND type = 'hito';

-- 3) May 2 LON: city-tour ends 15:00, bus 15:30-16:00 lleva a Soho. Almuerzo 16:00-17:00
--    Late lunch, pub-style, ya en Soho.
UPDATE events
SET timestamp_in  = '2026-05-02T16:00:00+01:00',
    timestamp_out = '2026-05-02T17:00:00+01:00'
WHERE id = 'ev-lon-may02-almuerzo'
  AND confirmed = 0
  AND type = 'hito';

-- 4) May 2 LON: Denmark Street / Soho bars 18:00-22:00 already incluye pub food.
--    Con late lunch 16:00-17:00 post-tour, una cena formal 19:30-20:45 solaparia bars.
--    Decision: DELETE cena (redundante con pub food en bars). Si hace falta mas food,
--    entra dentro del bucket de bars.
DELETE FROM events
WHERE id = 'ev-lon-may02-cena'
  AND confirmed = 0
  AND type = 'hito'
  AND subtype = 'food';

-- 5) May 5 PAR: shrink "París tranquilo · día paseable" bucket to 14:30-19:30
--    (frees slots for almuerzo 13:00-14:30 and cena 20:00-22:00)
UPDATE events
SET timestamp_in  = '2026-05-05T14:30:00+02:00',
    timestamp_out = '2026-05-05T19:30:00+02:00'
WHERE id = 'ev-par-may04-tarde'
  AND confirmed = 0
  AND type = 'hito';

-- =============================================================================
-- PARTE B: WALKING TRANSPORTS BETWEEN NON-CONFIRMED HITOS
-- =============================================================================
-- Audit: the majority of hitos in range Apr 20 - May 10 lack coordinates
-- (origin_lat/origin_lon IS NULL), making Haversine distance calc impossible
-- without guessing. Existing migrations (0058, 0063-0068) already inserted
-- walkings between known-coord hitos (esp. Madrid/BCN). Remaining gaps are
-- either:
--   (a) both endpoints have coords but distance <400m (implicit proximity),
--   (b) one endpoint lacks coords (cannot compute reliably),
--   (c) endpoints start at same time (parallel "rec-*" options, not sequential).
--
-- Conservative decision: no walking traslados inserted in this wave. When
-- hitos gain coords in a future wave, re-run audit for walking inserts.
--
-- Candidates evaluated and skipped:
-- | Date       | Pair                                             | Reason                     |
-- |------------|--------------------------------------------------|----------------------------|
-- | 2026-04-28 | ev-pmi-apr28-pm -> ev-pmi-apr28-ev               | dist <400m (implicit)      |
-- | 2026-04-29 | ev-pmi-apr29-am -> ev-pmi-apr29-rec-mercado      | parallel start 10:00       |
-- | 2026-04-30 | ev-pmi-apr30-am -> ev-pmi-apr30-rec-*            | parallel start 10:00       |
-- | 2026-05-06 | ev-par-may06-louvre -> ev-par-may06-almuerzo     | almuerzo lacks coords      |
-- | 2026-05-07 | ev-rom-may07-am -> ev-rom-may07-almuerzo         | almuerzo lacks coords      |
-- | 2026-05-08 | ev-rom-may08-am -> ev-rom-may08-almuerzo         | almuerzo lacks coords      |
-- | 2026-05-09 | ev-mad-may09-plaza-mayor -> la-latina            | parallel start 20:00 (recs)|
--
-- Nota: metros/bus sin conocer línea se deferran a decisión manual (rectify).
