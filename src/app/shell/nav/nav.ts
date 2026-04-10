import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [Menubar, Button, RouterLink, RouterLinkActive],
  template: `
    <nav class="hidden md:block">
      <p-menubar [model]="menuItems" />
    </nav>

    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t border-surface-200 py-1">
      <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{ exact: true }">
        <p-button icon="pi pi-home" label="Inicio" [text]="true" size="small" />
      </a>
      <a routerLink="/mapa" routerLinkActive="text-primary">
        <p-button icon="pi pi-map" label="Mapa" [text]="true" size="small" />
      </a>
      <a routerLink="/calendario" routerLinkActive="text-primary">
        <p-button icon="pi pi-calendar" label="Agenda" [text]="true" size="small" />
      </a>
      <a routerLink="/itinerario" routerLinkActive="text-primary">
        <p-button icon="pi pi-list" label="Viaje" [text]="true" size="small" />
      </a>
      <a routerLink="/fotos" routerLinkActive="text-primary">
        <p-button icon="pi pi-images" label="Fotos" [text]="true" size="small" />
      </a>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  private router = inject(Router);

  readonly menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Mapa', icon: 'pi pi-map', routerLink: '/mapa' },
    { label: 'Calendario', icon: 'pi pi-calendar', routerLink: '/calendario' },
    { label: 'Itinerario', icon: 'pi pi-list', routerLink: '/itinerario' },
    {
      label: 'Ciudades',
      icon: 'pi pi-building',
      items: [
        { label: 'Madrid', command: () => this.router.navigate(['/madrid']) },
        { label: 'Barcelona', command: () => this.router.navigate(['/barcelona']) },
        { label: 'París', command: () => this.router.navigate(['/paris']) },
        { label: 'Venecia', command: () => this.router.navigate(['/venecia']) },
        { label: 'Roma', command: () => this.router.navigate(['/roma']) },
      ],
    },
    { label: 'Fotos', icon: 'pi pi-images', routerLink: '/fotos' },
  ];
}
