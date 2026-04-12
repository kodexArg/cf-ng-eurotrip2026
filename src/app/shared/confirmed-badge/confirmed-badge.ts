import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmed-badge',
  standalone: true,
  template: `
    <i
      class="pi pi-check text-xs ml-1"
      style="color: var(--p-green-500)"
      [class.cursor-pointer]="editable()"
      (click)="onClick()"
    ></i>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmedBadge {
  readonly editable = input(false);
  readonly toggle = output<void>();

  protected onClick(): void {
    if (this.editable()) {
      this.toggle.emit();
    }
  }
}
