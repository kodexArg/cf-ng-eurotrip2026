import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { NotFound } from './not-found';

describe('NotFound', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('renders without error', async () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('contains "Página no encontrada"', async () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Página no encontrada');
  });
});
