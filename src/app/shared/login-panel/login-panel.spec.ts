import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginPanel } from './login-panel';
import { AuthService } from '../services/auth.service';

const fakeAuth = {
  login: vi.fn().mockResolvedValue(true),
  isOwner: signal(false),
  isAuthenticated: signal(false),
  role: signal<'owner' | 'visitor' | null>(null),
};

describe('LoginPanel', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [LoginPanel],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
        provideRouter([]),
        { provide: AuthService, useValue: fakeAuth },
      ],
    }).compileComponents();
  });

  it('renders without error', async () => {
    const fixture = TestBed.createComponent(LoginPanel);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('contains "Acceso restringido" text', async () => {
    const fixture = TestBed.createComponent(LoginPanel);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Acceso restringido');
  });

  it('does NOT show error message initially', async () => {
    const fixture = TestBed.createComponent(LoginPanel);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).not.toContain('Contraseña incorrecta');
  });

  it('shows "Contraseña incorrecta" when error signal is true', async () => {
    const fixture = TestBed.createComponent(LoginPanel);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.error.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Contraseña incorrecta');
  });

  it('calls auth.login() with passphrase and selected name when submit() is called', async () => {
    const fixture = TestBed.createComponent(LoginPanel);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.passphrase = 'secret123';
    fixture.componentInstance.selectedName = 'Vanesa';

    await fixture.componentInstance.submit();

    expect(fakeAuth.login).toHaveBeenCalledWith('secret123', 'Vanesa');
  });
});
