import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-confirmed-badge',
  standalone: true,
  imports: [Tag],
  template: `
    <p-tag
      value="✓"
      severity="success"
      [rounded]="true"
      styleClass="text-xxs"
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
