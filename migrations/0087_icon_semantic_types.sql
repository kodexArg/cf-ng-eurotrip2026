-- migrations/0087_icon_semantic_types.sql
-- Converts events.icon from raw ms-*/pi-* values to semantic Spanish keys
-- compatible with ICON_REGISTRY in src/app/shared/icon-registry.ts.

UPDATE events SET icon='avion'     WHERE icon='ms-flight_takeoff';
UPDATE events SET icon='colectivo' WHERE icon='ms-directions_bus';
UPDATE events SET icon='comida'    WHERE icon='ms-lunch_dining';
UPDATE events SET icon='corazon'   WHERE icon='pi pi-heart' OR icon='pi-heart';
UPDATE events SET icon='auto'      WHERE icon='pi pi-car'   OR icon='pi-car';
UPDATE events SET icon='marcador'  WHERE icon='pi pi-map-marker' OR icon='pi-map-marker';
