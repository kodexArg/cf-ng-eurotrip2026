import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function ownerGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isOwner()) {
    return true;
  }
  return router.createUrlTree(['/']);
}
