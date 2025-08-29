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

import { Observable } from 'rxjs';
import {
    LoginAndMessageResponse,
    LoginCredentials,
    RegisterCredentials,
    ResetPasswordCredentials,
} from '../../shared/interfaces/login';
import { DeleteUserRequest } from '../../shared/interfaces/user-interfaces';
import {
    RatingStatistic,
    WatchTimeStatistic,
} from '../../shared/statistic-interfaces';
import { UserActivitiesResponse } from '../../../shared/interfaces/user-interfaces';
import { InjectionToken } from '@angular/core';

export interface I_UserRepository {
    // variables
    isSearchBarVisible$: Observable<boolean>;
    visibleUserName$: Observable<string>;

    // functions
    loginIntoAccount: (
        loginData: LoginCredentials,
    ) => Observable<LoginAndMessageResponse>;
    registerAccount: (
        registerData: RegisterCredentials,
    ) => Observable<LoginAndMessageResponse>;
    logoutOfAccount: () => void;
    resetPassword: (
        resetPasswordCredentials: ResetPasswordCredentials,
    ) => Observable<any> | null;
    showLoginMessage: () => void;
    showNoAccessMessage: () => void;
    isUserLoginValid: () => boolean;
    increaseLoginTries: () => void;
    deleteUserAccount: (userData: DeleteUserRequest) => Observable<any> | null;
    getUserName: () => string | null;
    getUserStatisticWatchTime: () => Observable<WatchTimeStatistic> | null;
    getUserActivities: (
        responsePage: number,
    ) => Observable<UserActivitiesResponse> | null;
    getUserRatings: () => Observable<RatingStatistic> | null;
}

// IT = Injection Token
export const IT_USER_REPOSITORY = new InjectionToken<I_UserRepository>(
    'I_UserRepository',
);
