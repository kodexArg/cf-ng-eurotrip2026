import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Card, City, TripEvent } from '../models';
import { EventSlot } from '../../itinerario/event-slot/event-slot';
import { InfoCard } from '../../ciudades/info-card/info-card';
import { LinkCard } from '../../ciudades/link-card/link-card';
import { NoteCard } from '../../ciudades/note-card/note-card';

interface LinkedEntry {
  event: TripEvent;
  card: Card;
}

/**
 * Modal that shows the events of a single day for one city, plus
 * any informational cards linked to those events via `event.cardId`.
 *
 * Previously this component accepted a legacy `Day { activities }`
 * shape. It now receives a flat `events` list (already scoped to a
 * given day + city by the caller), which matches the unified event
 * model. `filterEventId` keeps the pre-existing behaviour of
 * highlighting just one row when the user taps its card link.
 */
@Component({
  selector: 'app-site-info-modal',
  imports: [EventSlot, InfoCard, LinkCard, NoteCard],
  template: `
    <div
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      (click)="close.emit()"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center justify-between px-4 pt-4">
          <span class="text-sm font-medium" [style.color]="cityColor()">{{ cityName() }}</span>
          <button
            type="button"
            class="bg-transparent border-none cursor-pointer text-xl leading-none"
            style="color: var(--p-surface-400)"
            (click)="close.emit()"
            aria-label="Cerrar"
          >✕</button>
        </div>

        @if (filterEventId()) {
          @if (filteredEntry(); as entry) {
            <div class="px-4 py-3">
              <div
                class="rounded-lg border border-surface-200 p-3"
                style="background-color: var(--p-surface-50)"
              >
                <app-event-slot [event]="entry.event" [cities]="cities()" />
              </div>
            </div>
            <div class="px-4 pb-4">
              <div
                class="rounded-lg p-3"
                style="background-color: var(--p-surface-50); border: 1px solid var(--p-surface-200)"
              >
                @switch (entry.card.type) {
                  @case ('info') { <app-info-card [card]="entry.card" /> }
                  @case ('link') { <app-link-card [card]="entry.card" /> }
                  @case ('note') { <app-note-card [card]="entry.card" /> }
                }
              </div>
            </div>
          } @else {
            <div class="px-4 py-6 text-center text-sm" style="color: var(--p-surface-500)">
              Sin informacion vinculada para este evento.
            </div>
          }
        } @else {
          <div class="flex flex-col gap-2 px-4 pt-3">
            @for (e of visibleEvents(); track e.id) {
              <div
                class="rounded-lg border border-surface-200 p-3"
                style="background-color: var(--p-surface-50)"
              >
                <app-event-slot [event]="e" [cities]="cities()" />
              </div>
            }
          </div>
          @if (linkedEntries().length) {
            <div class="flex flex-col gap-3 px-4 pb-4 pt-3">
              @for (entry of linkedEntries(); track entry.event.id) {
                <div
                  class="rounded-lg p-3"
                  style="background-color: var(--p-surface-50); border: 1px solid var(--p-surface-200)"
                >
                  <div class="text-xs mb-2 font-medium" [style.color]="cityColor()">
                    {{ entry.event.title }}
                  </div>
                  @switch (entry.card.type) {
                    @case ('info') { <app-info-card [card]="entry.card" /> }
                    @case ('link') { <app-link-card [card]="entry.card" /> }
                    @case ('note') { <app-note-card [card]="entry.card" /> }
                  }
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteInfoModal {
  readonly events = input<TripEvent[]>([]);
  readonly cities = input<readonly City[]>([]);
  readonly cityName = input.required<string>();
  readonly cityColor = input.required<string>();
  readonly citySlug = input.required<string>();
  readonly filterEventId = input<string | null>(null);
  readonly close = output<void>();

  readonly cardsResource = httpResource<Card[]>(() => '/api/cards/' + this.citySlug());

  private readonly cardsById = computed(() => {
    const map = new Map<string, Card>();
    for (const c of this.cardsResource.value() ?? []) map.set(c.id, c);
    return map;
  });

  readonly visibleEvents = computed((): TripEvent[] =>
    [...this.events()].sort((a, b) => a.timestampIn.localeCompare(b.timestampIn))
  );

  readonly linkedEntries = computed((): LinkedEntry[] => {
    const map = this.cardsById();
    const out: LinkedEntry[] = [];
    for (const e of this.events()) {
      if (!e.cardId) continue;
      const card = map.get(e.cardId);
      if (card) out.push({ event: e, card });
    }
    return out;
  });

  readonly filteredEntry = computed((): LinkedEntry | null => {
    const id = this.filterEventId();
    if (!id) return null;
    const event = this.events().find((e) => e.id === id);
    if (!event || !event.cardId) return null;
    const card = this.cardsById().get(event.cardId);
    if (!card) return null;
    return { event, card };
  });
}
