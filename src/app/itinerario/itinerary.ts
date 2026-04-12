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
import { Activity, City, CityBlock as CityBlockModel, Day } from '../shared/models';
import { AuthService } from '../shared/services/auth.service';
import { ItineraryCity } from './itinerary-city/itinerary-city';
import { TransportInline } from './transport-inline/transport-inline';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { SiteInfoModal } from '../shared/site-info-modal/site-info-modal';

interface ActivityModalState {
  activity: Activity;
  day: Day;
  city: City;
}

@Component({
  selector: 'app-itinerary',
  imports: [ItineraryCity, TransportInline, LoadingState, ErrorState, SiteInfoModal],
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
        @for (block of filteredBlocks(); track $index) {
          @if (block.transportLeg) {
            <app-transport-inline [leg]="block.transportLeg" />
          }
          <app-itinerary-city
            [city]="block.city"
            [days]="block.days"
            [firstDay]="block.firstDay"
            [lastDay]="block.lastDay"
            [nightCount]="block.nightCount"
            (openActivityInfo)="openActivityInfo($event, block.city)"
          />
        }
      }
    </div>
    @if (activityModal(); as s) {
      <app-site-info-modal
        [day]="s.day"
        [cityName]="s.city.name"
        [cityColor]="s.city.color"
        [citySlug]="s.city.slug"
        [filterActivityId]="s.activity.id"
        (close)="activityModal.set(null)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryPage {
  private readonly authService = inject(AuthService);

  readonly date = input<string>();

  readonly itineraryResource = httpResource<CityBlockModel[]>(() => '/api/itinerary');

  readonly filteredBlocks = computed(() => {
    return this.itineraryResource.value() ?? [];
  });

  readonly activityModal = signal<ActivityModalState | null>(null);

  protected openActivityInfo(event: { activity: Activity; day: Day }, city: City): void {
    this.activityModal.set({ activity: event.activity, day: event.day, city });
  }

  private readonly _scrollEffect = effect((onCleanup) => {
    const d = this.date();
    const blocks = this.itineraryResource.value();
    if (d && blocks) {
      const timer = setTimeout(() => {
        document.getElementById('day-' + d)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      onCleanup(() => clearTimeout(timer));
    }
  });
}
