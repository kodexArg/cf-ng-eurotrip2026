import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface CityPreview {
  slug: string;
  name: string;
  color: string;
  dates: string;
  nights: number;
}

/**
 * City summary card displayed on the home page.
 *
 * @remarks
 * Shows a colored top bar, city name, date range, and night count.
 * The entire card is a router link to the city's detail route.
 */
@Component({
  selector: 'app-city-preview-card',
  imports: [RouterLink],
  template: `
    <a [routerLink]="'/' + city().slug" class="no-underline">
      <div class="rounded-xl border border-surface-200 bg-white shadow-sm h-full cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
        <div class="h-2" [style.background-color]="city().color"></div>
        <div class="p-4 text-center flex flex-col gap-1 select-none">
          <span class="text-base font-semibold" style="color: var(--p-surface-800)">
            {{ city().name }}
          </span>
          <span class="text-xs" style="color: var(--p-surface-500)">{{ city().dates }}</span>
          <span class="text-xs" style="color: var(--p-surface-400)">
            {{ city().nights }} noches
          </span>
        </div>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityPreviewCard {
  readonly city = input.required<CityPreview>();
}
