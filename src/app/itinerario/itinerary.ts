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
import { VariantService } from '../shared/services/variant.service';
import { AuthService } from '../shared/services/auth.service';
import { ItineraryCity } from './itinerary-city/itinerary-city';
import { TransportInline } from './transport-inline/transport-inline';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { VariantSelector } from './variant-selector/variant-selector';

@Component({
  selector: 'app-itinerary',
  imports: [ItineraryCity, TransportInline, LoadingState, ErrorState, VariantSelector],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <div class="mb-4 flex justify-center">
        <app-variant-selector />
      </div>

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
        @for (block of filteredBlocks(); track block.city.id) {
          @if (block.transportLeg) {
            <app-transport-inline [leg]="block.transportLeg" />
          }
          <app-itinerary-city [city]="block.city" [days]="block.days" />
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryPage {
  private readonly variantService = inject(VariantService);
  private readonly authService = inject(AuthService);

  readonly date = input<string>();

  readonly itineraryResource = httpResource<CityBlockModel[]>(() => '/api/itinerary');

  readonly filteredBlocks = computed(() => {
    const blocks = this.itineraryResource.value() ?? [];
    const v = this.variantService.variant();
    const showAll = this.authService.isAuthenticated();
    return blocks
      .map(block => ({
        ...block,
        transportLeg: block.transportLeg && (showAll || block.transportLeg.confirmed) ? block.transportLeg : null,
        days: block.days
          .filter(day => day.variant === 'both' || day.variant === v)
          .map(day => ({
            ...day,
            activities: day.activities.filter(
              act => (act.variant === 'both' || act.variant === v) && (showAll || act.confirmed)
            ),
          })),
      }));
  });

  private readonly _scrollEffect = effect(() => {
    const d = this.date();
    const blocks = this.itineraryResource.value();
    if (d && blocks) {
      setTimeout(() => {
        document.getElementById('day-' + d)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  });
}
