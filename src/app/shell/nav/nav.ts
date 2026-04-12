import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../shared/services/auth.service';
import { LoginDialog } from '../../shared/login-dialog/login-dialog';

@Component({
  selector: 'app-nav',
  imports: [Menubar, Button, RouterLink, RouterLinkActive, LoginDialog],
  template: `
    <nav class="hidden md:block">
      <div class="flex items-center">
        <p-menubar [model]="menuItems" styleClass="flex-1" />
        @if (auth.isAuthenticated()) {
          <p-button
            [label]="auth.userName() ?? ''"
            icon="pi pi-lock-open"
            [text]="true"
            size="small"
            (onClick)="auth.logout()"
          />
        } @else {
          <p-button
            icon="pi pi-lock"
            [text]="true"
            size="small"
            (onClick)="loginDialog().open()"
          />
        }
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
      <a routerLink="/madrid" routerLinkActive="text-primary">
        <p-button icon="pi pi-building" label="Sitios" [text]="true" size="small" />
      </a>
      <a routerLink="/fotos" routerLinkActive="text-primary">
        <p-button icon="pi pi-images" label="Fotos" [text]="true" size="small" />
      </a>
      @if (auth.isAuthenticated()) {
        <p-button icon="pi pi-lock-open" [text]="true" size="small" (onClick)="auth.logout()" />
      } @else {
        <p-button icon="pi pi-lock" [text]="true" size="small" (onClick)="loginDialog().open()" />
      }
    </nav>

    <app-login-dialog />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav implements OnInit {
  private router = inject(Router);
  readonly auth = inject(AuthService);
  readonly loginDialog = viewChild.required(LoginDialog);

  ngOnInit(): void {
    this.auth.checkAuth();
  }

  readonly menuItems: MenuItem[] = [
    { label: 'Calendario', icon: 'pi pi-calendar', routerLink: '/calendario' },
    { label: 'Itinerario', icon: 'pi pi-list', routerLink: '/itinerario' },
    { label: 'Mapa', icon: 'pi pi-map', routerLink: '/mapa' },
    {
      label: 'Sitios',
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
