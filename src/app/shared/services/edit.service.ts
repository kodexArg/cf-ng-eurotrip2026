import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../models';

export type CardPatch = Partial<Pick<Card, 'title' | 'body' | 'url'>>;

@Injectable({ providedIn: 'root' })
export class EditService {
  private readonly http = inject(HttpClient);

  patchCard(id: string, changes: CardPatch) {
    return this.http.patch<Card>(`/api/cards/${id}`, changes);
  }
}
