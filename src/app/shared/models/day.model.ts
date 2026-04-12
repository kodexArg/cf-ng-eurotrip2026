import { Activity, Variant } from './activity.model';

export interface Day {
  id: string;
  cityId: string;
  date: string;
  label: string | null;
  variant: Variant;
  activities: Activity[];
}
