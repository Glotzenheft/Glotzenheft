import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { ROUTES_LIST } from '../app/shared/variables/routes-list';
import { UC_TriggerToast } from '../app/core/use-cases/auth/trigger-toast.use-case';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const triggerToastUseCase = inject(UC_TriggerToast)


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
        triggerToastUseCase.execute();
        return router.createUrlTree([`/${ROUTES_LIST[10].fullUrl}`]);
    }
};

export const isUserLoggedIn = (): boolean => {
    return !!localStorage.getItem('token');
};
