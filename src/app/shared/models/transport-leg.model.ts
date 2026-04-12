export type TransportMode = 'flight' | 'train' | 'daytrip' | 'ferry';

export interface TransportLeg {
  id: string;
  fromCity: string;
  toCity: string;
  date: string;
  mode: TransportMode;
  label: string;
  duration: string | null;
  costHint: string | null;
  confirmed: boolean;
  fare: string | null;
  company: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
}
