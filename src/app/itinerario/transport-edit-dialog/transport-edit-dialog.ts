import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { TransportLeg } from '../../shared/models';

type EditableFields = Pick<TransportLeg, 'label' | 'company' | 'duration' | 'fare' | 'costHint' | 'confirmed'>;

@Component({
  selector: 'app-transport-edit-dialog',
  imports: [FormsModule, Dialog, Button, InputText, Checkbox],
  template: `
    <p-dialog
      header="Editar transporte"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '24rem' }"
      [closable]="true"
    >
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Etiqueta</label>
          <input pInputText [(ngModel)]="draft.label" class="w-full text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Compañía</label>
          <input pInputText [(ngModel)]="draft.company" class="w-full text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Duración</label>
          <input pInputText [(ngModel)]="draft.duration" class="w-full text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Tarifa</label>
          <input pInputText [(ngModel)]="draft.fare" class="w-full text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Pista de costo</label>
          <input pInputText [(ngModel)]="draft.costHint" class="w-full text-sm" />
        </div>
        <div class="flex items-center gap-2 pt-1">
          <p-checkbox [(ngModel)]="draft.confirmed" [binary]="true" inputId="confirmed-cb" />
          <label for="confirmed-cb" class="text-sm" style="color: var(--p-surface-700)">Confirmado</label>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <p-button label="Cancelar" severity="secondary" (onClick)="cancel()" />
          <p-button label="Guardar" icon="pi pi-check" (onClick)="save()" />
        </div>
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportEditDialog {
  readonly saved = output<{ id: string; changes: Partial<EditableFields> }>();

  visible = false;

  private legId = '';
  private original: EditableFields = {
    label: '',
    company: null,
    duration: null,
    fare: null,
    costHint: null,
    confirmed: false,
  };

  draft: EditableFields = { ...this.original };

  open(leg: TransportLeg): void {
    this.legId = leg.id;
    this.original = {
      label: leg.label,
      company: leg.company,
      duration: leg.duration,
      fare: leg.fare,
      costHint: leg.costHint,
      confirmed: leg.confirmed,
    };
    this.draft = { ...this.original };
    this.visible = true;
  }

  save(): void {
    const changes: Partial<EditableFields> = {};
    const keys = Object.keys(this.original) as (keyof EditableFields)[];
    for (const key of keys) {
      if (this.draft[key] !== this.original[key]) {
        (changes as Record<string, unknown>)[key] = this.draft[key];
      }
    }
    if (Object.keys(changes).length > 0) {
      this.saved.emit({ id: this.legId, changes });
    }
    this.visible = false;
  }

  cancel(): void {
    this.visible = false;
  }
}
