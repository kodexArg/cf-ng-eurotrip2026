import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach } from 'vitest';
import { ActivitySlot } from './activity-slot';
import type { Activity } from '../../shared/models';

const mockActivity: Activity = {
  id: 'act-1',
  dayId: 'day-1',
  timeSlot: 'morning',
  description: 'Visitar el Museo del Prado',
  costHint: '~15 pp',
  confirmed: false,
  variant: 'both',
};

describe('ActivitySlot', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitySlot],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('renders with a mock Activity input', async () => {
    const fixture = TestBed.createComponent(ActivitySlot);
    fixture.componentRef.setInput('activity', mockActivity);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Visitar el Museo del Prado');
  });

  it('shows "Mañana" for morning slot', async () => {
    const fixture = TestBed.createComponent(ActivitySlot);
    fixture.componentRef.setInput('activity', { ...mockActivity, timeSlot: 'morning' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Mañana');
  });

  it('shows confirmed badge when confirmed=true', async () => {
    const fixture = TestBed.createComponent(ActivitySlot);
    fixture.componentRef.setInput('activity', { ...mockActivity, confirmed: true });
    fixture.detectChanges();
    await fixture.whenStable();
    const badge = fixture.nativeElement.querySelector('app-confirmed-badge');
    expect(badge).toBeTruthy();
  });

  it('hides confirmed badge when confirmed=false', async () => {
    const fixture = TestBed.createComponent(ActivitySlot);
    fixture.componentRef.setInput('activity', { ...mockActivity, confirmed: false });
    fixture.detectChanges();
    await fixture.whenStable();
    const badge = fixture.nativeElement.querySelector('app-confirmed-badge');
    expect(badge).toBeNull();
  });
});
