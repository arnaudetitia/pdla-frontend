import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';

export const homepageGuard: CanActivateFn = () => {
  if (environment.production) {
    const router = inject(Router);
    const mdpAdmin = prompt('Mot de passe pour acceder au site :');
    if (mdpAdmin?.localeCompare('Coucou') === 0) {
      return true;
    } else {
      return router.parseUrl('/403');
    }
  }

  return true;
};
