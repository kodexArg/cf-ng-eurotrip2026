import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking, Card } from '../models';

export type CardPatch = Partial<Pick<Card, 'title' | 'body' | 'url'>>;
export type BookingPatch = Partial<Pick<Booking, 'type' | 'sortDate' | 'time' | 'description' | 'origin' | 'destination' | 'mode' | 'carrier' | 'checkoutDate' | 'accommodation' | 'costUsd' | 'confirmed' | 'notes'>>;

/**
 * Centralised HTTP mutation API used by the owner-only edit dialogs.
 *
 * The legacy `patchActivity` / `patchTransport` helpers were removed when
 * the itinerary switched to the unified events model — their consumers
 * (activity-slot, transport-inline, activity-edit-dialog,
 * transport-edit-dialog) are all gone. New editing workflows will hit a
 * future `/api/events` endpoint.
 */
@Injectable({ providedIn: 'root' })
export class EditService {
  private readonly http = inject(HttpClient);

  patchCard(id: string, changes: CardPatch) {
    return this.http.patch<Card>(`/api/cards/${id}`, changes);
  }

  createBooking(data: BookingPatch) {
    return this.http.post<Booking>('/api/bookings', data);
  }

  patchBooking(id: string, changes: BookingPatch) {
    return this.http.patch<Booking>(`/api/bookings/${id}`, changes);
  }

  deleteBooking(id: string) {
    return this.http.delete(`/api/bookings/${id}`);
  }
}
