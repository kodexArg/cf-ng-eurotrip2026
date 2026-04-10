import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { SelectButton } from 'primeng/selectbutton';
import { CityBlock as CityBlockModel } from '../shared/models';
import { VariantService } from '../shared/services/variant.service';
import { CityBlock } from './city-block/city-block';
import { TransportInline } from './transport-inline/transport-inline';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';

@Component({
  selector: 'app-itinerario',
  standalone: true,
  imports: [FormsModule, SelectButton, CityBlock, TransportInline, LoadingState, ErrorState],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <div class="mb-4 flex justify-center">
        <p-selectbutton
          [options]="variantOptions"
          [(ngModel)]="currentVariant"
          optionLabel="label"
          optionValue="value"
          (onChange)="onVariantChange($event.value)"
        />
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
          <app-city-block [city]="block.city" [days]="block.days" />
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItinerarioPage {
  private readonly variantService = inject(VariantService);

  readonly date = input<string>();

  readonly itineraryResource = httpResource<CityBlockModel[]>(() => '/api/itinerary');

  readonly variantOptions = [
    { label: 'Tren', value: 'train' },
    { label: 'Vuelo', value: 'main' },
  ];

  readonly selectedVariant = computed(() => this.variantService.variant());
  currentVariant: 'main' | 'train' = this.variantService.variant();

  readonly filteredBlocks = computed(() => {
    const blocks = this.itineraryResource.value() ?? [];
    const v = this.variantService.variant();
    return blocks.map(block => ({
      ...block,
      days: block.days
        .filter(day => day.variant === 'both' || day.variant === v)
        .map(day => ({
          ...day,
          activities: day.activities.filter(
            act => act.variant === 'both' || act.variant === v
          ),
        })),
    }));
  });

  constructor() {
    effect(() => {
      const d = this.date();
      const blocks = this.itineraryResource.value();
      if (d && blocks) {
        setTimeout(() => {
          document.getElementById('day-' + d)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  }

  onVariantChange(value: 'main' | 'train'): void {
    this.variantService.setVariant(value);
  }
}
