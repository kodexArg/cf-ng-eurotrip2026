import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach } from 'vitest';
import { CityBadge } from './city-badge';

describe('CityBadge', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityBadge],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('renders without error with slug input', async () => {
    const fixture = TestBed.createComponent(CityBadge);
    fixture.componentRef.setInput('slug', 'roma');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('displays "Roma" for slug "roma"', async () => {
    const fixture = TestBed.createComponent(CityBadge);
    fixture.componentRef.setInput('slug', 'roma');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Roma');
  });

  it('displays "París" for slug "paris"', async () => {
    const fixture = TestBed.createComponent(CityBadge);
    fixture.componentRef.setInput('slug', 'paris');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('París');
  });
});
