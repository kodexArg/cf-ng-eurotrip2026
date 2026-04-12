import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Booking, BookingType } from '../../shared/models';

interface BookingDraft {
  id?: string;
  type: BookingType;
  description: string;
  sort_date: string;
  time: string;
  cost_usd: number | null;
  confirmed: boolean;
  notes: string;
  origin: string;
  destination: string;
  mode: string;
  carrier: string;
  accommodation: string;
  checkout_date: string;
}

const EMPTY_DRAFT: BookingDraft = {
  type: 'hito',
  description: '',
  sort_date: '',
  time: '',
  cost_usd: null,
  confirmed: false,
  notes: '',
  origin: '',
  destination: '',
  mode: '',
  carrier: '',
  accommodation: '',
  checkout_date: '',
};

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    FormsModule,
    Dialog,
    Button,
    SelectButton,
    InputText,
    InputNumber,
    Checkbox,
    Textarea,
    Select,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="isEdit() ? 'Editar reserva' : 'Nueva reserva'"
      [modal]="true"
      [style]="{ width: '28rem' }"
      [closable]="true"
    >
      <div class="flex flex-col gap-3 py-2">
        <!-- Type -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Tipo</label>
          <p-selectbutton
            [options]="typeOptions"
            [(ngModel)]="draft.type"
            optionLabel="label"
            optionValue="value"
            [disabled]="isEdit()"
          />
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Descripción *</label>
          <input pInputText [(ngModel)]="draft.description" placeholder="Descripción" />
        </div>

        <!-- Date -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Fecha *</label>
          <input pInputText type="date" [(ngModel)]="draft.sort_date" />
        </div>

        <!-- Time -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Hora</label>
          <input pInputText type="time" [(ngModel)]="draft.time" />
        </div>

        <!-- Viaje fields -->
        @if (draft.type === 'viaje') {
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-600)">Origen</label>
            <input pInputText [(ngModel)]="draft.origin" placeholder="Ciudad de origen" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-600)">Destino</label>
            <input pInputText [(ngModel)]="draft.destination" placeholder="Ciudad de destino" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-600)">Modo</label>
            <p-select
              [options]="modeOptions"
              [(ngModel)]="draft.mode"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar modo"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-600)">Compañía</label>
            <input pInputText [(ngModel)]="draft.carrier" placeholder="Aerolínea / empresa" />
          </div>
        }

        <!-- Hospedaje fields -->
        @if (draft.type === 'hospedaje') {
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-600)">Alojamiento</label>
            <input pInputText [(ngModel)]="draft.accommodation" placeholder="Nombre del alojamiento" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-600)">Fecha de salida</label>
            <input pInputText type="date" [(ngModel)]="draft.checkout_date" />
          </div>
        }

        <!-- Cost -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Costo</label>
          <p-inputnumber [(ngModel)]="draft.cost_usd" mode="decimal" prefix="US$ " [minFractionDigits]="0" [maxFractionDigits]="2" placeholder="0" />
        </div>

        <!-- Confirmed -->
        <div class="flex items-center gap-2">
          <p-checkbox [(ngModel)]="draft.confirmed" [binary]="true" inputId="confirmed" />
          <label for="confirmed" class="text-sm" style="color: var(--p-surface-700)">Confirmado</label>
        </div>

        <!-- Notes -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium" style="color: var(--p-surface-600)">Notas</label>
          <textarea pTextarea [(ngModel)]="draft.notes" rows="3" placeholder="Notas adicionales"></textarea>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="visible = false" />
        <p-button label="Guardar" icon="pi pi-check" (onClick)="onSave()" [disabled]="!draft.description || !draft.sort_date" />
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingDialog {
  readonly saved = output<{ id?: string; data: Record<string, unknown> }>();

  visible = false;
  readonly isEdit = signal(false);

  draft: BookingDraft = { ...EMPTY_DRAFT };
  private original: BookingDraft | null = null;

  readonly typeOptions = [
    { label: 'Hito', value: 'hito' },
    { label: 'Viaje', value: 'viaje' },
    { label: 'Hospedaje', value: 'hospedaje' },
  ];

  readonly modeOptions = [
    { label: 'Vuelo', value: 'flight' },
    { label: 'Tren', value: 'train' },
    { label: 'Bus', value: 'bus' },
    { label: 'Ferry', value: 'ferry' },
    { label: 'Auto', value: 'car' },
    { label: 'Otro', value: 'other' },
  ];

  openCreate(): void {
    this.draft = { ...EMPTY_DRAFT };
    this.original = null;
    this.isEdit.set(false);
    this.visible = true;
  }

  openEdit(booking: Booking): void {
    this.draft = {
      id: booking.id,
      type: booking.type,
      description: booking.description,
      sort_date: booking.sortDate,
      time: booking.time ?? '',
      cost_usd: booking.costUsd,
      confirmed: booking.confirmed,
      notes: booking.notes ?? '',
      origin: booking.origin ?? '',
      destination: booking.destination ?? '',
      mode: booking.mode ?? '',
      carrier: booking.carrier ?? '',
      accommodation: booking.accommodation ?? '',
      checkout_date: booking.checkoutDate ?? '',
    };
    this.original = { ...this.draft };
    this.isEdit.set(true);
    this.visible = true;
  }

  onSave(): void {
    if (!this.draft.description || !this.draft.sort_date) return;

    if (this.original) {
      // Edit mode: emit only changed fields
      const changes: Record<string, unknown> = {};
      const keys = Object.keys(this.draft) as (keyof BookingDraft)[];
      for (const key of keys) {
        if (key === 'id') continue;
        if (this.draft[key] !== this.original[key]) {
          changes[key] = this.draft[key];
        }
      }
      this.saved.emit({ id: this.draft.id, data: changes });
    } else {
      // Create mode: emit full draft
      const { id, ...data } = this.draft;
      this.saved.emit({ data: data as Record<string, unknown> });
    }

    this.visible = false;
  }
}
