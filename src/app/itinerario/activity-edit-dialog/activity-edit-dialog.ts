import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { Activity, ActivityTipo, TimeSlot } from '../../shared/models';

interface ActivityChanges {
  id: string;
  changes: Record<string, unknown>;
}

@Component({
  selector: 'app-activity-edit-dialog',
  standalone: true,
  imports: [FormsModule, Dialog, Button, Select, InputText, Textarea, Checkbox],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      header="Editar actividad"
      styleClass="w-full max-w-lg"
    >
      @if (original()) {
        <div class="flex flex-col gap-4 pt-2">

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-500)">Descripción</label>
            <textarea
              pTextarea
              [(ngModel)]="draft.description"
              rows="3"
              class="w-full text-sm"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-xs font-medium" style="color: var(--p-surface-500)">Franja horaria</label>
              <p-select
                [(ngModel)]="draft.timeSlot"
                [options]="timeSlotOptions"
                optionLabel="label"
                optionValue="value"
                styleClass="w-full text-sm"
              />
            </div>

            <div class="flex flex-col gap-1 flex-1">
              <label class="text-xs font-medium" style="color: var(--p-surface-500)">Tipo</label>
              <p-select
                [(ngModel)]="draft.tipo"
                [options]="tipoOptions"
                optionLabel="label"
                optionValue="value"
                styleClass="w-full text-sm"
              />
            </div>
          </div>

          <div class="flex gap-3">
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-xs font-medium" style="color: var(--p-surface-500)">Coste estimado</label>
              <input
                pInputText
                [(ngModel)]="draft.costHint"
                placeholder="ej. ~20€"
                class="w-full text-sm"
              />
            </div>

            <div class="flex flex-col gap-1 flex-1">
              <label class="text-xs font-medium" style="color: var(--p-surface-500)">Tarifa</label>
              <input
                pInputText
                [(ngModel)]="draft.fare"
                placeholder="ej. billete flex"
                class="w-full text-sm"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium" style="color: var(--p-surface-500)">Compañía</label>
            <input
              pInputText
              [(ngModel)]="draft.company"
              placeholder="ej. Renfe"
              class="w-full text-sm"
            />
          </div>

          <div class="flex items-center gap-2">
            <p-checkbox
              [(ngModel)]="draft.confirmed"
              [binary]="true"
              inputId="confirmed-check"
            />
            <label for="confirmed-check" class="text-sm" style="color: var(--p-surface-700)">Confirmado</label>
          </div>

        </div>
      }

      <ng-template #footer>
        <div class="flex justify-end gap-2 pt-2">
          <p-button
            label="Cancelar"
            severity="secondary"
            size="small"
            (onClick)="close()"
          />
          <p-button
            label="Guardar"
            size="small"
            (onClick)="save()"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityEditDialog {
  readonly saved = output<ActivityChanges>();

  protected visible = false;
  protected original = signal<Activity | null>(null);
  protected draft: Partial<Activity> & { fare?: string; company?: string } = {};

  protected readonly timeSlotOptions: { label: string; value: TimeSlot }[] = [
    { label: 'Mañana', value: 'morning' },
    { label: 'Tarde', value: 'afternoon' },
    { label: 'Noche', value: 'evening' },
    { label: 'Todo el día', value: 'all-day' },
  ];

  protected readonly tipoOptions: { label: string; value: ActivityTipo }[] = [
    { label: 'Visita', value: 'visit' },
    { label: 'Comida', value: 'food' },
    { label: 'Transporte', value: 'transport' },
    { label: 'Alojamiento', value: 'hotel' },
    { label: 'Ocio', value: 'leisure' },
    { label: 'Evento', value: 'event' },
  ];

  open(activity: Activity): void {
    this.original.set(activity);
    this.draft = {
      description: activity.description,
      timeSlot: activity.timeSlot,
      tipo: activity.tipo,
      costHint: activity.costHint ?? undefined,
      confirmed: activity.confirmed,
      fare: (activity as unknown as Record<string, string>)['fare'] ?? '',
      company: (activity as unknown as Record<string, string>)['company'] ?? '',
    };
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    this.original.set(null);
  }

  save(): void {
    const orig = this.original();
    if (!orig) return;

    const changes: Record<string, unknown> = {};

    if (this.draft.description !== orig.description) changes['description'] = this.draft.description;
    if (this.draft.timeSlot !== orig.timeSlot) changes['timeSlot'] = this.draft.timeSlot;
    if (this.draft.tipo !== orig.tipo) changes['tipo'] = this.draft.tipo;

    const origCostHint = orig.costHint ?? '';
    const draftCostHint = this.draft.costHint ?? '';
    if (draftCostHint !== origCostHint) changes['costHint'] = draftCostHint || null;

    if (this.draft.confirmed !== orig.confirmed) changes['confirmed'] = this.draft.confirmed;

    const origFare = (orig as unknown as Record<string, string>)['fare'] ?? '';
    const origCompany = (orig as unknown as Record<string, string>)['company'] ?? '';
    if ((this.draft.fare ?? '') !== origFare) changes['fare'] = this.draft.fare ?? '';
    if ((this.draft.company ?? '') !== origCompany) changes['company'] = this.draft.company ?? '';

    this.saved.emit({ id: orig.id, changes });
    this.close();
  }
}
