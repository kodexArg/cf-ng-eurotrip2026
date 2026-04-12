import { ChangeDetectionStrategy, Component, computed, inject, input, output, viewChild } from '@angular/core';
import { TransportLeg } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { TransportDetails } from '../transport-details/transport-details';
import { TransportEditDialog } from '../transport-edit-dialog/transport-edit-dialog';
import { AuthService } from '../../shared/services/auth.service';
import { EditService } from '../../shared/services/edit.service';

@Component({
  selector: 'app-transport-inline',
  imports: [ConfirmedBadge, TransportDetails, TransportEditDialog],
  template: `
    <div class="flex items-center gap-3 py-3 px-4 my-3 rounded-lg border"
         style="background-color: var(--p-surface-50); border-color: var(--p-surface-200)">
      <i [class]="modeIcon()" style="color: var(--p-primary-color); font-size: 1.125rem"></i>
      <div class="flex-1">
        <span class="text-sm font-medium" style="color: var(--p-surface-700)">{{ leg().label }}</span>
        <app-transport-details [company]="leg().company" [duration]="leg().duration" />
      </div>
      @if (leg().costHint || leg().fare) {
        <span class="text-xs" style="color: var(--p-surface-500)">{{ leg().fare || leg().costHint }}</span>
      }
      @if (auth.isAuthenticated()) {
        <i class="pi pi-pencil text-xs opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
           style="color: var(--p-surface-600)"
           (click)="editDialog().open(leg())"></i>
      }
      @if (leg().confirmed) {
        <app-confirmed-badge />
      }
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
      train: 'pi pi-arrow-right-arrow-left',
      daytrip: 'pi pi-map-marker',
      ferry: 'pi pi-compass',
    };
    return icons[this.leg().mode] ?? 'pi pi-car';
  });

  onSaved(event: { id: string; changes: Partial<TransportLeg> }): void {
    this.editService.patchTransport(event.id, event.changes as Record<string, unknown>).subscribe();
    this.updated.emit(event);
  }
}
