import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Day, DayWeather } from '../../shared/models';
import { ActivitySlot } from '../activity-slot/activity-slot';

@Component({
  selector: 'app-itinerary-day',
  imports: [DatePipe, TitleCasePipe, ActivitySlot],
  template: `
    <div class="flex" [id]="'day-' + day().date">
      <div class="w-16 shrink-0 flex flex-col items-center justify-center py-3 relative overflow-hidden"
           style="background-color: var(--p-surface-50); border-right: 1px solid var(--p-surface-200)">
        @if (weather()) {
          <i [class]="'pi ' + weatherIcon() + ' absolute'"
             style="font-size: 2.5rem; opacity: 0.07; color: var(--p-surface-900)"></i>
        }
        <span class="text-xs uppercase tracking-wide relative" style="color: var(--p-surface-400)">
          {{ day().date | date:'EEE' | titlecase }}
        </span>
        <span class="text-2xl font-bold leading-none mt-0.5 relative" style="color: var(--p-surface-700)">
          {{ day().date | date:'d' }}
        </span>
      </div>

      <div class="flex-1 flex flex-col py-2 px-3 min-w-0">
        @if (day().label) {
          <div class="flex items-center gap-1 mb-1">
            <i [class]="'pi ' + dayLabelIcon().icon + ' text-xs'"
               [style.color]="dayLabelIcon().color"></i>
            <span class="text-xs font-medium" [style.color]="dayLabelIcon().color">{{ day().label }}</span>
          </div>
        }
        <div class="flex flex-col gap-1 flex-1">
          @for (activity of displayActivities(); track activity.id) {
            <app-activity-slot [activity]="activity" />
          }
        </div>
        @if (costHints().length) {
          <div class="flex justify-end mt-1">
            <span class="text-xs" style="color: var(--p-surface-400)">
              {{ costHints().join(' \u00b7 ') }}
            </span>
          </div>
        }
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

  protected readonly displayActivities = computed(() =>
    this.day().activities.filter(a => a.tipo !== 'transport')
  );

  protected readonly costHints = computed(() =>
    this.displayActivities()
      .map(a => a.costHint)
      .filter((hint): hint is string => hint !== null && hint !== '')
  );

  protected readonly weatherIcon = computed(() => {
    const code = this.weather()?.weatherCode ?? -1;
    if (code === 0) return 'pi-sun';
    if (code <= 3) return 'pi-cloud';
    if (code >= 95) return 'pi-bolt';
    return 'pi-cloud';
  });

  protected readonly dayLabelIcon = computed((): { icon: string; color: string } => {
    const label = this.day().label?.toLowerCase() ?? '';
    if (label === 'aniversario') return { icon: 'pi-heart', color: 'var(--p-surface-700)' };
    if (label.includes('llegada')) return { icon: 'pi-map-marker', color: 'var(--p-surface-600)' };
    if (label.includes('salida')) return { icon: 'pi-send', color: 'var(--p-surface-600)' };
    return { icon: 'pi-info-circle', color: 'var(--p-surface-500)' };
  });
}
