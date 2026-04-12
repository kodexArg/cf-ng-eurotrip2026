import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { ExternalLink } from '../../shared/external-link/external-link';
import type { Card as CardModel } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { EditService } from '../../shared/services/edit.service';

@Component({
  selector: 'app-info-card',
  imports: [ExternalLink, Inplace, InputText, FormsModule, Tooltip],
  template: `
    @if (auth.isAuthenticated()) {
      <p-inplace (onDeactivate)="saveTitle()">
        <ng-template #display>
          <span class="font-semibold text-lg" style="color: var(--p-surface-900)">{{ editTitle }}</span>
        </ng-template>
        <ng-template #content>
          <input pInputText [(ngModel)]="editTitle" class="w-full" />
        </ng-template>
      </p-inplace>
    }
    @if (card().body) {
      <div class="mt-2">
        @if (auth.isAuthenticated()) {
          <p-inplace (onDeactivate)="saveBody()">
            <ng-template #display>
              <p class="text-sm leading-relaxed" style="color: var(--p-surface-700)">{{ editBody }}</p>
            </ng-template>
            <ng-template #content>
              <textarea pInputText [(ngModel)]="editBody" rows="3" class="w-full text-sm"></textarea>
            </ng-template>
          </p-inplace>
        } @else {
          <p class="text-sm leading-relaxed" style="color: var(--p-surface-700)">{{ card().body }}</p>
        }
      </div>
    }
    @if (card().url) {
      <div class="mt-3">
        <app-external-link [url]="card().url!" label="Ver mas" />
      </div>
    }
    @if (card().links.length) {
      <div class="flex flex-col gap-2 mt-3 pt-3" style="border-top: 1px solid var(--p-surface-200)">
        @for (link of card().links; track link.id) {
          <a [href]="link.url" target="_blank" rel="noopener"
             class="text-sm flex items-center gap-1 no-underline hover:underline"
             style="color: var(--p-primary-color)"
             [pTooltip]="link.tooltip ?? ''" tooltipPosition="top" [showDelay]="300">
            <i class="pi pi-external-link text-xs"></i>
            {{ link.label }}
          </a>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard implements OnInit {
  readonly card = input.required<CardModel>();

  readonly auth = inject(AuthService);
  private readonly editService = inject(EditService);

  editTitle = '';
  editBody = '';

  ngOnInit() {
    this.editTitle = this.card().title;
    this.editBody = this.card().body ?? '';
  }

  saveTitle() {
    if (this.editTitle !== this.card().title) {
      this.editService.patchCard(this.card().id, { title: this.editTitle }).subscribe();
    }
  }

  saveBody() {
    if (this.editBody !== (this.card().body ?? '')) {
      this.editService.patchCard(this.card().id, { body: this.editBody }).subscribe();
    }
  }
}
