interface Env {
  DB: D1Database;
}

interface City {
  id: string;
  name: string;
  slug: string;
  arrival: string;
  departure: string;
  nights: number;
  color: string;
  lat: number;
  lon: number;
}

interface Activity {
  id: string;
  dayId: string;
  timeSlot: string;
  description: string;
  tipo: string;
  tag: string;
  costHint: string | null;
  confirmed: boolean;
}

interface Day {
  id: string;
  cityId: string;
  date: string;
  label: string | null;
  activities: Activity[];
}

interface TransportLeg {
  id: string;
  fromCity: string;
  toCity: string;
  date: string;
  mode: string;
  label: string;
  duration: string | null;
  costHint: string | null;
  confirmed: boolean;
}

interface CityBlock {
  city: City;
  days: Day[];
  transportLeg: TransportLeg | null;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const [citiesResult, daysResult, activitiesResult, legsResult] = await Promise.all([
    ctx.env.DB.prepare(
      'SELECT id, name, slug, arrival, departure, nights, color, lat, lon FROM cities ORDER BY arrival ASC'
    ).all<City>(),
    ctx.env.DB.prepare(
      'SELECT id, city_id AS cityId, date, label FROM days ORDER BY date ASC, id ASC'
    ).all<Day>(),
    ctx.env.DB.prepare(
      'SELECT id, day_id AS dayId, time_slot AS timeSlot, description, tipo, tag, cost_hint AS costHint, confirmed FROM activities ORDER BY id ASC'
    ).all<Activity>(),
    ctx.env.DB.prepare(
      'SELECT id, from_city AS fromCity, to_city AS toCity, date, mode, label, duration, cost_hint AS costHint, confirmed FROM transport_legs ORDER BY date ASC'
    ).all<TransportLeg>(),
  ]);

  const cities = citiesResult.results;
  const days = daysResult.results;
  const activities = activitiesResult.results;
  const legs = legsResult.results;

  const activitiesByDay = new Map<string, Activity[]>();
  for (const act of activities) {
    const list = activitiesByDay.get(act.dayId) ?? [];
    list.push({ ...act, confirmed: !!act.confirmed });
    activitiesByDay.set(act.dayId, list);
  }

  const daysByCity = new Map<string, Day[]>();
  for (const day of days) {
    const list = daysByCity.get(day.cityId) ?? [];
    list.push({ ...day, activities: activitiesByDay.get(day.id) ?? [] });
    daysByCity.set(day.cityId, list);
  }

  // Index legs by toCity for fast lookup (leg arriving INTO a city)
  const legByToCity = new Map<string, TransportLeg>();
  for (const leg of legs) {
    legByToCity.set(leg.toCity, { ...leg, confirmed: !!leg.confirmed });
  }

  const itinerary: CityBlock[] = cities.map((city) => ({
    city,
    days: daysByCity.get(city.id) ?? [],
    transportLeg: legByToCity.get(city.id) ?? null,
  }));

  return Response.json(itinerary);
};
