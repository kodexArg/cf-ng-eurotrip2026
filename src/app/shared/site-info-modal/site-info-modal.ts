import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Activity, Card, Day } from '../models';
import { ItineraryDay } from '../../itinerario/itinerary-day/itinerary-day';
import { ActivitySlot } from '../../itinerario/activity-slot/activity-slot';
import { InfoCard } from '../../ciudades/info-card/info-card';
import { LinkCard } from '../../ciudades/link-card/link-card';
import { NoteCard } from '../../ciudades/note-card/note-card';

interface LinkedEntry {
  activity: Activity;
  card: Card;
}

@Component({
  selector: 'app-site-info-modal',
  imports: [ItineraryDay, ActivitySlot, InfoCard, LinkCard, NoteCard],
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

        @if (filterActivityId()) {
          @if (filteredEntry(); as entry) {
            <div class="px-4 py-2">
              <app-activity-slot [activity]="entry.activity" />
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
              Sin informacion vinculada para esta actividad.
            </div>
          }
        } @else if (day(); as d) {
          <app-itinerary-day [day]="d" [isLast]="true" [showUnconfirmed]="true" />
          @if (linkedEntries().length) {
            <div class="flex flex-col gap-3 px-4 pb-4 pt-2">
              @for (entry of linkedEntries(); track entry.activity.id) {
                <div
                  class="rounded-lg p-3"
                  style="background-color: var(--p-surface-50); border: 1px solid var(--p-surface-200)"
                >
                  <div class="text-xs mb-2 font-medium" [style.color]="cityColor()">
                    {{ entry.activity.description }}
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
  readonly day = input<Day | null>(null);
  readonly cityName = input.required<string>();
  readonly cityColor = input.required<string>();
  readonly citySlug = input.required<string>();
  readonly filterActivityId = input<string | null>(null);
  readonly close = output<void>();

  readonly cardsResource = httpResource<Card[]>(() => '/api/cards/' + this.citySlug());

  private readonly cardsById = computed(() => {
    const map = new Map<string, Card>();
    for (const c of this.cardsResource.value() ?? []) map.set(c.id, c);
    return map;
  });

  readonly linkedEntries = computed((): LinkedEntry[] => {
    const d = this.day();
    if (!d) return [];
    const map = this.cardsById();
    const out: LinkedEntry[] = [];
    for (const a of d.activities) {
      if (!a.cardId) continue;
      const card = map.get(a.cardId);
      if (card) out.push({ activity: a, card });
    }
    return out;
  });

  readonly filteredEntry = computed((): LinkedEntry | null => {
    const id = this.filterActivityId();
    if (!id) return null;
    const d = this.day();
    if (!d) return null;
    const activity = d.activities.find(a => a.id === id);
    if (!activity || !activity.cardId) return null;
    const card = this.cardsById().get(activity.cardId);
    if (!card) return null;
    return { activity, card };
  });
}
