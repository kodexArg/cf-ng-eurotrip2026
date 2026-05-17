-- 20260427-icon-overhaul.sql
-- Overhaul of all milestone icons to use more expressive Material Symbols

-- Barcelona updates
UPDATE events SET icon='tapas' WHERE id='ev-bcn-apr24-lunch-blai';
UPDATE events SET icon='castillo' WHERE id='ev-bcn-apr24-montjuic-castillo';
UPDATE events SET icon='paseo' WHERE id='ev-bcn-apr25-rambla';
UPDATE events SET icon='bus_turistico' WHERE id='ev-bcn-apr25-bus-turistico';
UPDATE events SET icon='arquitectura' WHERE id='ev-bcn-apr26-casa-vicens-ext';
UPDATE events SET icon='bus_turistico' WHERE id='ev-bcn-apr26-bus-turistic';
UPDATE events SET icon='fuente' WHERE id='ev-bcn-apr26-font-magica';
UPDATE events SET icon='barrio' WHERE id='ev-bcn-apr26-gotic-nocturno';
UPDATE events SET icon='palmera' WHERE id='ev-bcn-apr27-playa';
-- Keep existing values for: ev-bk-sagrada (basílica), ev-bcn-apr27-torre-sagrada (torre)

-- Madrid updates
UPDATE events SET icon='descanso' WHERE id='ev-mad-apr20-oxigen-capsulas';
-- Keep existing value for: ev-mad-apr20-checkin-airbnb (airbnb)
UPDATE events SET icon='atardecer' WHERE id='ev-mad-apr20-debod';
UPDATE events SET icon='paseo' WHERE id='ev-mad-apr20-paseo-palacio-real';
UPDATE events SET icon='bus_turistico' WHERE id='ev-mad-apr21-bigbus';
UPDATE events SET icon='bicicleta' WHERE id='ev-mad-apr21-retiro-bici';
UPDATE events SET icon='bus_turistico' WHERE id='ev-mad-apr21-viento-colectivo';
UPDATE events SET icon='nocturno' WHERE id='ev-mad-apr21-bar-nocturno';
UPDATE events SET icon='bus_turistico' WHERE id='ev-mad-apr22-citybus-manana';

-- Toledo updates
UPDATE events SET icon='bus_turistico' WHERE id='ev-tol-apr23-bus-tour';

-- London updates
UPDATE events SET icon='excursion' WHERE id='ev-lon-may03-stonehenge';
UPDATE events SET icon='mirador' WHERE id='ev-lon-may04-skygarden';

-- Madrid return updates
UPDATE events SET icon='aeropuerto' WHERE id='ev-mad-may09-noche-regreso-t4';
UPDATE events SET icon='aeropuerto' WHERE id='ev-mad-may09-noche-llegada';
UPDATE events SET icon='plaza' WHERE id='ev-mad-may09-noche-plaza-mayor';
UPDATE events SET icon='barrio' WHERE id='ev-mad-may09-noche-la-latina';
UPDATE events SET icon='nocturno' WHERE id='ev-mad-may09-noche-gran-via';