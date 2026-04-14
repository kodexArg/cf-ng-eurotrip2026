-- 0028_louvre_ticket_datos.sql
-- Actualiza el hito Museo del Louvre (ev-par-may06-louvre) con datos reales
-- extraídos de la pantalla de selección en ticket.louvre.fr (captura Apr 14 2026).
--
-- Datos visibles en la captura:
--   · Categoría seleccionada: "NO NACIONALES Y NO RESIDENTES DEL EEE"
--   · Precio: €22 por persona
--   · Cantidad: 1 entrada
--   · Fecha: May 6 2026 (ya registrada en el hito)
--   · Hora de entrada: NO visible en pantalla de selección (timed-entry aún no asignado)
--
-- Estado: confirmed=0 — la captura es la pantalla de SELECCIÓN, no la confirmación
-- de compra. Actualizar a confirmed=1 cuando llegue el email de confirmación.

UPDATE events
  SET usd          = 22,
      notes        = 'Entrada comprada online en ticket.louvre.fr · categoría: No residente EEE · 1 entrada · €22 pp · hora de entrada timed-entry pendiente confirmar en email · imperdibles: Mona Lisa · Venus de Milo · Victoria de Samotracia · Apartamentos Napoleón III · desde hotel: metro línea 1 (Palais Royal–Musée du Louvre) · salida Louvre ~13:00 → Pyramides M14 → ORY · vuelo EJU4957 ORY 16:20 → FCO 18:35',
      confirmed     = 0
  WHERE id = 'ev-par-may06-louvre';
