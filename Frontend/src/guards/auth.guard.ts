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
  const messageService = inject(MessageService);

  console.log('route', state.url);

  if (state.url === '/login' || state.url === '/register') {
    if (isUserLoggedIn()) {
      router.navigateByUrl(ROUTES_LIST[8].fullUrl);
      return false;
    }
    return true;
  } else {
    // all other routes
    if (isUserLoggedIn()) {
      return true;
    }
    messageService.add({
      life: 7000,
      severity: 'error',
      summary: 'Kein Zugriff',
      detail:
        'Du hast keinen Zugriff auf diese Seite. Bitte melde dich an, um Zugriff zu erhalten.',
    });
    return router.createUrlTree([`/${ROUTES_LIST[10].fullUrl}`]);
  }

  //   if (isUserLoggedIn()) {
  //     // // user is logged in
  //     // if (state.url === '/login' || state.url === '/register') {
  //     //   router.navigateByUrl(ROUTES_LIST[8].fullUrl);
  //     // }

  //     return true;
  //   } else {
  //     authService.triggerToast();

  //     // redirect to login route if not logged in
  //     return router.createUrlTree([`/${ROUTES_LIST[10].fullUrl}`]);
  //   }
};

export const isUserLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};
