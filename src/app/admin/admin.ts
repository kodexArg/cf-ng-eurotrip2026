import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { AdminService } from './admin.service';
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
        <!-- Access Requests -->
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

        <!-- Active Sessions -->
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

        <!-- Magic Link Dialog -->
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
export class AdminPage implements OnInit {
  readonly auth = inject(AuthService);
  private readonly adminService = inject(AdminService);

  readonly requests = signal<any[]>([]);
  readonly sessions = signal<any[]>([]);
  readonly loadingRequests = signal(false);
  readonly loadingSessions = signal(false);
  readonly generatedLink = signal('');
  readonly linkCopied = signal(false);

  showLinkDialog = false;

  ngOnInit(): void {
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

  async approveRequest(req: any): Promise<void> {
    try {
      const res = await this.adminService.approve(req.id);
      if (res.success && res.magic_link) {
        this.generatedLink.set(res.magic_link);
        this.linkCopied.set(false);
        this.showLinkDialog = true;
      }
      await this.loadRequests();
    } catch {
      // silently handle
    }
  }

  async rejectRequest(req: any): Promise<void> {
    try {
      await this.adminService.reject(req.id);
      await this.loadRequests();
    } catch {
      // silently handle
    }
  }

  async revokeSession(session: any): Promise<void> {
    try {
      await this.adminService.revokeSession(session.id);
      await this.loadSessions();
    } catch {
      // silently handle
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.generatedLink()).then(() => {
      this.linkCopied.set(true);
    });
  }
}
