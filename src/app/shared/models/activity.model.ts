export type ActivityTipo = 'visit' | 'food' | 'transport' | 'hotel' | 'leisure' | 'event';

export const TIPO_CONFIG: Record<ActivityTipo, { bg: string; text: string; label: string; icon: string }> = {
  event:     { bg: 'rgba(255,255,255,0.25)',  text: '#dc2626', label: 'Evento',      icon: 'pi-star' },
  hotel:     { bg: 'rgba(255,255,255,0.25)',  text: '#7c3aed', label: 'Alojamiento', icon: 'pi-building' },
  transport: { bg: 'rgba(241,245,249,0.25)',  text: '#475569', label: 'Transporte',  icon: 'pi-car' },
  visit:     { bg: 'rgba(239,246,255,0.25)',  text: '#1d4ed8', label: 'Visita',      icon: 'pi-map-marker' },
  food:      { bg: 'rgba(254,243,199,0.25)',  text: '#92400e', label: 'Comida',      icon: 'pi-shop' },
  leisure:   { bg: 'rgba(240,253,244,0.25)',  text: '#065f46', label: 'Ocio',        icon: 'pi-heart' },
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
