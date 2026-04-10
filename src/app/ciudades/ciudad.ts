import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CityBadge } from '../shared/city-badge/city-badge';
import { CardList } from './card-list/card-list';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import type { Card } from '../shared/models';

@Component({
  selector: 'app-ciudad',
  imports: [CityBadge, CardList, LoadingState, ErrorState],
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
        <app-card-list [cards]="cardsResource.value()!" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CiudadPage {
  readonly slug = input.required<string>();
  readonly cardsResource = httpResource<Card[]>(() => '/api/cards/' + this.slug());
}
