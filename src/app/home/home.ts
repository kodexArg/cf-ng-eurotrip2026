import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

interface CityPreview {
  slug: string;
  name: string;
  color: string;
  dates: string;
  nights: number;
}

const CITIES_PREVIEW: CityPreview[] = [
  { slug: 'madrid', name: 'Madrid', color: '#e8a74e', dates: '20–24 abr', nights: 4 },
  { slug: 'barcelona', name: 'Barcelona', color: '#e07b5a', dates: '24–30 abr', nights: 6 },
  { slug: 'paris', name: 'París', color: '#7e8cc4', dates: '30 abr – 2 may', nights: 2 },
  { slug: 'venecia', name: 'Venecia', color: '#0d9488', dates: '2–4 may', nights: 2 },
  { slug: 'roma', name: 'Roma', color: '#c27ba0', dates: '4–9 may', nights: 5 },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Card, Button],
  template: `
    <div class="max-w-4xl mx-auto p-4 flex flex-col gap-6">

      <p-card>
        <ng-template pTemplate="header">
          <div class="p-6 text-center">
            <h1 class="text-4xl font-bold mb-2" style="color: var(--p-surface-900)">
              Gabriel &amp; Vanesa — Europa 2026
            </h1>
            <p class="text-lg mb-1" style="color: var(--p-surface-700)">
              17 abril – 9 mayo · 22 días
            </p>
            <p class="text-sm" style="color: var(--p-surface-500)">
              MAD → BCN → PAR → VCE → ROM
            </p>
          </div>
        </ng-template>
      </p-card>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        @for (city of cities; track city.slug) {
          <a [routerLink]="'/' + city.slug" class="no-underline">
            <p-card styleClass="h-full cursor-pointer hover:shadow-lg transition-shadow">
              <ng-template pTemplate="header">
                <div class="h-3 rounded-t-lg" [style.background-color]="city.color"></div>
              </ng-template>
              <div class="text-center flex flex-col gap-1">
                <span class="text-base font-semibold" style="color: var(--p-surface-800)">
                  {{ city.name }}
                </span>
                <span class="text-xs" style="color: var(--p-surface-500)">{{ city.dates }}</span>
                <span class="text-xs" style="color: var(--p-surface-400)">
                  {{ city.nights }} noches
                </span>
              </div>
            </p-card>
          </a>
        }
      </div>

      <p-card>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="text-center">
            <span class="text-2xl font-bold" style="color: var(--p-surface-900)">22</span>
            <p class="text-sm" style="color: var(--p-surface-500)">días</p>
          </div>
          <div class="text-center">
            <span class="text-2xl font-bold" style="color: var(--p-surface-900)">5</span>
            <p class="text-sm" style="color: var(--p-surface-500)">ciudades</p>
          </div>
          <div class="text-center">
            <span class="text-2xl font-bold" style="color: var(--p-surface-900)">3</span>
            <p class="text-sm" style="color: var(--p-surface-500)">tramos</p>
          </div>
        </div>
      </p-card>

      <div class="flex flex-wrap justify-center gap-3">
        <p-button
          label="Ver itinerario"
          icon="pi pi-list"
          routerLink="/itinerario"
          size="large"
        />
        <p-button
          label="Ver mapa"
          icon="pi pi-map"
          routerLink="/mapa"
          size="large"
          severity="secondary"
          [outlined]="true"
        />
        <p-button
          label="Ver calendario"
          icon="pi pi-calendar"
          routerLink="/calendario"
          size="large"
          severity="secondary"
          [outlined]="true"
        />
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly cities = CITIES_PREVIEW;
}
