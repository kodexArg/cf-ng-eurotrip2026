import { Injectable, signal } from '@angular/core';
import { Variant } from '../models';

@Injectable({ providedIn: 'root' })
export class VariantService {
  readonly variant = signal<'main' | 'train'>('train');

  setVariant(v: 'main' | 'train'): void {
    this.variant.set(v);
  }
}
