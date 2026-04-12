import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly isAuthenticated = signal(false);
  readonly userName = signal<string | null>(null);

  async checkAuth(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ authenticated: boolean; name?: string }>('/api/auth/me')
      );
      this.isAuthenticated.set(res.authenticated);
      this.userName.set(res.name ?? null);
    } catch {
      this.isAuthenticated.set(false);
      this.userName.set(null);
    }
  }

  async login(passphrase: string, name?: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ authenticated: boolean; name?: string }>('/api/auth/login', { passphrase, name })
      );
      this.isAuthenticated.set(res.authenticated);
      this.userName.set(res.name ?? null);
      return res.authenticated;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post('/api/auth/logout', {}));
    this.isAuthenticated.set(false);
    this.userName.set(null);
  }
}
