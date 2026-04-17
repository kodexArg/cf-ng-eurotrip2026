-- migrations/0084_confirm_reinasofia_apr23.sql
-- Jueves 23 abr: Reina Sofía abre 10:00-21:00 (cierra martes). Slot 10:00-13:00 OK.
UPDATE events SET confirmed = 1 WHERE id = 'ev-mad-apr23-reinasofia';
