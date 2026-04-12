export interface MapPoi {
  id: string;
  name: string;
  type: 'city' | 'excursion';
  lat: number;
  lon: number;
  color: string;
  cityId: string | null;
}
