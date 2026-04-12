import { ChangeDetectionStrategy, Component, computed, inject, input, output, viewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TransportLeg } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { TransportEditDialog } from '../transport-edit-dialog/transport-edit-dialog';
import { AuthService } from '../../shared/services/auth.service';
import { EditService, TransportPatch } from '../../shared/services/edit.service';

const CITY_NAMES: Record<string, string> = {
  scl: 'Santiago',
  mad: 'Madrid',
  bcn: 'Barcelona',
  par: 'París',
  rom: 'Roma',
  pmi: 'Palma',
  fir: 'Florencia',
};

@Component({
  selector: 'app-transport-inline',
  imports: [ConfirmedBadge, TransportEditDialog],
  template: `
    <div class="py-3 px-4 my-3 rounded-lg border" [class.opacity-60]="!leg().confirmed"
         style="background-color: var(--p-surface-50); border-color: var(--p-surface-200)">
      <div class="flex items-center gap-3">
        <i [class]="modeIcon()" style="color: var(--p-primary-color); font-size: 1.125rem"></i>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 text-sm font-semibold flex-wrap"
               style="color: var(--p-surface-800)">
            <span>{{ originName() }}</span>
            @if (leg().departureTime) {
              <span class="font-normal text-xs" style="color: var(--p-surface-500)">{{ leg().departureTime }}</span>
            }
            <span style="color: var(--p-surface-400)">→</span>
            <span>{{ destinationName() }}</span>
            @if (leg().arrivalTime) {
              <span class="font-normal text-xs" style="color: var(--p-surface-500)">{{ leg().arrivalTime }}</span>
            }
            @if (leg().duration) {
              <span class="text-xs font-medium ml-1" style="color: var(--p-primary-color)">{{ leg().duration }}</span>
            }
          </div>
          @if (secondLineVisible()) {
            <div class="flex items-center gap-2 text-xs mt-0.5 flex-wrap"
                 style="color: var(--p-surface-500)">
              @if (leg().company) {
                <span>{{ leg().company }}</span>
              }
              @if (leg().company && leg().label) {
                <span>·</span>
              }
              @if (leg().label) {
                <span>{{ leg().label }}</span>
              }
            </div>
          }
        </div>
        @if (leg().costHint || leg().fare) {
          <span class="text-xs shrink-0" style="color: var(--p-surface-500)">{{ leg().fare || leg().costHint }}</span>
        }
        @if (auth.isOwner()) {
          <i class="pi pi-pencil text-xs opacity-40 hover:opacity-100 cursor-pointer transition-opacity shrink-0"
             style="color: var(--p-surface-600)"
             (click)="editDialog().open(leg())"></i>
        }
        @if (leg().confirmed) {
          <app-confirmed-badge />
        }
      </div>
      <app-transport-edit-dialog (saved)="onSaved($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportInline {
  readonly leg = input.required<TransportLeg>();
  readonly updated = output<{ id: string; changes: Partial<TransportLeg> }>();

  readonly auth = inject(AuthService);
  private readonly editService = inject(EditService);

  readonly editDialog = viewChild.required(TransportEditDialog);

  readonly modeIcon = computed(() => {
    const icons: Record<string, string> = {
      flight: 'pi pi-send',
      train: 'pi pi-directions',
      daytrip: 'pi pi-map-marker',
      ferry: 'pi pi-compass',
    };
    return icons[this.leg().mode] ?? 'pi pi-car';
  });

  readonly originName = computed(() => this.resolveCityName(this.leg().fromCity));
  readonly destinationName = computed(() => this.resolveCityName(this.leg().toCity));

  readonly secondLineVisible = computed(() => !!(this.leg().company || this.leg().label));

  private resolveCityName(code: string): string {
    return CITY_NAMES[code.toLowerCase()] ?? code.toUpperCase();
  }

  async onSaved(event: { id: string; changes: Partial<TransportLeg> }): Promise<void> {
    try {
      await firstValueFrom(this.editService.patchTransport(event.id, event.changes as TransportPatch));
    } catch (err) {
      console.error('[TransportInline] Failed to save transport changes:', err);
    }
    this.updated.emit(event);
  }
}
