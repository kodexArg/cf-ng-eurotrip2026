import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AppIcon } from '../../shared/icon/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [Menubar, RouterLink, RouterLinkActive, AppIcon],
  template: `
    <nav class="hidden md:block">
      <div class="flex items-center">
        <p-menubar [model]="menuItems()" styleClass="flex-1" />
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
          <app-icon icon="pi-calendar" size="0.75rem" /><span>Agenda</span>
        </a>
        <a routerLink="/itinerario" routerLinkActive #rla1="routerLinkActive" aria-label="Viaje"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla1.isActive"
           [style.color]="rla1.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla1.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla1.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <app-icon icon="pi-list" size="0.75rem" /><span>Viaje</span>
        </a>
        <a routerLink="/mapa" routerLinkActive #rla2="routerLinkActive" aria-label="Mapa"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla2.isActive"
           [style.color]="rla2.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla2.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla2.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <app-icon icon="pi-map" size="0.75rem" /><span>Mapa</span>
        </a>
        <a routerLink="/sitios" routerLinkActive #rla3="routerLinkActive" aria-label="Sitios"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla3.isActive"
           [style.color]="rla3.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla3.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla3.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <app-icon icon="ms-apartment" size="0.75rem" /><span>Sitios</span>
        </a>
        <a routerLink="/fotos" routerLinkActive #rla4="routerLinkActive" aria-label="Fotos"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla4.isActive"
           [style.color]="rla4.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla4.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla4.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <app-icon icon="pi-images" size="0.75rem" /><span>Fotos</span>
        </a>
        <a routerLink="/reservas" routerLinkActive #rla5="routerLinkActive" aria-label="Reservas"
           class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm no-underline transition-colors"
           [class.border-surface-200]="!rla5.isActive"
           [style.color]="rla5.isActive ? 'var(--p-primary-contrast-color)' : 'var(--p-surface-700)'"
           [style.background]="rla5.isActive ? 'var(--p-primary-color)' : 'transparent'"
           [style.borderColor]="rla5.isActive ? 'var(--p-primary-color)' : 'var(--p-surface-200)'">
          <app-icon icon="pi-wallet" size="0.75rem" /><span>Reservas</span>
        </a>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  private readonly auth = inject(AuthService);

  /** Only allowlisted editor emails (gcavedal / vanybou) see the edit surface. */
  readonly canEdit = this.auth.isOwner;

  readonly menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
      { label: 'Calendario', icon: 'pi pi-calendar', routerLink: '/calendario' },
      { label: 'Itinerario', icon: 'pi pi-list', routerLink: '/itinerario' },
      { label: 'Mapa', icon: 'pi pi-map', routerLink: '/mapa' },
      { label: 'Sitios', icon: 'pi pi-map-marker', routerLink: '/sitios' },
      { label: 'Fotos', icon: 'pi pi-images', routerLink: '/fotos' },
      { label: 'Reservas', icon: 'pi pi-wallet', routerLink: '/reservas' },
    ];
    return items;
  });
}
