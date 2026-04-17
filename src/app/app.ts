import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './shell/nav/nav';
import { SiteGateService } from './shared/services/site-gate.service';
import { SiteGatePanel } from './shared/site-gate-panel/site-gate-panel';

/**
 * Root application shell: mounts the top navigation bar and the router outlet.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, SiteGatePanel],
  template: `
    @if (gate.checked() && !gate.passed()) {
      <app-site-gate-panel />
    } @else if (gate.passed()) {
      <app-nav />
      <main class="min-h-screen">
        <router-outlet />
      </main>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly gate = inject(SiteGateService);
}
