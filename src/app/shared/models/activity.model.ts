/**
 * Activity tipo lookup.
 *
 * NOTE: The `Activity` / `Day` / `TransportLeg` / `CityBlock` interfaces
 * were removed when the DB moved to the unified `events` table. This
 * module now only exposes the visual tipo catalog so calendar-side
 * components (calendar-month, event-chip, event-type-legend) keep
 * rendering their category chips. All inbound data is now TripEvent
 * (see event.model.ts).
 */

export type ActivityTipo = 'visit' | 'food' | 'transport' | 'hotel' | 'leisure' | 'event';

export const TIPO_CONFIG: Record<ActivityTipo, { bg: string; text: string; label: string; icon: string }> = {
  event:     { bg: 'rgba(255,255,255,0.25)',  text: '#f87171', label: 'Evento',      icon: 'pi-sparkles' },
  hotel:     { bg: 'rgba(255,255,255,0.25)',  text: '#a78bfa', label: 'Alojamiento', icon: 'pi-home' },
  transport: { bg: 'rgba(241,245,249,0.25)',  text: '#94a3b8', label: 'Transporte',  icon: 'pi-car' },
  visit:     { bg: 'rgba(239,246,255,0.25)',  text: '#60a5fa', label: 'Visita',      icon: 'pi-eye' },
  food:      { bg: 'rgba(254,243,199,0.25)',  text: '#fbbf24', label: 'Comida',      icon: 'pi-receipt' },
  leisure:   { bg: 'rgba(240,253,244,0.25)',  text: '#34d399', label: 'Ocio',        icon: 'pi-heart' },
};
