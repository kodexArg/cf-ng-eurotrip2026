import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CityBlock as CityBlockModel } from '../shared/models';
import { AuthService } from '../shared/services/auth.service';
import { ItineraryCity } from './itinerary-city/itinerary-city';
import { TransportInline } from './transport-inline/transport-inline';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';

@Component({
  selector: 'app-itinerary',
  imports: [ItineraryCity, TransportInline, LoadingState, ErrorState],
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
          />
        }
      }
    </div>
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
