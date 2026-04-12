import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getRequests() {
    return firstValueFrom(
      this.http.get<{ requests: any[] }>('/api/access-requests')
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
      this.http.get<{ sessions: any[] }>('/api/admin/sessions')
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
}
