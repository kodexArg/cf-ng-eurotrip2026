-- 0071_mandatory_flag.sql
-- Nueva categoría "obligado" (mandatory): similar a confirmed pero distinta semántica.
-- - confirmed=1 → reserva real ya hecha/pagada (tilde verde)
-- - mandatory=1 → debe ocurrir sí o sí, falta concretar/pagar (candadito gris)
-- - ambas false → sugerencia (lamparita, oculto por defecto)
--
-- Se muestra SIEMPRE (incluso con la lamparita apagada).
-- Política inicial: TODO traslado aún no confirmado pasa a mandatory=1.
-- Justificación: los transportes alrededor de eventos confirmados son obligatorios
-- por construcción (excepto los ya pagados). Hito-recomendaciones quedan como están.

ALTER TABLE events ADD COLUMN mandatory INTEGER NOT NULL DEFAULT 0;

-- Todo traslado no confirmado → obligado
UPDATE events
SET mandatory = 1
WHERE type = 'traslado'
  AND confirmed = 0;
