-- 0045_fix_westminster_soho_subtype.sql
-- Corrección: traslado Westminster → Soho (May 2) usaba subtype='walking'.
-- El transporte correcto es bus (transporte público). Actualiza también el ícono.

UPDATE events
SET subtype = 'bus',
    icon    = 'pi pi-car'
WHERE id = 'ev-leg-lon-westminster-soho';
