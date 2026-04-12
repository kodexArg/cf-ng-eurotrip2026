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
