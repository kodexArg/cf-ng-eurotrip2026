import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-access-request',
  imports: [FormsModule, Button, InputText, Textarea],
  template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div class="w-full max-w-md">

        <div class="text-center mb-10">
          <h1 class="text-2xl font-semibold text-slate-100 tracking-tight">eurotrip 2026</h1>
          <p class="text-slate-400 text-sm mt-1">Private travel planner</p>
        </div>

        @if (submitted()) {
          <div class="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-check text-slate-300"></i>
            </div>
            <p class="text-slate-200 font-medium">Request sent</p>
            <p class="text-slate-400 text-sm mt-2">
              You'll receive a link when approved.
            </p>
          </div>
        } @else {
          <div class="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h2 class="text-slate-200 font-medium mb-1">Request access</h2>
            <p class="text-slate-400 text-sm mb-6">
              This site is invite-only. Submit your info and you'll get a link if approved.
            </p>

            <form (ngSubmit)="submit()" class="flex flex-col gap-4">

              <div class="flex flex-col gap-1.5">
                <label class="text-slate-300 text-sm font-medium" for="ar-name">Name</label>
                <input
                  pInputText
                  id="ar-name"
                  type="text"
                  placeholder="Your name"
                  [(ngModel)]="name"
                  name="name"
                  autocomplete="name"
                  class="w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  [disabled]="loading()"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-slate-300 text-sm font-medium" for="ar-email">Email</label>
                <input
                  pInputText
                  id="ar-email"
                  type="email"
                  placeholder="you@example.com"
                  [(ngModel)]="email"
                  name="email"
                  autocomplete="email"
                  class="w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  [disabled]="loading()"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-slate-300 text-sm font-medium" for="ar-note">
                  Note
                  <span class="text-slate-500 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  pTextarea
                  id="ar-note"
                  placeholder="How do you know the travelers?"
                  [(ngModel)]="note"
                  name="note"
                  rows="3"
                  class="w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 resize-none"
                  [disabled]="loading()"
                ></textarea>
              </div>

              @if (errorMessage()) {
                <p class="text-red-400 text-sm">{{ errorMessage() }}</p>
              }

              <p-button
                type="submit"
                label="Send request"
                icon="pi pi-send"
                [loading]="loading()"
                [disabled]="!name.trim() || !email.trim()"
                styleClass="w-full mt-1"
              />
            </form>
          </div>
        }

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessRequestPage {
  private readonly http = inject(HttpClient);

  name = '';
  email = '';
  note = '';

  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');

  submit(): void {
    if (!this.name.trim() || !this.email.trim()) return;
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.http
      .post('/api/access-requests', {
        name: this.name.trim(),
        email: this.email.trim(),
        note: this.note.trim(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.submitted.set(true);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Something went wrong. Please try again.');
        },
      });
  }
}
