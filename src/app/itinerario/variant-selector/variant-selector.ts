import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { VariantService } from '../../shared/services/variant.service';

@Component({
  selector: 'app-variant-selector',
  imports: [FormsModule, SelectButton],
  template: `
    <p-selectbutton
      [options]="variantOptions"
      [(ngModel)]="currentVariant"
      optionLabel="label"
      optionValue="value"
      (onChange)="onVariantChange($event.value)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantSelector {
  private readonly variantService = inject(VariantService);

  readonly variantOptions = [
    { label: '🚂 BCN → PAR en tren', value: 'train' },
    { label: '✈️ BCN → PAR en avión', value: 'main' },
  ];

  currentVariant: 'main' | 'train' = this.variantService.variant();

  onVariantChange(value: 'main' | 'train'): void {
    this.variantService.setVariant(value);
  }
}
