export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'all-day';
export type Variant = 'main' | 'train' | 'both';

export interface Activity {
  id: string;
  dayId: string;
  timeSlot: TimeSlot;
  description: string;
  costHint: string | null;
  confirmed: boolean;
  variant: Variant;
}
