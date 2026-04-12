import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-quick-nav',
  imports: [RouterLink, Button],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      <p-button label="Ver itinerario" icon="pi pi-list" routerLink="/itinerario" size="large" />
      <p-button label="Ver mapa" icon="pi pi-map" routerLink="/mapa" size="large" severity="secondary" [outlined]="true" />
      <p-button label="Ver calendario" icon="pi pi-calendar" routerLink="/calendario" size="large" severity="secondary" [outlined]="true" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickNav {}
