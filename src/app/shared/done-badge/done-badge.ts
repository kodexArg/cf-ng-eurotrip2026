import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Amber check-circle icon indicating a completed (done) event, optionally interactive.
 *
 * @remarks
 * - `editable`: when true, clicking the icon emits `toggle` so the parent can flip the done state.
 */
@Component({
  selector: 'app-done-badge',
  standalone: true,
  template: `
    <i
      class="pi pi-check-circle text-xs ml-1"
      style="color: #f59e0b"
      title="Hecho!"
      [class.cursor-pointer]="editable()"
      (click)="onClick()"
    ></i>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoneBadge {
  readonly editable = input(false);
  readonly toggle = output<void>();

  protected onClick(): void {
    if (this.editable()) {
      this.toggle.emit();
    }
  }
}
