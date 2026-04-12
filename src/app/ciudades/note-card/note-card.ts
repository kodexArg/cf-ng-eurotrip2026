import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import type { Card as CardModel } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { EditService } from '../../shared/services/edit.service';

@Component({
  selector: 'app-note-card',
  imports: [Card, Inplace, InputText, FormsModule],
  template: `
    <p-card>
      <ng-template #header>
        @if (auth.isAuthenticated()) {
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
      @if (auth.isAuthenticated()) {
        <p-inplace (onDeactivate)="saveBody()">
          <ng-template #display>
            <p class="text-sm whitespace-pre-wrap" style="color: var(--p-surface-700)">{{ editBody }}</p>
          </ng-template>
          <ng-template #content>
            <textarea pInputText [(ngModel)]="editBody" rows="3" class="w-full text-sm"></textarea>
          </ng-template>
        </p-inplace>
      } @else {
        <p class="text-sm whitespace-pre-wrap" style="color: var(--p-surface-700)">{{ card().body }}</p>
      }
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCard implements OnInit {
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
