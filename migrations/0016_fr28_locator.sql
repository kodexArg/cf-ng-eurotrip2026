-- 0016_fr28_locator.sql
-- Código de reserva (PNR/locator) Ryanair FR28: EZTYVZ.

UPDATE events
  SET notes = 'Vuelo CONFIRMADO · Booking ref EZTYVZ · Pasajeros: Vanesa Elvira Bourges + Gabriel Alejandro Cassidai Avi · Solo bolso de mano pequeño (cero equipaje despachado) · Usar app Ryanair para tarjeta de embarque digital'
  WHERE id = 'ev-leg-pmi-lon';
