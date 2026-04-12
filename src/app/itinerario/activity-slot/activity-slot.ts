import { ChangeDetectionStrategy, Component, computed, inject, input, output, viewChild } from '@angular/core';
import { Activity, TIPO_CONFIG } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { ActivityEditDialog } from '../activity-edit-dialog/activity-edit-dialog';
import { AuthService } from '../../shared/services/auth.service';
import { EditService } from '../../shared/services/edit.service';

@Component({
  selector: 'app-activity-slot',
  standalone: true,
  imports: [ConfirmedBadge, ActivityEditDialog],
  template: `
    <div class="flex items-start gap-2 py-1" [class.opacity-60]="!activity().confirmed">
      <i
        class="pi {{ tipoIcon().icon }} text-sm mt-0.5 shrink-0"
        [style.color]="tipoIcon().color"
        [title]="tipoIcon().label"
      ></i>
      <div class="flex-1 min-w-0">
        <span class="text-sm" style="color: var(--p-surface-700)">{{ activity().description }}</span>
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

  readonly tipoIcon = computed(() => {
    const cfg = TIPO_CONFIG[this.activity().tipo];
    return { icon: cfg.icon, color: cfg.text, label: cfg.label };
  });

  protected onToggleConfirmed(): void {
    const act = this.activity();
    this.editService.patchActivity(act.id, { confirmed: !act.confirmed }).subscribe({
      next: () => this.updated.emit(),
      error: () => {},
    });
  }

  protected onSaved(event: { id: string; changes: Record<string, unknown> }): void {
    this.editService.patchActivity(event.id, event.changes).subscribe({
      next: () => this.updated.emit(),
      error: () => {},
    });
  }
}
