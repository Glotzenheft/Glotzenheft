import { CanActivateFn } from '@angular/router';
import { Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MediaService } from '../service/media/media.service';
import { AuthService } from '../service/auth/auth.service';
import { ROUTES_LIST } from '../shared/variables/routes-list';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (isUserLoggedIn()) {
    return true;
  } else {
    authService.triggerToast();

    // redirect to login route if not logged in
    return router.createUrlTree([`/${ROUTES_LIST[10].fullUrl}`]);
  }
};

export const isUserLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};
