import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CityBadge } from '../shared/city-badge/city-badge';
import { CityCardList } from './city-card-list/city-card-list';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import type { Card } from '../shared/models';

@Component({
  selector: 'app-city',
  imports: [CityBadge, CityCardList, LoadingState, ErrorState],
  template: `
    <div class="max-w-3xl mx-auto p-4 flex flex-col gap-4">
      <app-city-badge [slug]="slug()" />
      @if (cardsResource.isLoading()) {
        <app-loading-state />
      }
      @if (cardsResource.error()) {
        <app-error-state
          message="No se pudieron cargar las actividades."
          (retry)="cardsResource.reload()"
        />
      }
      @if (cardsResource.value() !== undefined) {
        <app-city-card-list [cards]="cardsResource.value()!" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityPage {
  readonly slug = input.required<string>();
  readonly cardsResource = httpResource<Card[]>(() => '/api/cards/' + this.slug());
}
