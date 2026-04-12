import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  imports: [],
  template: `
    <div class="rounded-xl border border-surface-200 bg-white shadow-sm p-8 text-center">
      <h1 class="text-4xl font-bold mb-2" style="color: var(--p-surface-900)">
        Gabriel &amp; Vanesa — Europa 2026
      </h1>
      <p class="text-lg mb-1" style="color: var(--p-surface-700)">
        19 abril – 9 mayo · 21 días
      </p>
      <p class="text-sm" style="color: var(--p-surface-500)">
        SCL → MAD → BCN → PAR → VCE → ROM → EZE
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBanner {}
