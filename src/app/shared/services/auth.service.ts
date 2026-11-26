import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface WhoAmI {
  email: string;
  editor: boolean;
}

/**
 * Cloudflare Access identity. Loaded once at startup from `/api/auth/whoami`;
 * `isOwner` is true only for allowlisted editor emails.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly email = signal<string | null>(null);
  readonly editor = signal(false);
  readonly checked = signal(false);
  readonly isOwner = computed(() => this.editor());

  async checkAuth(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<WhoAmI>('/api/auth/whoami'));
      this.email.set(res.email);
      this.editor.set(res.editor === true);
    } catch {
      this.email.set(null);
      this.editor.set(false);
    } finally {
      this.checked.set(true);
    }
  }
}
