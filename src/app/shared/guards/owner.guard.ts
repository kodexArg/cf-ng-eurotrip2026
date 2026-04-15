import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function ownerGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isOwner() ? true : router.createUrlTree(['/access']);
}
