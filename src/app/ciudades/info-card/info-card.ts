import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { ExternalLink } from '../../shared/external-link/external-link';
import type { Card as CardModel } from '../../shared/models';

@Component({
  selector: 'app-info-card',
  imports: [Card, ExternalLink],
  template: `
    <p-card [header]="card().title">
      @if (card().body) {
        <p class="text-sm" style="color: var(--p-surface-700)">{{ card().body }}</p>
      }
      @if (card().url) {
        <div class="mt-3">
          <app-external-link [url]="card().url!" label="Ver más" />
        </div>
      }
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard {
  readonly card = input.required<CardModel>();
}
