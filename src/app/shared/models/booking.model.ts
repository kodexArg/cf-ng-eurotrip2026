// TODO Phase 2: This model will be superseded by the unified Event model once
// events-based mutations are implemented. Kept in place because reservas.ts,
// booking-card, booking-dialog, and booking-type-chip still reference it.
export type BookingType = 'hito' | 'viaje' | 'hospedaje';

export interface Booking {
  id: string;
  type: BookingType;
  sortDate: string;
  time: string | null;
  description: string;
  origin: string | null;
  destination: string | null;
  mode: string | null;
  carrier: string | null;
  checkoutDate: string | null;
  accommodation: string | null;
  costUsd: number | null;
  confirmed: boolean;
  notes: string | null;
  createdAt: string;
}
