import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-confirmed-badge',
  imports: [Tag],
  template: `<p-tag value="✓ Confirmado" severity="success" styleClass="text-xs" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmedBadge {}
