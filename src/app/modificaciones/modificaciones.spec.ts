import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal, computed } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ModificacionesPage } from './modificaciones';
import { AuthService } from '../shared/services/auth.service';

describe('ModificacionesPage', () => {
  let httpController: HttpTestingController;
  let role: ReturnType<typeof signal<'owner' | 'visitor' | null>>;
  let fakeAuth: { isOwner: ReturnType<typeof computed>; isAuthenticated: ReturnType<typeof signal>; role: ReturnType<typeof signal>; checkAuth: ReturnType<typeof vi.fn>; login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    role = signal<'owner' | 'visitor' | null>(null);
    fakeAuth = {
      isOwner: computed(() => role() === 'owner'),
      isAuthenticated: signal(false),
      role,
      checkAuth: vi.fn().mockResolvedValue(undefined),
      login: vi.fn().mockResolvedValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [ModificacionesPage],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: fakeAuth },
      ],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('renders app-login-panel when role is null (not owner)', () => {
    role.set(null);
    const fixture = TestBed.createComponent(ModificacionesPage);
    fixture.detectChanges();

    // httpResource fires a request on init regardless of auth state; flush it
    const req = httpController.expectOne('/api/reservas');
    req.flush({ cities: [], events: [] });
    fixture.detectChanges();

    const loginPanel = fixture.nativeElement.querySelector('app-login-panel');
    expect(loginPanel).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Modificaciones');
  });

  it('renders main content with "Modificaciones" heading when role is owner', () => {
    role.set('owner');
    const fixture = TestBed.createComponent(ModificacionesPage);
    fixture.detectChanges();

    const req = httpController.expectOne('/api/reservas');
    req.flush({ cities: [], events: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Modificaciones');
    expect(fixture.nativeElement.querySelector('app-login-panel')).toBeNull();
  });

  it('switches from login panel to main content when role changes to owner', () => {
    role.set(null);
    const fixture = TestBed.createComponent(ModificacionesPage);
    fixture.detectChanges();

    // Flush initial httpResource request
    const req1 = httpController.expectOne('/api/reservas');
    req1.flush({ cities: [], events: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-login-panel')).toBeTruthy();

    role.set('owner');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-login-panel')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Modificaciones');
  });
});
