export type RouteMode = 'flight' | 'train' | 'daytrip' | 'ferry';

export interface MapRoute {
  sku: string;
  fromPoi: string;
  toPoi: string;
  mode: RouteMode;
  waypoints: [number, number][];
}
