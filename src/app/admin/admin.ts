import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { AdminService, AccessRequest, Session } from './admin.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, Card, Button, Dialog, InputText, Tag],
  template: `
    <div class="max-w-4xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6" style="color: var(--p-surface-800)">Admin</h1>

      @if (!auth.isOwner()) {
        <p class="text-center py-8" style="color: var(--p-surface-500)">Acceso restringido al propietario.</p>
      } @else {
        <p-card styleClass="mb-4">
          <ng-template #header>
            <div class="px-4 pt-4">
              <span class="font-bold text-lg" style="color: var(--p-surface-800)">Generar invitación</span>
            </div>
          </ng-template>

          <div class="flex flex-col gap-3 max-w-sm">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium" style="color: var(--p-surface-700)">Nombre *</label>
              <input
                pInputText
                type="text"
                placeholder="Nombre del invitado"
                [(ngModel)]="inviteName"
                (keydown.enter)="generateInvite()"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium" style="color: var(--p-surface-700)">
                Email
                <span class="font-normal ml-1" style="color: var(--p-surface-400)">(opcional, solo referencia)</span>
              </label>
              <input
                pInputText
                type="email"
                placeholder="Para tu referencia"
                [(ngModel)]="inviteEmail"
                (keydown.enter)="generateInvite()"
                class="w-full"
              />
            </div>
            @if (inviteError()) {
              <small class="text-red-500">{{ inviteError() }}</small>
            }
            <p-button
              label="Generar link"
              icon="pi pi-link"
              [loading]="generatingInvite()"
              [disabled]="!inviteName.trim()"
              (onClick)="generateInvite()"
            />
          </div>
        </p-card>

        <p-card styleClass="mb-4">
          <ng-template #header>
            <div class="flex items-center justify-between px-4 pt-4">
              <span class="font-bold text-lg" style="color: var(--p-surface-800)">Access Requests</span>
              <p-button icon="pi pi-refresh" [text]="true" size="small" (onClick)="loadRequests()" />
            </div>
          </ng-template>

          @if (loadingRequests()) {
            <p class="text-sm py-4 text-center" style="color: var(--p-surface-400)">Cargando...</p>
          } @else if (requests().length === 0) {
            <p class="text-sm py-4 text-center" style="color: var(--p-surface-400)">No hay solicitudes.</p>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr style="color: var(--p-surface-500); border-bottom: 1px solid var(--p-surface-200)">
                    <th class="text-left py-2 px-2 font-medium">Name</th>
                    <th class="text-left py-2 px-2 font-medium">Email</th>
                    <th class="text-left py-2 px-2 font-medium">Note</th>
                    <th class="text-left py-2 px-2 font-medium">Date</th>
                    <th class="text-left py-2 px-2 font-medium">Status</th>
                    <th class="text-right py-2 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (req of requests(); track req.id) {
                    <tr style="border-bottom: 1px solid var(--p-surface-100)">
                      <td class="py-2 px-2" style="color: var(--p-surface-800)">{{ req.name }}</td>
                      <td class="py-2 px-2" style="color: var(--p-surface-600)">{{ req.email }}</td>
                      <td class="py-2 px-2" style="color: var(--p-surface-600)">{{ req.note || '-' }}</td>
                      <td class="py-2 px-2" style="color: var(--p-surface-500)">{{ req.created_at | date:'short' }}</td>
                      <td class="py-2 px-2">
                        <p-tag
                          [value]="req.status"
                          [severity]="req.status === 'pending' ? 'warn' : req.status === 'approved' ? 'success' : 'danger'"
                        />
                      </td>
                      <td class="py-2 px-2 text-right">
                        @if (req.status === 'pending') {
                          <p-button label="Approve" icon="pi pi-check" size="small" severity="success"
                                    [text]="true" (onClick)="approveRequest(req)" class="mr-1" />
                          <p-button label="Reject" icon="pi pi-times" size="small" severity="danger"
                                    [text]="true" (onClick)="rejectRequest(req)" />
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </p-card>

        <p-card>
          <ng-template #header>
            <div class="flex items-center justify-between px-4 pt-4">
              <span class="font-bold text-lg" style="color: var(--p-surface-800)">Active Sessions</span>
              <p-button icon="pi pi-refresh" [text]="true" size="small" (onClick)="loadSessions()" />
            </div>
          </ng-template>

          @if (loadingSessions()) {
            <p class="text-sm py-4 text-center" style="color: var(--p-surface-400)">Cargando...</p>
          } @else if (sessions().length === 0) {
            <p class="text-sm py-4 text-center" style="color: var(--p-surface-400)">No hay sesiones activas.</p>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr style="color: var(--p-surface-500); border-bottom: 1px solid var(--p-surface-200)">
                    <th class="text-left py-2 px-2 font-medium">Name</th>
                    <th class="text-left py-2 px-2 font-medium">Email</th>
                    <th class="text-left py-2 px-2 font-medium">Role</th>
                    <th class="text-left py-2 px-2 font-medium">Created</th>
                    <th class="text-left py-2 px-2 font-medium">Expires</th>
                    <th class="text-right py-2 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (session of sessions(); track session.id) {
                    <tr style="border-bottom: 1px solid var(--p-surface-100)">
                      <td class="py-2 px-2" style="color: var(--p-surface-800)">{{ session.name }}</td>
                      <td class="py-2 px-2" style="color: var(--p-surface-600)">{{ session.email }}</td>
                      <td class="py-2 px-2">
                        <p-tag
                          [value]="session.role"
                          [severity]="session.role === 'owner' ? 'info' : 'secondary'"
                        />
                      </td>
                      <td class="py-2 px-2" style="color: var(--p-surface-500)">{{ session.created_at | date:'short' }}</td>
                      <td class="py-2 px-2" style="color: var(--p-surface-500)">{{ session.expires_at | date:'short' }}</td>
                      <td class="py-2 px-2 text-right">
                        <p-button label="Revoke" icon="pi pi-ban" size="small" severity="danger"
                                  [text]="true" (onClick)="revokeSession(session)" />
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </p-card>

        <p-dialog
          header="Magic Link Generated"
          [(visible)]="showLinkDialog"
          [modal]="true"
          [closable]="true"
          [style]="{ width: '500px' }"
        >
          <p class="text-sm mb-3" style="color: var(--p-surface-600)">
            Share this link with the visitor. It can only be used once.
          </p>
          <div class="flex gap-2">
            <input
              pInputText
              [value]="generatedLink()"
              readonly
              class="w-full text-sm"
            />
            <p-button
              icon="pi pi-copy"
              (onClick)="copyLink()"
              [label]="linkCopied() ? 'Copied!' : 'Copy'"
              [severity]="linkCopied() ? 'success' : 'primary'"
              size="small"
            />
          </div>
        </p-dialog>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPage {
  readonly auth = inject(AuthService);
  private readonly adminService = inject(AdminService);

  readonly requests = signal<AccessRequest[]>([]);
  readonly sessions = signal<Session[]>([]);
  readonly loadingRequests = signal(false);
  readonly loadingSessions = signal(false);
  readonly generatedLink = signal('');
  readonly linkCopied = signal(false);
  readonly generatingInvite = signal(false);
  readonly inviteError = signal('');

  showLinkDialog = false;
  inviteName = '';
  inviteEmail = '';

  constructor() {
    if (this.auth.isOwner()) {
      this.loadRequests();
      this.loadSessions();
    }
  }

  async loadRequests(): Promise<void> {
    this.loadingRequests.set(true);
    try {
      const res = await this.adminService.getRequests();
      this.requests.set(res.requests ?? []);
    } catch {
      this.requests.set([]);
    } finally {
      this.loadingRequests.set(false);
    }
  }

  async loadSessions(): Promise<void> {
    this.loadingSessions.set(true);
    try {
      const res = await this.adminService.getSessions();
      this.sessions.set(res.sessions ?? []);
    } catch {
      this.sessions.set([]);
    } finally {
      this.loadingSessions.set(false);
    }
  }

  async approveRequest(req: AccessRequest): Promise<void> {
    try {
      const res = await this.adminService.approve(req.id);
      if (res.success && res.magic_link) {
        this.generatedLink.set(res.magic_link);
        this.linkCopied.set(false);
        this.showLinkDialog = true;
      }
      await this.loadRequests();
    } catch {
    }
  }

  async rejectRequest(req: AccessRequest): Promise<void> {
    try {
      await this.adminService.reject(req.id);
      await this.loadRequests();
    } catch {
    }
  }

  async revokeSession(session: Session): Promise<void> {
    try {
      await this.adminService.revokeSession(session.id);
      await this.loadSessions();
    } catch {
    }
  }

  async generateInvite(): Promise<void> {
    if (!this.inviteName.trim()) return;
    this.generatingInvite.set(true);
    this.inviteError.set('');
    try {
      const res = await this.adminService.invite(this.inviteName.trim(), this.inviteEmail.trim() || undefined);
      if (res.success && res.magic_link) {
        this.generatedLink.set(res.magic_link);
        this.linkCopied.set(false);
        this.showLinkDialog = true;
        this.inviteName = '';
        this.inviteEmail = '';
      }
    } catch {
      this.inviteError.set('No se pudo generar el link. Intentá de nuevo.');
    } finally {
      this.generatingInvite.set(false);
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.generatedLink()).then(() => {
      this.linkCopied.set(true);
    });
  }
}
