import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoadingState } from './loading-state';

describe('LoadingState', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingState],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('renders without error', async () => {
    const fixture = TestBed.createComponent(LoadingState);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('renders skeleton elements', async () => {
    const fixture = TestBed.createComponent(LoadingState);
    fixture.detectChanges();
    await fixture.whenStable();
    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
