import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Message } from 'primeng/message';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Tag } from 'primeng/tag';
import { InfoCard } from '../info-card/info-card';
import { LinkCard } from '../link-card/link-card';
import { NoteCard } from '../note-card/note-card';
import { PhotoCard } from '../photo-card/photo-card';
import type { Card } from '../../shared/models';

@Component({
  selector: 'app-city-card-list',
  imports: [Message, Accordion, AccordionPanel, AccordionHeader, AccordionContent, Tag, InfoCard, LinkCard, NoteCard, PhotoCard],
  template: `
    @if (cards().length === 0) {
      <p-message severity="info" text="Aun no hay informacion para esta ciudad." />
    } @else {
      @if (photoCards().length) {
        <div class="flex flex-col gap-3 mb-4">
          @for (card of photoCards(); track card.id) {
            <app-photo-card [card]="card" />
          }
        </div>
      }
      @if (contentCards().length) {
        <p-accordion [value]="defaultOpenPanels()" [multiple]="true">
          @for (card of contentCards(); track card.id) {
            <p-accordionpanel [value]="card.id">
              <p-accordionheader>
                <div class="flex items-center gap-2 w-full">
                  <p-tag [value]="typeLabel(card.type)" [severity]="typeSeverity(card.type)" class="text-xs" />
                  <span class="font-semibold">{{ card.title }}</span>
                </div>
              </p-accordionheader>
              <p-accordioncontent>
                <div class="p-3">
                  @switch (card.type) {
                    @case ('info') { <app-info-card [card]="card" /> }
                    @case ('link') { <app-link-card [card]="card" /> }
                    @case ('note') { <app-note-card [card]="card" /> }
                  }
                </div>
              </p-accordioncontent>
            </p-accordionpanel>
          }
        </p-accordion>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardList {
  readonly cards = input.required<Card[]>();

  readonly photoCards = computed(() => this.cards().filter(c => c.type === 'photo'));
  readonly contentCards = computed(() => this.cards().filter(c => c.type !== 'photo'));

  readonly defaultOpenPanels = computed(() => {
    const content = this.contentCards();
    return content.slice(0, Math.min(3, content.length)).map(c => c.id);
  });

  typeLabel(type: string): string {
    switch (type) {
      case 'info': return 'Info';
      case 'link': return 'Enlace';
      case 'note': return 'Nota';
      default: return type;
    }
  }

  typeSeverity(type: string): 'info' | 'warn' | 'success' | 'danger' | 'secondary' | 'contrast' {
    switch (type) {
      case 'info': return 'info';
      case 'link': return 'success';
      case 'note': return 'warn';
      default: return 'secondary';
    }
  }
}
