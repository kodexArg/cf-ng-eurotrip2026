import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nav',
  imports: [Menubar, Button, RouterLink, RouterLinkActive],
  template: `
    <nav class="hidden md:block">
      <div class="flex items-center">
        <p-menubar [model]="menuItems" styleClass="flex-1" />
        <!-- TODO: re-enable when auth system is ready — disabled 2026-04-12
        <a routerLink="/admin" routerLinkActive="text-primary" class="no-underline">
          <p-button icon="pi pi-cog" [text]="true" size="small" />
        </a>
        -->
      </div>
    </nav>

    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t border-surface-200 py-1">
      <a routerLink="/calendario" routerLinkActive="text-primary">
        <p-button icon="pi pi-calendar" label="Agenda" [text]="true" size="small" />
      </a>
      <a routerLink="/itinerario" routerLinkActive="text-primary">
        <p-button icon="pi pi-list" label="Viaje" [text]="true" size="small" />
      </a>
      <a routerLink="/mapa" routerLinkActive="text-primary">
        <p-button icon="pi pi-map" label="Mapa" [text]="true" size="small" />
      </a>
      <a routerLink="/sitios" routerLinkActive="text-primary">
        <p-button icon="pi pi-building" label="Sitios" [text]="true" size="small" />
      </a>
      <a routerLink="/fotos" routerLinkActive="text-primary">
        <p-button icon="pi pi-images" label="Fotos" [text]="true" size="small" />
      </a>
      <a routerLink="/reservas" routerLinkActive="text-primary">
        <p-button icon="pi pi-wallet" label="Reservas" [text]="true" size="small" />
      </a>
      <a routerLink="/modificaciones" routerLinkActive="text-primary">
        <p-button icon="pi pi-pencil" label="Editar" [text]="true" size="small" />
      </a>
      <!-- TODO: re-enable when auth system is ready — disabled 2026-04-12
      <a routerLink="/admin" routerLinkActive="text-primary">
        <p-button icon="pi pi-cog" [text]="true" size="small" />
      </a>
      -->
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  readonly menuItems: MenuItem[] = [
    { label: 'Calendario', icon: 'pi pi-calendar', routerLink: '/calendario' },
    { label: 'Itinerario', icon: 'pi pi-list', routerLink: '/itinerario' },
    { label: 'Mapa', icon: 'pi pi-map', routerLink: '/mapa' },
    { label: 'Sitios', icon: 'pi pi-building', routerLink: '/sitios' },
    { label: 'Fotos', icon: 'pi pi-images', routerLink: '/fotos' },
    { label: 'Reservas', icon: 'pi pi-wallet', routerLink: '/reservas' },
    { label: 'Modificaciones', icon: 'pi pi-pencil', routerLink: '/modificaciones' },
  ];
}
