import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-confirmed-badge',
  standalone: true,
  imports: [Tag],
  template: `
    <p-tag
      value="✓ Confirmado"
      severity="success"
      styleClass="text-xs"
      [class.cursor-pointer]="editable()"
      (click)="onClick()"
    />
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
