import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { ExternalLink } from '../../shared/external-link/external-link';
import type { Card as CardModel } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { EditService } from '../../shared/services/edit.service';

@Component({
  selector: 'app-link-card',
  imports: [Card, ExternalLink, Inplace, InputText, FormsModule],
  template: `
    <p-card>
      <ng-template #header>
        @if (auth.isOwner()) {
          <p-inplace (onDeactivate)="saveTitle()">
            <ng-template #display>
              <span class="font-bold">{{ editTitle }}</span>
            </ng-template>
            <ng-template #content>
              <input pInputText [(ngModel)]="editTitle" class="w-full" />
            </ng-template>
          </p-inplace>
        } @else {
          <span class="font-bold">{{ card().title }}</span>
        }
      </ng-template>
      @if (card().body) {
        <p class="text-sm" style="color: var(--p-surface-600)">{{ card().body }}</p>
      }
      @if (card().url) {
        <div class="mt-3">
          @if (auth.isOwner()) {
            <p-inplace (onDeactivate)="saveUrl()">
              <ng-template #display>
                <app-external-link [url]="editUrl || card().url!" label="Abrir enlace" severity="primary" />
              </ng-template>
              <ng-template #content>
                <input pInputText [(ngModel)]="editUrl" class="w-full" placeholder="https://..." />
              </ng-template>
            </p-inplace>
          } @else {
            <app-external-link [url]="card().url!" label="Abrir enlace" severity="primary" />
          }
        </div>
      }
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCard implements OnInit {
  readonly card = input.required<CardModel>();

  readonly auth = inject(AuthService);
  private readonly editService = inject(EditService);

  editTitle = '';
  editUrl = '';

  ngOnInit() {
    this.editTitle = this.card().title;
    this.editUrl = this.card().url ?? '';
  }

  saveTitle() {
    if (this.editTitle !== this.card().title) {
      this.editService.patchCard(this.card().id, { title: this.editTitle }).subscribe();
    }
  }

  saveUrl() {
    if (this.editUrl !== (this.card().url ?? '')) {
      this.editService.patchCard(this.card().id, { url: this.editUrl }).subscribe();
    }
  }
}
