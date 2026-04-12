import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  note?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  resolved_at?: string | null;
}

export interface Session {
  id: string;
  name: string;
  email?: string | null;
  role: 'owner' | 'visitor';
  created_at: string;
  expires_at: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getRequests() {
    return firstValueFrom(
      this.http.get<{ requests: AccessRequest[] }>('/api/access-requests')
    );
  }

  approve(requestId: string) {
    return firstValueFrom(
      this.http.post<{ success: boolean; magic_link: string }>(
        '/api/admin/approve',
        { request_id: requestId }
      )
    );
  }

  reject(requestId: string) {
    return firstValueFrom(
      this.http.post<{ success: boolean }>(
        '/api/admin/reject',
        { request_id: requestId }
      )
    );
  }

  getSessions() {
    return firstValueFrom(
      this.http.get<{ sessions: Session[] }>('/api/admin/sessions')
    );
  }

  revokeSession(sessionId: string) {
    return firstValueFrom(
      this.http.delete<{ success: boolean }>(
        '/api/admin/sessions',
        { body: { session_id: sessionId } }
      )
    );
  }

  invite(name: string, email?: string) {
    return firstValueFrom(
      this.http.post<{ success: boolean; magic_link: string }>(
        '/api/admin/invite',
        { name, email: email || '' }
      )
    );
  }
}
