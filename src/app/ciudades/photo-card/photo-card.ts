import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from 'primeng/card';
import { environment } from '../../../environments/environment';
import type { Card as CardModel } from '../../shared/models';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [Card],
  template: `
    <p-card [header]="card().title">
      <img [src]="photoUrl()" [alt]="card().title" loading="lazy" class="w-full rounded-lg" />
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCard {
  readonly card = input.required<CardModel>();
  readonly photoUrl = computed(() => environment.r2BaseUrl + '/' + this.card().body);
}
