import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import type { Card as CardModel } from '../../shared/models';

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [Card],
  template: `
    <p-card [header]="card().title">
      @if (card().url) {
        <a
          [href]="card().url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary underline text-sm"
        >
          {{ card().url }}
        </a>
      }
      @if (card().body) {
        <p class="text-sm mt-2" style="color: var(--p-surface-600)">{{ card().body }}</p>
      }
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCard {
  readonly card = input.required<CardModel>();
}
