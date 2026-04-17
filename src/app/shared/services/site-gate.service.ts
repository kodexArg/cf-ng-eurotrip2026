import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface GateResponse {
  passed: boolean;
}

@Injectable({ providedIn: 'root' })
export class SiteGateService {
  private readonly http = inject(HttpClient);

  readonly passed = signal(false);
  readonly checked = signal(false);

  async check(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<GateResponse>('/api/site-gate/me'));
      this.passed.set(!!res.passed);
    } catch {
      this.passed.set(false);
    } finally {
      this.checked.set(true);
    }
  }

  async unlock(password: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<GateResponse>('/api/site-gate/login', { password })
      );
      this.passed.set(!!res.passed);
      return !!res.passed;
    } catch {
      this.passed.set(false);
      return false;
    }
  }
}
