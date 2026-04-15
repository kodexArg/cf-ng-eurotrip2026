import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';

/**
 * Static trip statistics card showing total days, cities, and transfers.
 */
@Component({
  selector: 'app-trip-stats',
  imports: [Card],
  template: `
    <p-card>
      <div class="flex flex-wrap justify-center gap-4 select-none">
        <div class="text-center">
          <span class="text-2xl font-bold" style="color: var(--p-surface-900)">22</span>
          <p class="text-sm" style="color: var(--p-surface-500)">días</p>
        </div>
        <div class="text-center">
          <span class="text-2xl font-bold" style="color: var(--p-surface-900)">5</span>
          <p class="text-sm" style="color: var(--p-surface-500)">ciudades</p>
        </div>
        <div class="text-center">
          <span class="text-2xl font-bold" style="color: var(--p-surface-900)">7</span>
          <p class="text-sm" style="color: var(--p-surface-500)">traslados</p>
        </div>
      </div>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripStats {}
