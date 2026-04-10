export type ActivityTipo = 'visit' | 'food' | 'transport' | 'hotel' | 'leisure' | 'event';

export const TIPO_CONFIG: Record<ActivityTipo, { bg: string; text: string; label: string }> = {
  visit:     { bg: '#3b82f6', text: '#ffffff', label: 'Visita' },
  food:      { bg: '#f59e0b', text: '#1c1917', label: 'Comida' },
  transport: { bg: '#6b7280', text: '#ffffff', label: 'Transporte' },
  hotel:     { bg: '#8b5cf6', text: '#ffffff', label: 'Alojamiento' },
  leisure:   { bg: '#10b981', text: '#ffffff', label: 'Ocio' },
  event:     { bg: '#ef4444', text: '#ffffff', label: 'Evento' },
};

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'all-day';
export type Variant = 'main' | 'train' | 'both';

export interface Activity {
  id: string;
  dayId: string;
  timeSlot: TimeSlot;
  description: string;
  tipo: ActivityTipo;
  tag: string;
  costHint: string | null;
  confirmed: boolean;
  variant: Variant;
}
