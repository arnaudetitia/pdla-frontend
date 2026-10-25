import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import moment from 'moment';
import { EtatPartieKeys } from '../model/enums/etat-partie.enum';

export const homepageGuard: CanActivateFn = () => {
  if (environment.production) {
    const router = inject(Router);
    let mdpAdmin = localStorage.getItem(EtatPartieKeys.ALREADY_LOGGED);
    if (!mdpAdmin || isExpired()) {
      return router.parseUrl('/login');
    }
    return true;
  }

  return true;
};

const isExpired: () => boolean = () => {
  const dateExpirationString = localStorage.getItem(EtatPartieKeys.EXPIRATION_DATE);

  if (!dateExpirationString) {
    localStorage.clear();
    return true;
  }

  const dateExpiration = moment(dateExpirationString);
  const dateCourante = moment();

  if (dateCourante.isAfter(dateExpiration)) {
    localStorage.clear();
    return true;
  }

  return false;
};
