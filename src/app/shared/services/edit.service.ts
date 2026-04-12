import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking, Card } from '../models';
import { throwError } from 'rxjs';

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
 *
 * The booking mutation methods below are stubs — the `/api/bookings` table
 * was renamed to `_legacy_bookings` in migration 0008. These will be
 * reimplemented against `/api/events` in Phase 2.
 */
@Injectable({ providedIn: 'root' })
export class EditService {
  private readonly http = inject(HttpClient);

  patchCard(id: string, changes: CardPatch) {
    return this.http.patch<Card>(`/api/cards/${id}`, changes);
  }

  // TODO Phase 2: POST to /api/events — /api/bookings table renamed to _legacy_bookings (migration 0008)
  createBooking(_data: BookingPatch) {
    console.warn('[EditService] createBooking: Not implemented — Phase 2');
    return throwError(() => new Error('Not implemented — Phase 2'));
  }

  // TODO Phase 2: PATCH /api/events/:id — /api/bookings table renamed to _legacy_bookings (migration 0008)
  patchBooking(_id: string, _changes: BookingPatch) {
    console.warn('[EditService] patchBooking: Not implemented — Phase 2');
    return throwError(() => new Error('Not implemented — Phase 2'));
  }

  // TODO Phase 2: DELETE /api/events/:id — /api/bookings table renamed to _legacy_bookings (migration 0008)
  deleteBooking(_id: string) {
    console.warn('[EditService] deleteBooking: Not implemented — Phase 2');
    return throwError(() => new Error('Not implemented — Phase 2'));
  }
}
