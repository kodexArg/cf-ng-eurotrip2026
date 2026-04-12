import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-transport-details',
  imports: [],
  template: `
    @if (company() || duration()) {
      <div class="text-xs" style="color: var(--p-surface-400)">
        @if (company()) {
          <span>{{ company() }}</span>
        }
        @if (company() && duration()) {
          <span> • </span>
        }
        @if (duration()) {
          <span>{{ duration() }}</span>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportDetails {
  readonly company = input<string | null>();
  readonly duration = input<string | null>();
}
