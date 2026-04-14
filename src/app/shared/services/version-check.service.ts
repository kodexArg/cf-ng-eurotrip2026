import { Injectable, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface VersionPayload {
  version: string;
  builtAt: string;
}

const POLL_INTERVAL_MS = 5 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private currentVersion: string | null = null;
  private timer: number | null = null;
  private reloading = false;

  start(): void {
    if (typeof window === 'undefined') return;
    this.check(true);
    this.timer = window.setInterval(() => this.check(false), POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.destroyRef.onDestroy(() => {
      if (this.timer !== null) clearInterval(this.timer);
      document.removeEventListener('visibilitychange', this.onVisibility);
    });
  }

  private onVisibility = () => {
    if (document.visibilityState === 'visible') this.check(false);
  };

  private check(isInitial: boolean): void {
    if (this.reloading) return;
    if (!isInitial && document.visibilityState !== 'visible') return;
    const url = `/version.json?t=${Date.now()}`;
    this.http
      .get<VersionPayload>(url)
      .pipe(catchError(() => of(null)))
      .subscribe((payload) => {
        if (!payload?.version) return;
        if (this.currentVersion === null) {
          this.currentVersion = payload.version;
          return;
        }
        if (payload.version !== this.currentVersion) {
          this.reloading = true;
          window.location.reload();
        }
      });
  }
}
