import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../models';

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

  createBooking(data: Record<string, unknown>) {
    return this.http.post<Booking>('/api/bookings', data);
  }

  patchBooking(id: string, changes: Record<string, unknown>) {
    return this.http.patch<Booking>(`/api/bookings/${id}`, changes);
  }

  deleteBooking(id: string) {
    return this.http.delete(`/api/bookings/${id}`);
  }
}
