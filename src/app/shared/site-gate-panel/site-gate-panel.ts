import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SiteGateService } from '../services/site-gate.service';

@Component({
  selector: 'app-site-gate-panel',
  standalone: true,
  imports: [FormsModule, Button, InputText],
  template: `
    <div class="fixed inset-0 flex items-center justify-center p-6"
         style="background: var(--p-surface-50); z-index: 9999;">
      <div class="max-w-sm w-full p-6 rounded-xl border"
           style="background: var(--p-surface-0); border-color: var(--p-surface-200)">
        <h2 class="text-xl font-bold mb-6 text-center" style="color: var(--p-surface-800)">
          ¿A que sí adivinas la contraseña?
        </h2>

        <div class="flex flex-col gap-4">
          <input
            pInputText
            type="password"
            placeholder="Contraseña"
            [(ngModel)]="password"
            (keydown.enter)="submit()"
            class="w-full"
            autofocus
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
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteGatePanel {
  private readonly gate = inject(SiteGateService);

  password = '';
  readonly loading = signal(false);
  readonly error = signal(false);

  async submit(): Promise<void> {
    if (!this.password) return;
    this.loading.set(true);
    this.error.set(false);
    const ok = await this.gate.unlock(this.password);
    this.loading.set(false);
    if (!ok) {
      this.error.set(true);
      this.password = '';
    }
  }
}
