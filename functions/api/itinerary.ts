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
  day_id: string;
  time_slot: string;
  description: string;
  cost_hint: string | null;
  confirmed: number;
  variant: string;
}

interface Day {
  id: string;
  city_id: string;
  date: string;
  label: string | null;
  variant: string;
  activities: Activity[];
}

interface TransportLeg {
  id: string;
  from_city: string;
  to_city: string;
  date: string;
  mode: string;
  label: string;
  duration: string | null;
  cost_hint: string | null;
  confirmed: number;
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
      'SELECT id, city_id, date, label, variant FROM days ORDER BY date ASC, id ASC'
    ).all<Day>(),
    ctx.env.DB.prepare(
      'SELECT id, day_id, time_slot, description, cost_hint, confirmed, variant FROM activities ORDER BY id ASC'
    ).all<Activity>(),
    ctx.env.DB.prepare(
      'SELECT id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed FROM transport_legs ORDER BY date ASC'
    ).all<TransportLeg>(),
  ]);

  const cities = citiesResult.results;
  const days = daysResult.results;
  const activities = activitiesResult.results;
  const legs = legsResult.results;

  const activitiesByDay = new Map<string, Activity[]>();
  for (const act of activities) {
    const list = activitiesByDay.get(act.day_id) ?? [];
    list.push(act);
    activitiesByDay.set(act.day_id, list);
  }

  const daysByCity = new Map<string, Day[]>();
  for (const day of days) {
    const list = daysByCity.get(day.city_id) ?? [];
    list.push({ ...day, activities: activitiesByDay.get(day.id) ?? [] });
    daysByCity.set(day.city_id, list);
  }

  // Index legs by to_city for fast lookup (leg arriving INTO a city)
  const legByToCity = new Map<string, TransportLeg>();
  for (const leg of legs) {
    legByToCity.set(leg.to_city, leg);
  }

  const itinerary: CityBlock[] = cities.map((city) => ({
    city,
    days: daysByCity.get(city.id) ?? [],
    transportLeg: legByToCity.get(city.id) ?? null,
  }));

  return Response.json(itinerary);
};
