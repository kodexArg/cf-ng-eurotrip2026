-- 0031_louvre_confirmado_930.sql
-- Confirma el timed-entry del Museo del Louvre para May 6 2026 a las 09:30 CEST.
-- Ajusta timestamp_in (10:00 → 09:30) y marca confirmed=1.
-- Contexto: entrada comprada en ticket.louvre.fr · €22 pp · no residente EEE (ver 0028).

UPDATE events
  SET timestamp_in = '2026-05-06T09:30:00+02:00',
      timestamp_out= '2026-05-06T13:00:00+02:00',
      confirmed    = 1,
      description  = 'Museo del Louvre — miércoles May 6 · timed-entry 09:30 CEST · salida ~13:00',
      notes        = 'Entrada confirmada ticket.louvre.fr · timed-entry 09:30 CEST · categoría No residente EEE · 1 entrada · €22 pp · imperdibles: Mona Lisa · Venus de Milo · Victoria de Samotracia · Apartamentos Napoleón III · desde hotel: metro línea 1 (Palais Royal–Musée du Louvre) · salida Louvre ~13:00 → Pyramides M14 → ORY · vuelo EJU4957 ORY 16:20 → FCO 18:35'
  WHERE id = 'ev-par-may06-louvre';
