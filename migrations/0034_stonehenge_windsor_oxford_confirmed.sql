-- 0034_stonehenge_windsor_oxford_confirmed.sql
-- Tour Windsor Castle + Stonehenge + Oxford confirmado · May 3 2026
-- Booking: Viator ref 1385295633 · Confirmation 1767904005
-- USD $303.38 / 2 adultos (~$151.69 pp) · Spanish-language tour

UPDATE events SET
  title        = 'Windsor · Stonehenge · Oxford — excursión día completo',
  description  = 'Tour organizado desde Londres: Windsor Castle → Stonehenge → Oxford. Spanish language. ~11h puerta a puerta.',
  confirmed    = 1,
  notes        = 'Confirmado. Viator ref: 1385295633 · Confirmation: 1767904005. USD $303.38 / 2 adultos (~$151.69 pp). Incluye: entrada Stonehenge, walking tour Oxford, coach con WiFi/USB. Salida ~08:00 desde central Londres, regreso ~19:00. Spanish-language tour.'
WHERE id = 'ev-lon-may03-stonehenge';
