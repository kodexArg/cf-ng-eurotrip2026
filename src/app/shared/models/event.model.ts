/**
 * Unified event model (matches DB tables events + events_traslado + events_estadia).
 * Three discriminated variants under a common base.
 */

export type EventType = 'hito' | 'traslado' | 'estadia';
export type EventVariant = 'main' | 'train' | 'both';
export type DaySlot = 'madrugada' | 'mañana' | 'tarde' | 'noche';

/** Fields shared by every row of the master `events` table. */
export interface TripEventBase {
  id: string;
  type: EventType;
  subtype: string;
  slug: string;
  title: string;
  description: string | null;
  date: string;                 // YYYY-MM-DD
  timestampIn: string;          // YYYY-MM-DDTHH:MM:SS (naive local)
  timestampOut: string | null;
  cityIn: string;
  cityOut: string | null;
  usd: number | null;
  icon: string;
  confirmed: boolean;
  variant: EventVariant;
  cardId: string | null;
  notes: string | null;
}

export interface HitoEvent extends TripEventBase {
  type: 'hito';
}

export interface TrasladoEvent extends TripEventBase {
  type: 'traslado';
  company: string | null;
  fare: string | null;
  vehicleCode: string | null;
  seat: string | null;
  durationMin: number | null;
}

export interface EstadiaEvent extends TripEventBase {
  type: 'estadia';
  accommodation: string;
  address: string | null;
  checkinTime: string | null;
  checkoutTime: string | null;
  bookingRef: string | null;
  platform: string | null;
}

export type TripEvent = HitoEvent | TrasladoEvent | EstadiaEvent;

export function isHito(e: TripEvent): e is HitoEvent {
  return e.type === 'hito';
}

export function isTraslado(e: TripEvent): e is TrasladoEvent {
  return e.type === 'traslado';
}

export function isEstadia(e: TripEvent): e is EstadiaEvent {
  return e.type === 'estadia';
}

/** Extract YYYY-MM-DD from a naive local timestamp (YYYY-MM-DDTHH:MM:SS). */
export function dateOf(timestamp: string): string {
  return timestamp.slice(0, 10);
}

/** Map a naive local timestamp to a coarse slot of the day. */
export function slotOf(timestamp: string): DaySlot {
  const hour = parseInt(timestamp.slice(11, 13), 10);
  if (hour < 6) return 'madrugada';
  if (hour < 12) return 'mañana';
  if (hour < 19) return 'tarde';
  return 'noche';
}

/** Extract HH:MM from a naive local timestamp. */
export function timeOf(timestamp: string): string {
  return timestamp.slice(11, 16);
}
