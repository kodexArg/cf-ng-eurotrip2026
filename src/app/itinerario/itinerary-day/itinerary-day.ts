import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { City, DayWeather, TripEvent } from '../../shared/models';
import { EventSlot } from '../event-slot/event-slot';
import { InfoRow } from '../info-row/info-row';
import { TypeFilterService } from '../../shared/type-filter/type-filter.service';

interface SpecialEvent {
  text: string;
  icon: string;
}

const SPECIAL_EVENTS: Record<string, SpecialEvent> = {
  '04-30': { text: 'Víspera de Mayo', icon: 'pi-sparkles' },
  '05-01': { text: 'Día del Trabajo', icon: 'pi-users' },
  '05-05': { text: 'Día de la Victoria en Europa', icon: 'pi-flag' },
  '05-09': { text: 'Día de Europa', icon: 'pi-globe' },
  '05-11': { text: 'Día de la Madre (España)', icon: 'pi-heart' },
  '06-05': { text: 'Día del Medio Ambiente', icon: 'pi-leaf' },
  '06-06': { text: 'Aniversario del Día D', icon: 'pi-star' },
};

export interface ItineraryDayInput {
  date: string;
  events: TripEvent[];
  cityId: string;
}

/**
 * Renders one calendar day within a city block. Accepts a bag of
 * events belonging to that date (already scoped to this city) and
 * a flat cities list so downstream event-slot pipes can resolve IDs.
 */
@Component({
  selector: 'app-itinerary-day',
  imports: [DatePipe, TitleCasePipe, EventSlot, InfoRow],
  template: `
    <div class="flex" [id]="'day-' + day().date">
      <div class="w-16 shrink-0 flex flex-col items-center justify-center py-3 select-none"
           style="background-color: var(--p-surface-50); border-right: 1px solid var(--p-surface-200)">
        <span class="text-xs uppercase tracking-wide" style="color: var(--p-surface-400)">
          {{ day().date | date:'EEE' | titlecase }}
        </span>
        <span class="text-2xl font-bold leading-none mt-0.5" style="color: var(--p-surface-700)">
          {{ day().date | date:'d' }}
        </span>
      </div>

      <div class="flex-1 flex items-center py-2 px-3 min-w-0">
        <div class="flex flex-col gap-1 flex-1">
          @if (specialEvent(); as sp) {
            <app-info-row
              [icon]="sp.icon"
              iconColor="var(--p-surface-400)"
              [text]="sp.text"
              textColor="var(--p-surface-400)"
            />
          }
          @for (event of displayEvents(); track event.id) {
            <app-event-slot
              [event]="event"
              [cities]="cities()"
              (openInfo)="openEventInfo.emit(event)"
            />
          }
          @if (showUnconfirmed() && weather()) {
            <div class="flex items-center gap-1 mt-0.5 select-none text-xs leading-none" [style.color]="weatherIconColor()">
              @if (weatherIconMaterial(); as mat) {
                <span class="material-symbols-outlined" style="font-size: 1rem; line-height: 1">{{ mat }}</span>
              } @else {
                <i [class]="'pi ' + weatherIcon()"></i>
              }
              <span>{{ weatherTempText() }}</span>
            </div>
          }
        </div>
      </div>
    </div>
    @if (!isLast()) {
      <div class="h-px" style="background: linear-gradient(to right, transparent, var(--p-surface-200), transparent)"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryDay {
  private readonly filterService = inject(TypeFilterService);

  readonly day = input.required<ItineraryDayInput>();
  readonly cities = input<readonly City[]>([]);
  readonly weather = input<DayWeather | null>(null);
  readonly isLast = input(false);
  readonly showUnconfirmed = input(false);
  readonly openEventInfo = output<TripEvent>();

  protected readonly displayEvents = computed(() => {
    const show = this.showUnconfirmed();
    const events = [...this.day().events].sort((a, b) =>
      a.timestampIn.localeCompare(b.timestampIn)
    );
    return (show ? events : events.filter((e) => e.confirmed)).filter((e) =>
      this.filterService.isVisible(e.type)
    );
  });

  protected readonly weatherIcon = computed(() => {
    const code = this.weather()?.weatherCode ?? -1;
    if (code < 0) return 'pi-cloud';
    if (code === 0 || code === 1) return 'pi-sun';
    if (code === 2 || code === 3) return 'pi-cloud';
    if (code >= 45 && code <= 48) return 'pi-eye-slash';
    if (code >= 95) return 'pi-bolt';
    return 'pi-cloud';
  });

  // Returns a Material Symbols Outlined name for weather codes PrimeIcons
  // can't render (rain/drizzle/snow). Null falls through to the pi-* branch.
  protected readonly weatherIconMaterial = computed((): string | null => {
    const code = this.weather()?.weatherCode ?? -1;
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'ac_unit';
    if (code >= 80 && code <= 82) return 'rainy';
    return null;
  });

  protected readonly weatherIconColor = computed(() =>
    this.weather() ? 'var(--p-surface-300)' : 'var(--p-surface-200)'
  );

  protected readonly weatherTempText = computed(() => {
    const w = this.weather();
    if (!w) return '—';
    return `↓${w.tempMin}° ↑${w.tempMax}°`;
  });

  protected readonly specialEvent = computed((): SpecialEvent | null => {
    const monthDay = this.day().date.slice(5);
    return SPECIAL_EVENTS[monthDay] ?? null;
  });
}
