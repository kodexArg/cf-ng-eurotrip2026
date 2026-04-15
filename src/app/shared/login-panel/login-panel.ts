import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { AuthService } from '../services/auth.service';

/**
 * Full-page login panel shown when an authenticated-only route is accessed without a session.
 *
 * @remarks
 * Provides user name selector and passphrase input inline (no dialog).
 * Includes a back link to the itinerary page.
 */
@Component({
  selector: 'app-login-panel',
  standalone: true,
  imports: [FormsModule, Button, InputText, SelectButton, RouterLink],
  template: `
    <div class="max-w-sm mx-auto mt-16 p-6 rounded-xl border" style="background: var(--p-surface-0); border-color: var(--p-surface-200)">
      <h2 class="text-xl font-bold mb-1" style="color: var(--p-surface-800)">Acceso restringido</h2>
      <p class="text-sm mb-6" style="color: var(--p-surface-500)">Esta sección es solo para el administrador</p>

      <div class="flex flex-col gap-4">
        <p-selectbutton
          [options]="nameOptions"
          [(ngModel)]="selectedName"
          optionLabel="label"
          optionValue="value"
          styleClass="w-full"
        />
        <input
          pInputText
          type="password"
          placeholder="Contraseña"
          [(ngModel)]="passphrase"
          (keydown.enter)="submit()"
          class="w-full"
        />
        @if (error()) {
          <small class="text-red-500">Contraseña incorrecta</small>
        }
        <p-button
          label="Entrar"
          icon="pi pi-lock-open"
          (onClick)="submit()"
          [loading]="loading()"
          styleClass="w-full"
        />
      </div>

      <div class="mt-6 text-center">
        <a routerLink="/itinerario" class="text-sm" style="color: var(--p-surface-500)">← Volver al itinerario</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPanel {
  private readonly auth = inject(AuthService);

  passphrase = '';
  selectedName = 'Gabriel';

  readonly nameOptions = [
    { label: 'Gabriel', value: 'Gabriel' },
    { label: 'Vanesa', value: 'Vanesa' },
  ];

  readonly loading = signal(false);
  readonly error = signal(false);

  async submit(): Promise<void> {
    if (!this.passphrase) return;
    this.loading.set(true);
    this.error.set(false);
    const ok = await this.auth.login(this.passphrase, this.selectedName);
    this.loading.set(false);
    if (!ok) {
      this.error.set(true);
    }
  }
}
