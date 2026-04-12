import { ChangeDetectionStrategy, Component, computed, inject, input, output, viewChild } from '@angular/core';
import { Activity, TIPO_CONFIG } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { ActivityEditDialog } from '../activity-edit-dialog/activity-edit-dialog';
import { AuthService } from '../../shared/services/auth.service';
import { EditService, ActivityPatch } from '../../shared/services/edit.service';
import { InfoRow } from '../info-row/info-row';

@Component({
  selector: 'app-activity-slot',
  standalone: true,
  imports: [ConfirmedBadge, ActivityEditDialog, InfoRow],
  template: `
    <app-info-row
      [icon]="tipoIcon().icon"
      [iconColor]="tipoIcon().color"
      [text]="activity().description"
      [class.opacity-60]="!activity().confirmed"
    >
      @if (activity().confirmed) {
        <app-confirmed-badge
          [editable]="auth.isOwner()"
          (toggle)="onToggleConfirmed()"
        />
      }
      @if (activity().cardId && !hideInfoButton()) {
        <button
          type="button"
          class="pi pi-lightbulb text-xs opacity-60 hover:opacity-100 transition-opacity ml-1 bg-transparent border-none cursor-pointer"
          style="height: 1.25rem; color: var(--p-primary-color)"
          (click)="openInfo.emit()"
          title="Ver informacion del sitio"
        ></button>
      }
      @if (auth.isOwner()) {
        <button
          type="button"
          class="pi pi-pencil text-xs opacity-40 hover:opacity-100 transition-opacity ml-1 bg-transparent border-none cursor-pointer"
          style="height: 1.25rem"
          (click)="editDialog().open(activity())"
          title="Editar actividad"
        ></button>
      }
    </app-info-row>
    <app-activity-edit-dialog (saved)="onSaved($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitySlot {
  readonly activity = input.required<Activity>();
  readonly hideInfoButton = input(false);
  readonly updated = output<void>();
  readonly openInfo = output<void>();

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
    this.editService.patchActivity(event.id, event.changes as ActivityPatch).subscribe({
      next: () => this.updated.emit(),
      error: () => {},
    });
  }
}
