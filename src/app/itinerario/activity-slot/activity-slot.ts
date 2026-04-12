import { ChangeDetectionStrategy, Component, computed, inject, input, output, viewChild } from '@angular/core';
import { Tag } from 'primeng/tag';
import { Activity } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { ActivityTypeChip } from '../activity-type-chip/activity-type-chip';
import { ActivityEditDialog } from '../activity-edit-dialog/activity-edit-dialog';
import { AuthService } from '../../shared/services/auth.service';
import { EditService } from '../../shared/services/edit.service';

@Component({
  selector: 'app-activity-slot',
  standalone: true,
  imports: [Tag, ConfirmedBadge, ActivityTypeChip, ActivityEditDialog],
  template: `
    <div class="flex items-start gap-2 py-1">
      <p-tag [value]="slotLabel()" severity="secondary" styleClass="text-xs min-w-16" />
      <div class="flex-1 flex items-start gap-1.5">
        <app-activity-type-chip [tipo]="activity().tipo" />
        <span class="text-sm" style="color: var(--p-surface-700)">{{ activity().description }}</span>
        @if (activity().costHint) {
          <span class="text-xs ml-1" style="color: var(--p-surface-400)">{{ activity().costHint }}</span>
        }
      </div>
      @if (activity().confirmed) {
        <app-confirmed-badge
          [editable]="auth.isAuthenticated()"
          (toggle)="onToggleConfirmed()"
        />
      }
      @if (auth.isAuthenticated()) {
        <button
          type="button"
          class="pi pi-pencil text-xs opacity-40 hover:opacity-100 transition-opacity ml-1 mt-0.5 bg-transparent border-none cursor-pointer"
          (click)="editDialog().open(activity())"
          title="Editar actividad"
        ></button>
      }
    </div>
    <app-activity-edit-dialog (saved)="onSaved($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitySlot {
  readonly activity = input.required<Activity>();
  readonly updated = output<void>();

  protected readonly auth = inject(AuthService);
  private readonly editService = inject(EditService);

  protected readonly editDialog = viewChild.required(ActivityEditDialog);

  readonly slotLabel = computed(() => {
    const labels: Record<string, string> = {
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      'all-day': 'Todo el día',
    };
    return labels[this.activity().timeSlot] ?? this.activity().timeSlot;
  });

  protected onToggleConfirmed(): void {
    const act = this.activity();
    this.editService.patchActivity(act.id, { confirmed: !act.confirmed }).subscribe({
      next: () => {
        console.log('Activity confirmed toggled', act.id);
        this.updated.emit();
      },
      error: (err) => console.error('Failed to toggle confirmed', err),
    });
  }

  protected onSaved(event: { id: string; changes: Record<string, unknown> }): void {
    this.editService.patchActivity(event.id, event.changes).subscribe({
      next: () => {
        console.log('Activity saved', event.id, event.changes);
        this.updated.emit();
      },
      error: (err) => console.error('Failed to save activity', err),
    });
  }
}
