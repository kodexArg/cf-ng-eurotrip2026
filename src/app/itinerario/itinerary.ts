import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { City, TripEvent } from '../shared/models';
import { ItineraryCity } from './itinerary-city/itinerary-city';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { SiteInfoModal } from '../shared/site-info-modal/site-info-modal';
import { ItineraryEnrichmentService } from '../shared/services/itinerary-enrichment.service';

interface ItineraryPayload {
  cities: City[];
  events: TripEvent[];
}

interface CityBlock {
  city: City;
  events: TripEvent[];
  firstDay: string;
  lastDay: string;
  nightCount: number;
  firstTimestamp: string;
}

interface EventModalState {
  event: TripEvent;
  city: City;
}

/**
 * Itinerary page.
 *
 * Data flow:
 *   1. httpResource fetches { cities, events } from /api/itinerary
 *   2. ItineraryEnrichmentService injects synthetic "Presentarse en aeropuerto"
 *      hitos in front of every flight traslado
 *   3. Events are clustered into city blocks by cityIn + contiguous
 *      date range (gap ≤ 2 days). Traslado events route into the
 *      destination city block.
 *   4. Each block is rendered by <app-itinerary-city>.
 */
@Component({
  selector: 'app-itinerary',
  imports: [ItineraryCity, LoadingState, ErrorState, SiteInfoModal],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      @if (itineraryResource.isLoading()) {
        <app-loading-state />
      }

      @if (itineraryResource.error()) {
        <app-error-state
          message="No se pudo cargar el itinerario."
          (retry)="itineraryResource.reload()"
        />
      }

      @if (itineraryResource.value()) {
        @for (block of blocks(); track $index) {
          <app-itinerary-city
            [city]="block.city"
            [allCities]="cities()"
            [events]="block.events"
            [firstDay]="block.firstDay"
            [lastDay]="block.lastDay"
            [nightCount]="block.nightCount"
            (openEventInfo)="openEventInfo($event, block.city)"
          />
        }
      }
    </div>
    @if (eventModal(); as s) {
      <app-site-info-modal
        [events]="eventsForModal()"
        [cityName]="s.city.name"
        [cityColor]="s.city.color"
        [citySlug]="s.city.slug"
        [filterEventId]="s.event.id"
        (close)="eventModal.set(null)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryPage {
  private readonly enrichment = inject(ItineraryEnrichmentService);

  readonly date = input<string>();

  readonly itineraryResource = httpResource<ItineraryPayload>(() => '/api/itinerary');

  readonly cities = computed((): City[] => this.itineraryResource.value()?.cities ?? []);

  readonly enrichedEvents = computed((): TripEvent[] => {
    const payload = this.itineraryResource.value();
    if (!payload) return [];
    return this.enrichment.enrich(payload.events, payload.cities);
  });

  readonly blocks = computed((): CityBlock[] => {
    const cities = this.cities();
    const events = this.enrichedEvents();
    if (!cities.length) return [];

    // Index events by destination city (cityIn).
    const byCity = new Map<string, TripEvent[]>();
    for (const e of events) {
      const list = byCity.get(e.cityIn) ?? [];
      list.push(e);
      byCity.set(e.cityIn, list);
    }

    const out: CityBlock[] = [];

    for (const city of cities) {
      const cityEvents = byCity.get(city.id) ?? [];
      if (cityEvents.length === 0) continue;

      // Collect unique dates, sorted.
      const dateSet = new Set(cityEvents.map((e) => e.date));
      const dates = [...dateSet].sort();

      // Cluster contiguous dates (gap <= 2 days). This mirrors the
      // legacy heuristic and keeps non-contiguous Madrid stays separate.
      const clusters: string[][] = [];
      let current: string[] = [dates[0]];
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(current[current.length - 1] + 'T00:00:00Z').getTime();
        const curr = new Date(dates[i] + 'T00:00:00Z').getTime();
        const gapDays = (curr - prev) / (1000 * 60 * 60 * 24);
        if (gapDays > 2) {
          clusters.push(current);
          current = [dates[i]];
        } else {
          current.push(dates[i]);
        }
      }
      clusters.push(current);

      for (const cluster of clusters) {
        const first = cluster[0];
        const last = cluster[cluster.length - 1];
        const clusterEvents = cityEvents.filter((e) => e.date >= first && e.date <= last);
        // Tiebreaker for multi-city days (e.g. 2026-05-05 London → Paris → Rome):
        // earliest event timestamp on firstDay decides block order.
        const firstTimestamp = clusterEvents
          .filter((e) => e.date === first)
          .map((e) => e.timestampIn)
          .filter((t): t is string => !!t)
          .sort()[0] ?? `${first}T00:00:00`;
        out.push({
          city,
          events: clusterEvents,
          firstDay: first,
          lastDay: last,
          nightCount: cluster.length,
          firstTimestamp,
        });
      }
    }

    out.sort((a, b) => {
      const byDay = a.firstDay.localeCompare(b.firstDay);
      if (byDay !== 0) return byDay;
      return a.firstTimestamp.localeCompare(b.firstTimestamp);
    });
    return out;
  });

  readonly eventModal = signal<EventModalState | null>(null);

  readonly eventsForModal = computed((): TripEvent[] => {
    const s = this.eventModal();
    if (!s) return [];
    // Events visible in the modal are the city's events for the event's date.
    return this.enrichedEvents().filter(
      (e) => e.cityIn === s.city.id && e.date === s.event.date
    );
  });

  protected openEventInfo(event: TripEvent, city: City): void {
    this.eventModal.set({ event, city });
  }

  private readonly _scrollEffect = effect((onCleanup) => {
    const d = this.date();
    const blocks = this.blocks();
    if (d && blocks.length) {
      const timer = setTimeout(() => {
        document.getElementById('day-' + d)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      onCleanup(() => clearTimeout(timer));
    }
  });
}
