import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from 'primeng/message';
import { InfoCard } from '../info-card/info-card';
import { LinkCard } from '../link-card/link-card';
import { NoteCard } from '../note-card/note-card';
import { PhotoCard } from '../photo-card/photo-card';
import type { Card } from '../../shared/models';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [Message, InfoCard, LinkCard, NoteCard, PhotoCard],
  template: `
    @if (cards().length === 0) {
      <p-message severity="info" text="Aún no hay información para esta ciudad." />
    } @else {
      <div class="flex flex-col gap-3">
        @for (card of cards(); track card.id) {
          @switch (card.type) {
            @case ('info') { <app-info-card [card]="card" /> }
            @case ('link') { <app-link-card [card]="card" /> }
            @case ('note') { <app-note-card [card]="card" /> }
            @case ('photo') { <app-photo-card [card]="card" /> }
          }
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList {
  readonly cards = input.required<Card[]>();
}
