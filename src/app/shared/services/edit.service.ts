import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EditService {
  private readonly http = inject(HttpClient);

  patchActivity(id: string, changes: Record<string, unknown>) {
    return this.http.patch<Record<string, unknown>>(`/api/activities/${id}`, changes);
  }

  patchTransport(id: string, changes: Record<string, unknown>) {
    return this.http.patch<Record<string, unknown>>(`/api/transport/${id}`, changes);
  }

  patchCard(id: string, changes: Record<string, unknown>) {
    return this.http.patch<Record<string, unknown>>(`/api/cards/${id}`, changes);
  }
}
