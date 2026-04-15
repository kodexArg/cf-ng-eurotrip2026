import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BookingCard } from './booking-card';
import { HitoEvent } from '../../shared/models/event.model';

const mockEvent: HitoEvent = {
  id: 'test-1', type: 'hito', subtype: 'hito', slug: 'test-1', title: 'Test Event',
  description: null, date: '2026-05-01', timestampIn: '2026-05-01T10:00:00',
  timestampOut: null, cityIn: 'lon', cityOut: null, usd: null, icon: 'pi pi-flag',
  confirmed: false, variant: 'both', cardId: null, notes: null,
};

describe('BookingCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCard],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('renders without error', async () => {
    const fixture = TestBed.createComponent(BookingCard);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('does not render selection bar by default', async () => {
    const fixture = TestBed.createComponent(BookingCard);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.detectChanges();
    await fixture.whenStable();
    const bar = fixture.nativeElement.querySelector('button');
    expect(bar).toBeNull();
  });

  it('renders selection bar when selectable is true', async () => {
    const fixture = TestBed.createComponent(BookingCard);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();
    await fixture.whenStable();
    const bar = fixture.nativeElement.querySelector('button');
    expect(bar).toBeTruthy();
    expect(bar.textContent).toContain('Seleccionar');
  });

  it('emits selectToggle when selection bar is clicked', async () => {
    const fixture = TestBed.createComponent(BookingCard);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();
    await fixture.whenStable();
    let emitted = false;
    fixture.componentInstance.selectToggle.subscribe(() => { emitted = true; });
    fixture.nativeElement.querySelector('button')?.click();
    expect(emitted).toBe(true);
  });
});
