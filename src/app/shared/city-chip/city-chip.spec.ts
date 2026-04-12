import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach } from 'vitest';
import { CityChip } from './city-chip';

describe('CityChip', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityChip],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('renders without error with slug input', async () => {
    const fixture = TestBed.createComponent(CityChip);
    fixture.componentRef.setInput('slug', 'madrid');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('displays "Madrid" for slug "madrid"', async () => {
    const fixture = TestBed.createComponent(CityChip);
    fixture.componentRef.setInput('slug', 'madrid');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Madrid');
  });

  it('displays "Barcelona" for slug "barcelona"', async () => {
    const fixture = TestBed.createComponent(CityChip);
    fixture.componentRef.setInput('slug', 'barcelona');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Barcelona');
  });
});
