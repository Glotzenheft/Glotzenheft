import { CanActivateFn } from '@angular/router';
import { Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MediaService } from '../service/media/media.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const messageService = inject(MessageService);
  const mediaService = inject(MediaService)

  if (isUserLoggedIn()) {
    return true;
  } else {
    mediaService.triggerToast()

    // redirect to login route if not logged in
    return router.createUrlTree(['/login']);
  }
};

const isUserLoggedIn = (): boolean => {
  return !!localStorage.getItem('authToken');
};
