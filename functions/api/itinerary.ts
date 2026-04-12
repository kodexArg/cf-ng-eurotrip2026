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
  cardId: string | null;
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
  fare: string | null;
  company: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
}

interface CityBlock {
  city: City;
  days: Day[];
  transportLeg: TransportLeg | null;
  firstDay: string;
  lastDay: string;
  nightCount: number;
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
      'SELECT id, day_id AS dayId, time_slot AS timeSlot, description, tipo, tag, cost_hint AS costHint, confirmed, card_id AS cardId FROM activities ORDER BY id ASC'
    ).all<Activity>(),
    ctx.env.DB.prepare(
      'SELECT id, from_city AS fromCity, to_city AS toCity, date, mode, label, duration, cost_hint AS costHint, confirmed, fare, company, departure_time AS departureTime, arrival_time AS arrivalTime FROM transport_legs ORDER BY date ASC'
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
  // A city may have multiple inbound legs, so store them all
  const legsByToCity = new Map<string, TransportLeg[]>();
  for (const leg of legs) {
    const key = leg.toCity.toLowerCase();
    const list = legsByToCity.get(key) ?? [];
    list.push({ ...leg, confirmed: !!leg.confirmed });
    legsByToCity.set(key, list);
  }

  // Cluster each city's days by contiguous date ranges.
  // Two consecutive days belong to the same cluster if they are <= 2 days apart.
  // This ensures a city with non-contiguous stays (e.g. Madrid Apr 20-24 and May 9)
  // produces separate CityBlocks, each in correct chronological order.
  const itinerary: CityBlock[] = [];

  for (const city of cities) {
    const cityDays = daysByCity.get(city.id) ?? [];
    if (cityDays.length === 0) continue;

    // Days are already sorted by date from the query, but ensure it
    cityDays.sort((a, b) => a.date.localeCompare(b.date));

    // Split into clusters where gap between consecutive days > 2 days
    const clusters: Day[][] = [];
    let currentCluster: Day[] = [cityDays[0]];

    for (let i = 1; i < cityDays.length; i++) {
      const prevDate = new Date(currentCluster[currentCluster.length - 1].date + 'T00:00:00Z');
      const currDate = new Date(cityDays[i].date + 'T00:00:00Z');
      const gapMs = currDate.getTime() - prevDate.getTime();
      const gapDays = gapMs / (1000 * 60 * 60 * 24);

      if (gapDays > 2) {
        clusters.push(currentCluster);
        currentCluster = [cityDays[i]];
      } else {
        currentCluster.push(cityDays[i]);
      }
    }
    clusters.push(currentCluster);

    // Find the best matching transport leg for each cluster based on date proximity
    const cityLegs = legsByToCity.get(city.id.toLowerCase()) ?? [];

    for (const cluster of clusters) {
      const clusterFirstDate = new Date(cluster[0].date + 'T00:00:00Z').getTime();

      // Find the leg whose date is closest to (and <= ) the cluster's first day
      let bestLeg: TransportLeg | null = null;
      let bestDistance = Infinity;
      for (const leg of cityLegs) {
        const legDate = new Date(leg.date + 'T00:00:00Z').getTime();
        const distance = Math.abs(clusterFirstDate - legDate);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestLeg = leg;
        }
      }

      itinerary.push({
        city,
        days: cluster,
        transportLeg: bestLeg,
        firstDay: cluster[0].date,
        lastDay: cluster[cluster.length - 1].date,
        nightCount: cluster.length,
      });
    }
  }

  // Sort all CityBlocks by their first day's date
  itinerary.sort((a, b) => a.days[0].date.localeCompare(b.days[0].date));

  return Response.json(itinerary);
};
