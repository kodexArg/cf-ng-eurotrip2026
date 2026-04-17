import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Grey padlock indicating an event that MUST happen but isn't booked yet
 * (e.g. a transport whose price still has to be paid). Always visible —
 * mandatory items render even when the lightbulb (showUnconfirmed) is off.
 */
@Component({
  selector: 'app-mandatory-badge',
  standalone: true,
  template: `
    <i
      class="pi pi-lock text-xs ml-1"
      style="color: var(--p-surface-400)"
      title="Obligado"
    ></i>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandatoryBadge {}
