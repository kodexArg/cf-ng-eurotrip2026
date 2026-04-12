import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Day, DayWeather } from '../../shared/models';
import { ActivitySlot } from '../activity-slot/activity-slot';
import { InfoRow } from '../info-row/info-row';

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

@Component({
  selector: 'app-itinerary-day',
  imports: [DatePipe, TitleCasePipe, ActivitySlot, InfoRow],
  template: `
    <div class="flex" [id]="'day-' + day().date">
      <div class="w-16 shrink-0 flex flex-col items-center justify-center py-3"
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
          @if (day().label) {
            <app-info-row
              [icon]="dayLabelIcon().icon"
              [iconColor]="dayLabelIcon().color"
              [text]="day().label!"
              [textColor]="dayLabelIcon().color"
            />
          }
          @if (specialEvent()) {
            <app-info-row
              [icon]="specialEvent()!.icon"
              iconColor="var(--p-surface-400)"
              [text]="specialEvent()!.text"
              textColor="var(--p-surface-400)"
            />
          }
          @for (activity of displayActivities(); track activity.id) {
            <app-activity-slot [activity]="activity" />
          }
          @if (showUnconfirmed() && weather()) {
            <div class="flex items-center gap-0.5 mt-0.5">
              <i [class]="'pi ' + weatherIcon()" style="font-size: 0.6rem" [style.color]="weatherIconColor()"></i>
              <span class="text-xxs leading-none" [style.color]="weatherTextColor()">{{ weatherTempText() }}</span>
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
  readonly day = input.required<Day>();
  readonly weather = input<DayWeather | null>(null);
  readonly isLast = input(false);
  readonly showUnconfirmed = input(false);

  protected readonly displayActivities = computed(() =>
    this.day().activities.filter(a =>
      a.confirmed || this.showUnconfirmed()
    )
  );

  protected readonly weatherIcon = computed(() => {
    const code = this.weather()?.weatherCode ?? -1;
    if (code < 0) return 'pi-cloud';
    if (code === 0 || code === 1) return 'pi-sun';
    if (code === 2 || code === 3) return 'pi-cloud';
    if (code >= 45 && code <= 48) return 'pi-eye-slash';
    if (code >= 51 && code <= 67) return 'pi-cloud-rain';
    if (code >= 71 && code <= 77) return 'pi-snowflake';
    if (code >= 80 && code <= 82) return 'pi-cloud-rain';
    if (code >= 95) return 'pi-bolt';
    return 'pi-cloud';
  });

  protected readonly weatherIconColor = computed(() =>
    this.weather() ? 'var(--p-surface-400)' : 'var(--p-surface-300)'
  );

  protected readonly weatherTempText = computed(() => {
    const w = this.weather();
    if (!w) return '—';
    return `↓${w.tempMin}° ↑${w.tempMax}°`;
  });

  protected readonly weatherTextColor = computed(() =>
    this.weather() ? 'var(--p-surface-400)' : 'var(--p-surface-300)'
  );

  protected readonly specialEvent = computed((): SpecialEvent | null => {
    const monthDay = this.day().date.slice(5); // MM-DD
    return SPECIAL_EVENTS[monthDay] ?? null;
  });

  protected readonly dayLabelIcon = computed((): { icon: string; color: string } => {
    const label = this.day().label?.toLowerCase() ?? '';
    if (label === 'aniversario') return { icon: 'pi-heart', color: 'var(--p-surface-700)' };
    if (label.includes('llegada')) return { icon: 'pi-map-marker', color: 'var(--p-surface-600)' };
    if (label.includes('salida')) return { icon: 'pi-send', color: 'var(--p-surface-600)' };
    return { icon: 'pi-info-circle', color: 'var(--p-surface-500)' };
  });
}
