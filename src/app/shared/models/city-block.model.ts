import { City } from './city.model';
import { Day } from './day.model';
import { TransportLeg } from './transport-leg.model';

export interface CityBlock {
  city: City;
  days: Day[];
  transportLeg: TransportLeg | null;
}
