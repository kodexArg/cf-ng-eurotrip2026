import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nav',
  imports: [Menubar, RouterLink, RouterLinkActive],
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

    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-200 py-2 px-2">
      <div class="nav-scroll flex items-center gap-2 overflow-x-auto scroll-smooth">
        <a routerLink="/calendario" routerLinkActive #rla0="routerLinkActive" aria-label="Agenda"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla0.isActive"
           [style.color]="rla0.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla0.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla0.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-calendar text-xs"></i><span>Agenda</span>
        </a>
        <a routerLink="/itinerario" routerLinkActive #rla1="routerLinkActive" aria-label="Viaje"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla1.isActive"
           [style.color]="rla1.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla1.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla1.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-list text-xs"></i><span>Viaje</span>
        </a>
        <a routerLink="/mapa" routerLinkActive #rla2="routerLinkActive" aria-label="Mapa"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla2.isActive"
           [style.color]="rla2.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla2.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla2.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-map text-xs"></i><span>Mapa</span>
        </a>
        <a routerLink="/sitios" routerLinkActive #rla3="routerLinkActive" aria-label="Sitios"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla3.isActive"
           [style.color]="rla3.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla3.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla3.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-building text-xs"></i><span>Sitios</span>
        </a>
        <a routerLink="/fotos" routerLinkActive #rla4="routerLinkActive" aria-label="Fotos"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla4.isActive"
           [style.color]="rla4.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla4.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla4.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-images text-xs"></i><span>Fotos</span>
        </a>
        <a routerLink="/reservas" routerLinkActive #rla5="routerLinkActive" aria-label="Reservas"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla5.isActive"
           [style.color]="rla5.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla5.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla5.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-wallet text-xs"></i><span>Reservas</span>
        </a>
        <a routerLink="/modificaciones" routerLinkActive #rla6="routerLinkActive" aria-label="Editar"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla6.isActive"
           [style.color]="rla6.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla6.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla6.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-pencil text-xs"></i><span>Editar</span>
        </a>
        <!-- TODO: re-enable when auth system is ready — disabled 2026-04-12
        <a routerLink="/admin" routerLinkActive #rlaAdmin="routerLinkActive" aria-label="Admin"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [style.color]="rlaAdmin.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rlaAdmin.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rlaAdmin.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <i class="pi pi-cog text-xs"></i><span>Admin</span>
        </a>
        -->
      </div>
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
