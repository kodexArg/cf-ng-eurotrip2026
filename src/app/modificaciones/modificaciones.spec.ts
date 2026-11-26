import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal, computed } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ModificacionesPage } from './modificaciones';
import { AuthService } from '../shared/services/auth.service';

describe('ModificacionesPage', () => {
  let httpController: HttpTestingController;
  let editor: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    editor = signal(false);
    const fakeAuth = {
      isOwner: computed(() => editor()),
      email: signal<string | null>('test@example.com'),
      checked: signal(true),
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

  it('renders the read-only notice when the user is not an editor', () => {
    editor.set(false);
    const fixture = TestBed.createComponent(ModificacionesPage);
    fixture.detectChanges();

    httpController.expectOne('/api/reservas').flush({ cities: [], events: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Solo los organizadores pueden modificar el viaje.');
    expect(fixture.nativeElement.textContent).not.toContain('Modificaciones');
  });

  it('renders main content with "Modificaciones" heading when the user is an editor', () => {
    editor.set(true);
    const fixture = TestBed.createComponent(ModificacionesPage);
    fixture.detectChanges();

    httpController.expectOne('/api/reservas').flush({ cities: [], events: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Modificaciones');
    expect(fixture.nativeElement.textContent).not.toContain('Solo los organizadores');
  });

  it('switches from the notice to main content when the user becomes an editor', () => {
    editor.set(false);
    const fixture = TestBed.createComponent(ModificacionesPage);
    fixture.detectChanges();

    httpController.expectOne('/api/reservas').flush({ cities: [], events: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Solo los organizadores');

    editor.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Solo los organizadores');
    expect(fixture.nativeElement.textContent).toContain('Modificaciones');
  });
});
