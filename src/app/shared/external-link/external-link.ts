import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-external-link',
  imports: [Button],
  template: `
    <a [href]="url()" target="_blank" rel="noopener noreferrer">
      <p-button
        [label]="label()"
        icon="pi pi-external-link"
        [severity]="severity()"
        [outlined]="true"
        size="small"
      />
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalLink {
  readonly url = input.required<string>();
  readonly label = input.required<string>();
  readonly severity = input<'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'>('secondary');
}
