import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import type { Card as CardModel } from '../../shared/models';

@Component({
  selector: 'app-info-card',
  imports: [Card, Button],
  template: `
    <p-card [header]="card().title">
      @if (card().body) {
        <p class="text-sm" style="color: var(--p-surface-700)">{{ card().body }}</p>
      }
      @if (card().url) {
        <div class="mt-3">
          <a [href]="card().url" target="_blank" rel="noopener noreferrer">
            <p-button
              label="Ver más"
              icon="pi pi-external-link"
              severity="secondary"
              [outlined]="true"
              size="small"
            />
          </a>
        </div>
      }
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard {
  readonly card = input.required<CardModel>();
}
