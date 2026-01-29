/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UC_TriggerToast } from '../app/core/use-cases/auth/trigger-toast.use-case';
import { AUTHENTICATION_URLS, TMDB_SIDEBAR_URLS} from "../app/core/constants/urls.constants";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const triggerToastUseCase = inject(UC_TriggerToast);

    if (state.url.includes(AUTHENTICATION_URLS.logIn) || state.url.includes(AUTHENTICATION_URLS.register)) {
        if (isUserLoggedIn()) {
            void router.navigateByUrl(TMDB_SIDEBAR_URLS.dashboard);
            return false;
        }
        return true;
    } else {
        // all other routes
        if (isUserLoggedIn()) {
            return true;
        }
        triggerToastUseCase.execute();
        return router.createUrlTree([`/${AUTHENTICATION_URLS.logIn}`]);
    }
};

export const isUserLoggedIn = (): boolean => {
    return !!localStorage.getItem('token');
};
