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

import { ACTIVITY_TIPO_COLORS } from '../theme/colors';

export type ActivityTipo = 'visit' | 'food' | 'transport' | 'hotel' | 'leisure' | 'event';

export const TIPO_CONFIG: Record<ActivityTipo, { bg: string; text: string; label: string; icon: string }> = {
  event:     { bg: ACTIVITY_TIPO_COLORS['event'].bg,     text: ACTIVITY_TIPO_COLORS['event'].text,     label: 'Evento',      icon: 'pi-sparkles' },
  hotel:     { bg: ACTIVITY_TIPO_COLORS['hotel'].bg,     text: ACTIVITY_TIPO_COLORS['hotel'].text,     label: 'Alojamiento', icon: 'pi-home' },
  transport: { bg: ACTIVITY_TIPO_COLORS['transport'].bg, text: ACTIVITY_TIPO_COLORS['transport'].text, label: 'Transporte',  icon: 'pi-car' },
  visit:     { bg: ACTIVITY_TIPO_COLORS['visit'].bg,     text: ACTIVITY_TIPO_COLORS['visit'].text,     label: 'Visita',      icon: 'pi-eye' },
  food:      { bg: ACTIVITY_TIPO_COLORS['food'].bg,      text: ACTIVITY_TIPO_COLORS['food'].text,      label: 'Comida',      icon: 'pi-receipt' },
  leisure:   { bg: ACTIVITY_TIPO_COLORS['leisure'].bg,   text: ACTIVITY_TIPO_COLORS['leisure'].text,   label: 'Ocio',        icon: 'pi-heart' },
};
