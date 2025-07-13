/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
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
