import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';

/**
 * Standardized error state with a message and a retry button.
 *
 * @remarks
 * - `message`: human-readable error text displayed in the PrimeNG Message component.
 * Emits `retry` when the user clicks the retry button.
 */
@Component({
  selector: 'app-error-state',
  imports: [Message, Button],
  template: `
    <div class="flex flex-col items-center gap-3 p-4">
      <p-message severity="error" [text]="message()" />
      <p-button label="Reintentar" icon="pi pi-refresh" severity="secondary" (onClick)="retry.emit()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorState {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
