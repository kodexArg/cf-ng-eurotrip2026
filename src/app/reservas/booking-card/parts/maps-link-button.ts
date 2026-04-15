import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

/**
 * Renders a maps-link anchor that opens a Google Maps URL in a new tab.
 *
 * @remarks
 * Input variants:
 * - `url` (required): full Google Maps URL to open.
 * - `label` (optional, default `'Ver en mapa'`): tooltip text shown on hover.
 */
@Component({
  selector: 'app-maps-link-button',
  standalone: true,
  imports: [Tooltip],
  template: `
    <a
      [href]="url()"
      target="_blank"
      rel="noopener noreferrer"
      class="pi pi-map-marker text-sm shrink-0 no-underline hover:opacity-80"
      style="color: var(--p-primary-color)"
      [pTooltip]="label()"
      tooltipPosition="left"
      [showDelay]="300"
    ></a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsLinkButton {
  readonly url = input.required<string>();
  readonly label = input<string>('Ver en mapa');
}
