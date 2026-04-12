import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, Booking, Card, TransportLeg } from '../models';

export type ActivityPatch = Partial<Pick<Activity, 'description' | 'timeSlot' | 'confirmed' | 'costHint' | 'tag' | 'tipo'>>;
export type TransportPatch = Partial<Pick<TransportLeg, 'label' | 'duration' | 'confirmed' | 'fare' | 'company' | 'departureTime' | 'arrivalTime' | 'costHint'>>;
export type CardPatch = Partial<Pick<Card, 'title' | 'body' | 'url'>>;
export type BookingPatch = Partial<Pick<Booking, 'type' | 'sortDate' | 'time' | 'description' | 'origin' | 'destination' | 'mode' | 'carrier' | 'checkoutDate' | 'accommodation' | 'costUsd' | 'confirmed' | 'notes'>>;

@Injectable({ providedIn: 'root' })
export class EditService {
  private readonly http = inject(HttpClient);

  patchActivity(id: string, changes: ActivityPatch) {
    return this.http.patch<Activity>(`/api/activities/${id}`, changes);
  }

  patchTransport(id: string, changes: TransportPatch) {
    return this.http.patch<TransportLeg>(`/api/transport/${id}`, changes);
  }

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
