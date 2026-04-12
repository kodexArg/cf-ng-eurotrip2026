import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach } from 'vitest';
import { ConfirmedBadge } from './confirmed-badge';

describe('ConfirmedBadge', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmedBadge],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('renders without error', async () => {
    const fixture = TestBed.createComponent(ConfirmedBadge);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('contains "Confirmado" text', async () => {
    const fixture = TestBed.createComponent(ConfirmedBadge);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Confirmado');
  });
});
