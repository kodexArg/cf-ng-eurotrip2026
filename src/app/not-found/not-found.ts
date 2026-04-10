import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MessageModule, ButtonModule, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <p-message severity="warn" text="Página no encontrada" />
      <p-button label="Volver al inicio" routerLink="/" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
