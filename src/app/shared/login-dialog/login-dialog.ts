import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  imports: [FormsModule, Dialog, Button, InputText, SelectButton],
  template: `
    <p-dialog
      header="Iniciar sesión"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '20rem' }"
      [closable]="true"
    >
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
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginDialog {
  private readonly auth = inject(AuthService);

  visible = false;
  passphrase = '';
  selectedName = 'Gabriel';
  readonly nameOptions = [
    { label: 'Gabriel', value: 'Gabriel' },
    { label: 'Vanesa', value: 'Vanesa' },
  ];

  readonly loading = signal(false);
  readonly error = signal(false);

  open(): void {
    this.passphrase = '';
    this.error.set(false);
    this.visible = true;
  }

  async submit(): Promise<void> {
    if (!this.passphrase) return;
    this.loading.set(true);
    this.error.set(false);
    const ok = await this.auth.login(this.passphrase, this.selectedName);
    this.loading.set(false);
    if (ok) {
      this.visible = false;
    } else {
      this.error.set(true);
    }
  }
}
