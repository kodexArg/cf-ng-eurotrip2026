import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfirmationService } from 'primeng/api';
import { EventForm } from './event-form';
import { HitoEvent } from '../../shared/models/event.model';

const mockEvent: HitoEvent = {
  id: 'ev-1', type: 'hito', subtype: 'hito', slug: 'ev-1', title: 'Test Hito',
  description: 'Descripción test', date: '2026-05-01', timestampIn: '2026-05-01T10:00:00',
  timestampOut: null, cityIn: 'lon', cityOut: null, usd: 100, icon: 'pi pi-flag',
  confirmed: true, variant: 'both', cardId: null, notes: null,
};

describe('EventForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventForm],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
      ],
    }).compileComponents();
  });

  it('renders without error in add mode', async () => {
    const fixture = TestBed.createComponent(EventForm);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('shows Aceptar button in add mode', async () => {
    const fixture = TestBed.createComponent(EventForm);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Aceptar');
  });

  it('shows Modificar button in edit mode', async () => {
    const fixture = TestBed.createComponent(EventForm);
    fixture.componentRef.setInput('event', mockEvent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Modificar');
  });

  it('Eliminar button is disabled in add mode', async () => {
    const fixture = TestBed.createComponent(EventForm);
    fixture.detectChanges();
    await fixture.whenStable();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const eliminarBtn = Array.from(buttons as NodeListOf<HTMLButtonElement>)
      .find((b: HTMLButtonElement) => b.textContent?.includes('Eliminar'));
    expect(eliminarBtn).toBeTruthy();
    expect(eliminarBtn!.disabled).toBe(true);
  });

  it('emits cleared when Limpiar is clicked', async () => {
    const fixture = TestBed.createComponent(EventForm);
    fixture.detectChanges();
    await fixture.whenStable();
    let emitted = false;
    fixture.componentInstance.cleared.subscribe(() => { emitted = true; });
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const limpiarBtn = Array.from(buttons as NodeListOf<HTMLButtonElement>)
      .find((b: HTMLButtonElement) => b.textContent?.includes('Limpiar'));
    limpiarBtn?.click();
    expect(emitted).toBe(true);
  });
});
