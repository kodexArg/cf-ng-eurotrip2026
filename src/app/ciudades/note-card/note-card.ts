import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import type { Card as CardModel } from '../../shared/models';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [Card],
  template: `
    <p-card [header]="card().title">
      <p class="text-sm whitespace-pre-wrap" style="color: var(--p-surface-700)">{{ card().body }}</p>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCard {
  readonly card = input.required<CardModel>();
}
