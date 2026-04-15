import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {
  TripEvent,
  TrasladoEvent,
  EstadiaEvent,
} from '../../shared/models/event.model';
import { City } from '../../shared/models/city.model';
import { EVENT_TYPES } from '../../shared/constants/event-types';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    FormsModule,
    Button,
    InputText,
    InputNumber,
    Select,
    Checkbox,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  template: `
<div class="max-w-2xl mx-auto mb-6 p-4 rounded-xl border" style="border-color: var(--p-surface-200)">

  <!-- Type selector -->
  <div class="mb-4">
    <div class="text-xs font-medium mb-1 select-none" style="color: var(--p-surface-500)">Tipo *</div>
    <div class="flex gap-2">
      @for (opt of typeOptions; track opt.value) {
        <button type="button"
          class="px-3 py-1 rounded-md text-sm border transition-colors cursor-pointer"
          [style]="formType === opt.value
            ? 'background: var(--p-primary-color); color: white; border-color: var(--p-primary-color)'
            : 'border-color: var(--p-surface-300); color: var(--p-surface-700)'"
          (click)="formType = opt.value">
          {{ opt.label }}
        </button>
      }
    </div>
  </div>

  <!-- Common fields -->
  <div class="grid grid-cols-2 gap-3 mb-3">
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">Título *</label>
      <input pInputText [(ngModel)]="formTitle" placeholder="Título del evento" class="w-full" />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">Fecha *</label>
      <input pInputText type="date" [(ngModel)]="formDate" class="w-full" />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">Ciudad origen *</label>
      <p-select [options]="cityOptions()" [(ngModel)]="formCityIn" optionLabel="name" optionValue="id" placeholder="Seleccionar" styleClass="w-full" />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">Ciudad destino</label>
      <p-select [options]="cityOptions()" [(ngModel)]="formCityOut" optionLabel="name" optionValue="id" placeholder="(opcional)" [showClear]="true" styleClass="w-full" />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">Timestamp entrada</label>
      <input pInputText [(ngModel)]="formTimestampIn" placeholder="2026-05-01T10:00:00+02:00" class="w-full" />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">Timestamp salida</label>
      <input pInputText [(ngModel)]="formTimestampOut" placeholder="(opcional)" class="w-full" />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">USD</label>
      <p-inputnumber [(ngModel)]="formUsd" [minFractionDigits]="2" [maxFractionDigits]="2" placeholder="0.00" styleClass="w-full" />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs" style="color: var(--p-surface-500)">Descripción</label>
      <input pInputText [(ngModel)]="formDescription" placeholder="(opcional)" class="w-full" />
    </div>
  </div>

  <!-- Confirmed -->
  <div class="mb-3 flex items-center gap-2">
    <p-checkbox [(ngModel)]="formConfirmed" [binary]="true" inputId="evt-confirmed" />
    <label for="evt-confirmed" class="text-sm select-none" style="color: var(--p-surface-700)">Confirmado</label>
  </div>

  <!-- Traslado extras -->
  @if (formType === EVENT_TYPES.TRASLADO) {
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Compañía</label>
        <input pInputText [(ngModel)]="formCompany" placeholder="ej. Ryanair" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Código vuelo/tren</label>
        <input pInputText [(ngModel)]="formVehicleCode" placeholder="ej. FR28" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Tarifa</label>
        <input pInputText [(ngModel)]="formFare" placeholder="ej. €49" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Asiento</label>
        <input pInputText [(ngModel)]="formSeat" placeholder="ej. 14A" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Duración (min)</label>
        <p-inputnumber [(ngModel)]="formDurationMin" [useGrouping]="false" placeholder="ej. 120" styleClass="w-full" />
      </div>
    </div>
  }

  <!-- Estadia extras -->
  @if (formType === EVENT_TYPES.ESTADIA) {
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Alojamiento *</label>
        <input pInputText [(ngModel)]="formAccommodation" placeholder="Nombre del hotel/airbnb" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Dirección</label>
        <input pInputText [(ngModel)]="formAddress" placeholder="(opcional)" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Check-in</label>
        <input pInputText [(ngModel)]="formCheckinTime" placeholder="ej. 15:00" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Check-out</label>
        <input pInputText [(ngModel)]="formCheckoutTime" placeholder="ej. 11:00" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Ref. reserva</label>
        <input pInputText [(ngModel)]="formBookingRef" placeholder="(opcional)" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs" style="color: var(--p-surface-500)">Plataforma</label>
        <input pInputText [(ngModel)]="formPlatform" placeholder="ej. Booking.com" class="w-full" />
      </div>
    </div>
  }

  <!-- Error -->
  @if (error()) {
    <small class="block mb-2 text-red-500">{{ error() }}</small>
  }

  <!-- Buttons -->
  <div class="flex gap-2 justify-end pt-2">
    <p-button label="Limpiar" icon="pi pi-times" severity="secondary" (onClick)="handleClear()" />
    <p-button
      label="Eliminar"
      icon="pi pi-trash"
      severity="danger"
      [disabled]="mode() === 'add'"
      (onClick)="handleDelete()"
    />
    <p-button
      [label]="mode() === 'add' ? 'Aceptar' : 'Modificar'"
      [icon]="mode() === 'add' ? 'pi pi-plus' : 'pi pi-check'"
      [disabled]="!isFormValid || (mode() === 'edit' && !isDirty) || saving()"
      [loading]="saving()"
      (onClick)="handleSave()"
    />
  </div>

  <p-confirmDialog />
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventForm {
  readonly EVENT_TYPES = EVENT_TYPES;

  readonly event = input<TripEvent | null>(null);
  readonly cities = input<readonly City[]>([]);

  readonly saved = output<void>();
  readonly deleted = output<void>();
  readonly cleared = output<void>();

  private readonly http = inject(HttpClient);
  private readonly confirmationService = inject(ConfirmationService);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  formType: 'hito' | 'traslado' | 'estadia' | '' = '';
  formTitle = '';
  formDescription = '';
  formDate = '';
  formTimestampIn = '';
  formTimestampOut = '';
  formCityIn = '';
  formCityOut = '';
  formUsd: number | null = null;
  formConfirmed = false;
  // traslado extras
  formCompany = '';
  formFare = '';
  formVehicleCode = '';
  formSeat = '';
  formDurationMin: number | null = null;
  // estadia extras
  formAccommodation = '';
  formAddress = '';
  formCheckinTime = '';
  formCheckoutTime = '';
  formBookingRef = '';
  formPlatform = '';

  readonly mode = computed<'add' | 'edit'>(() => this.event() !== null ? 'edit' : 'add');

  readonly cityOptions = computed(() =>
    this.cities().map(c => ({ name: c.name, id: c.id }))
  );

  readonly typeOptions = [
    { label: 'Hito',     value: EVENT_TYPES.HITO },
    { label: 'Viaje',    value: EVENT_TYPES.TRASLADO },
    { label: 'Hospedaje', value: EVENT_TYPES.ESTADIA },
  ];

  get isFormValid(): boolean {
    return !!this.formTitle && !!this.formDate && !!this.formCityIn && !!this.formType;
  }

  get isDirty(): boolean {
    const e = this.event();
    if (!e) return true;
    return (
      this.formTitle !== e.title ||
      this.formDescription !== (e.description ?? '') ||
      this.formDate !== e.date ||
      this.formTimestampIn !== e.timestampIn ||
      this.formTimestampOut !== (e.timestampOut ?? '') ||
      this.formCityIn !== e.cityIn ||
      this.formCityOut !== (e.cityOut ?? '') ||
      this.formUsd !== e.usd ||
      this.formConfirmed !== e.confirmed
    );
  }

  constructor() {
    effect(() => {
      const e = this.event();
      if (e) {
        this.formType = e.type;
        this.formTitle = e.title;
        this.formDescription = e.description ?? '';
        this.formDate = e.date;
        this.formTimestampIn = e.timestampIn;
        this.formTimestampOut = e.timestampOut ?? '';
        this.formCityIn = e.cityIn;
        this.formCityOut = e.cityOut ?? '';
        this.formUsd = e.usd;
        this.formConfirmed = e.confirmed;
        if (e.type === EVENT_TYPES.TRASLADO) {
          const t = e as TrasladoEvent;
          this.formCompany = t.company ?? '';
          this.formFare = t.fare ?? '';
          this.formVehicleCode = t.vehicleCode ?? '';
          this.formSeat = t.seat ?? '';
          this.formDurationMin = t.durationMin;
        } else {
          this.formCompany = ''; this.formFare = ''; this.formVehicleCode = ''; this.formSeat = ''; this.formDurationMin = null;
        }
        if (e.type === EVENT_TYPES.ESTADIA) {
          const s = e as EstadiaEvent;
          this.formAccommodation = s.accommodation;
          this.formAddress = s.address ?? '';
          this.formCheckinTime = s.checkinTime ?? '';
          this.formCheckoutTime = s.checkoutTime ?? '';
          this.formBookingRef = s.bookingRef ?? '';
          this.formPlatform = s.platform ?? '';
        } else {
          this.formAccommodation = ''; this.formAddress = ''; this.formCheckinTime = ''; this.formCheckoutTime = ''; this.formBookingRef = ''; this.formPlatform = '';
        }
      } else {
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.formType = ''; this.formTitle = ''; this.formDescription = '';
    this.formDate = ''; this.formTimestampIn = ''; this.formTimestampOut = '';
    this.formCityIn = ''; this.formCityOut = ''; this.formUsd = null; this.formConfirmed = false;
    this.formCompany = ''; this.formFare = ''; this.formVehicleCode = ''; this.formSeat = ''; this.formDurationMin = null;
    this.formAccommodation = ''; this.formAddress = ''; this.formCheckinTime = ''; this.formCheckoutTime = ''; this.formBookingRef = ''; this.formPlatform = '';
    this.error.set(null);
  }

  handleClear(): void { this.resetForm(); this.cleared.emit(); }

  handleSave(): void {
    this.confirmationService.confirm({
      message: this.mode() === 'add' ? '¿Agregar este evento?' : '¿Guardar los cambios?',
      header: this.mode() === 'add' ? 'Agregar' : 'Modificar',
      icon: 'pi pi-question-circle',
      accept: () => this.doSave(),
    });
  }

  async doSave(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    try {
      const payload = this.buildPayload();
      if (this.mode() === 'add') {
        await firstValueFrom(this.http.post('/api/events', payload));
      } else {
        await firstValueFrom(this.http.patch(`/api/events/${this.event()!.id}`, payload));
      }
      this.saved.emit();
    } catch {
      this.error.set('Error al guardar. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }

  handleDelete(): void {
    this.confirmationService.confirm({
      message: `¿Eliminar "${this.event()?.title}"? Esta acción no se puede deshacer.`,
      header: 'Eliminar evento',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger', label: 'Eliminar' },
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary' },
      accept: () => this.doDelete(),
    });
  }

  async doDelete(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`/api/events/${this.event()!.id}`));
      this.deleted.emit();
    } catch {
      this.error.set('Error al eliminar. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }

  private buildPayload(): Record<string, unknown> {
    const base: Record<string, unknown> = {
      type: this.formType, title: this.formTitle, description: this.formDescription || null,
      date: this.formDate, timestampIn: this.formTimestampIn,
      timestampOut: this.formTimestampOut || null,
      cityIn: this.formCityIn, cityOut: this.formCityOut || null,
      usd: this.formUsd, confirmed: this.formConfirmed,
    };
    if (this.formType === EVENT_TYPES.TRASLADO) {
      Object.assign(base, { company: this.formCompany || null, fare: this.formFare || null,
        vehicleCode: this.formVehicleCode || null, seat: this.formSeat || null, durationMin: this.formDurationMin });
    }
    if (this.formType === EVENT_TYPES.ESTADIA) {
      Object.assign(base, { accommodation: this.formAccommodation, address: this.formAddress || null,
        checkinTime: this.formCheckinTime || null, checkoutTime: this.formCheckoutTime || null,
        bookingRef: this.formBookingRef || null, platform: this.formPlatform || null });
    }
    return base;
  }
}
