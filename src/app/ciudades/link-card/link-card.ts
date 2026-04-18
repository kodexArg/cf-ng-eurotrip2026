import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { firstValueFrom } from 'rxjs';
import { ExternalLink } from '../../shared/external-link/external-link';
import type { Card as CardModel } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { EditService } from '../../shared/services/edit.service';
import { AppIcon } from '../../shared/icon/icon';

@Component({
  selector: 'app-link-card',
  imports: [ExternalLink, Inplace, InputText, FormsModule, Tooltip, AppIcon],
  template: `
    @if (auth.isOwner()) {
      <p-inplace (onDeactivate)="saveTitle()">
        <ng-template #display>
          <span class="font-semibold text-lg" style="color: var(--p-surface-900)">{{ editTitle() }}</span>
        </ng-template>
        <ng-template #content>
          <input pInputText [ngModel]="editTitle()" (ngModelChange)="editTitle.set($event)" class="w-full" />
        </ng-template>
      </p-inplace>
    }
    @if (card().body) {
      <p class="text-sm leading-relaxed mt-2" style="color: var(--p-surface-600)">{{ card().body }}</p>
    }
    @if (card().url) {
      <div class="mt-3">
        @if (auth.isOwner()) {
          <p-inplace (onDeactivate)="saveUrl()">
            <ng-template #display>
              <app-external-link [url]="editUrl() || card().url!" label="Abrir enlace" severity="primary" />
            </ng-template>
            <ng-template #content>
              <input pInputText [ngModel]="editUrl()" (ngModelChange)="editUrl.set($event)" class="w-full" placeholder="https://..." />
            </ng-template>
          </p-inplace>
        } @else {
          <app-external-link [url]="card().url!" label="Abrir enlace" severity="primary" />
        }
      </div>
    }
    @if (card().links.length) {
      <div class="flex flex-col gap-2 mt-3 pt-3" style="border-top: 1px solid var(--p-surface-200)">
        @for (link of card().links; track link.id) {
          <a [href]="link.url" target="_blank" rel="noopener"
             class="text-sm flex items-center gap-1 no-underline hover:underline"
             style="color: var(--p-primary-color)"
             [pTooltip]="link.tooltip ?? ''" tooltipPosition="top" [showDelay]="300">
            <app-icon icon="pi-external-link" size="0.75rem" />
            {{ link.label }}
          </a>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCard {
  readonly card = input.required<CardModel>();

  readonly auth = inject(AuthService);
  private readonly editService = inject(EditService);

  protected readonly editTitle = linkedSignal(() => this.card().title);
  protected readonly editUrl = linkedSignal(() => this.card().url ?? '');

  async saveTitle() {
    if (this.editTitle() !== this.card().title) {
      await firstValueFrom(this.editService.patchCard(this.card().id, { title: this.editTitle() }));
    }
  }

  async saveUrl() {
    if (this.editUrl() !== (this.card().url ?? '')) {
      await firstValueFrom(this.editService.patchCard(this.card().id, { url: this.editUrl() }));
    }
  }
}
