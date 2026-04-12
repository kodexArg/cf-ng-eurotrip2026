import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface AuthResponse {
  authenticated: boolean;
  name?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly isAuthenticated = signal(false);
  readonly userName = signal<string | null>(null);
  readonly role = signal<'owner' | 'visitor' | null>(null);
  readonly isOwner = computed(() => this.role() === 'owner');

  async checkAuth(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<AuthResponse>('/api/auth/me')
      );
      this.isAuthenticated.set(res.authenticated);
      this.userName.set(res.name ?? null);
      this.role.set(res.role as 'owner' | 'visitor' ?? null);
    } catch {
      this.isAuthenticated.set(false);
      this.userName.set(null);
      this.role.set(null);
    }
  }

  async login(passphrase: string, name?: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/login', { passphrase, name })
      );
      this.isAuthenticated.set(res.authenticated);
      this.userName.set(res.name ?? null);
      this.role.set(res.role as 'owner' | 'visitor' ?? null);
      return res.authenticated;
    } catch {
      this.role.set(null);
      return false;
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post('/api/auth/logout', {}));
    this.isAuthenticated.set(false);
    this.userName.set(null);
    this.role.set(null);
  }
}
