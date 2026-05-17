-- 0106_lighten_scl_eze_color.sql
-- Santiago de Chile (scl) and Buenos Aires (eze) shared #6b7280 (gray-500),
-- too strong in the calendar. Lighten to #9ca3af (gray-400).
UPDATE cities SET color='#9ca3af' WHERE id IN ('scl','eze');
