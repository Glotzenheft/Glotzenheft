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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    Observable,
    shareReplay,
    tap,
    throwError,
} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { LoginAndMessageResponse, LoginCredentials, RegisterCredentials, ResetPasswordCredentials } from '../../shared/interfaces/login';
import { ROUTE_DELETE_USER_ACCOUNT, ROUTE_LOGIN, ROUTE_REGISTER, ROUTE_RESET_PASSWORD, ROUTE_STATISTIC_GET_WATCHTIME_PER_DAY, ROUTE_STATISTICS_GET_USER_RATINGS, ROUTE_USER_ACTIVITIES } from '../../shared/variables/api-routes';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../shared/variables/message-vars';
import { ROUTES_LIST } from '../../shared/variables/routes-list';
import { KEY_LOCAL_STORAGE_LAST_LOG_IN, KEY_LOCAL_STORAGE_LOG_IN_TRIES } from '../../shared/variables/local-storage-keys';
import { DeleteUserRequest, UserActivitiesResponse } from '../../shared/interfaces/user-interfaces';
import { RatingStatistic, WatchTimeStatistic } from '../../shared/statistic-interfaces';
import { I_UserRepository } from '../../core/interfaces/user.repository';
import { UC_GetHeader } from '../../core/use-cases/media/get-header.use-case';

@Injectable({
    providedIn: 'root',
})
export class R_UserHTTP implements I_UserRepository {
    private isSearchBarVisible: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(isUserLoggedIn());
    public isSearchBarVisible$: Observable<boolean> =
        this.isSearchBarVisible.asObservable();

    private visibleUserName: BehaviorSubject<string> =
        new BehaviorSubject<string>('');
    public visibleUserName$: Observable<string> =
        this.visibleUserName.asObservable();

    // variables for checking validation of user logins
    private USER_LOGIN_LIMIT: number = 3;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        private messageService: MessageService,
        private router: Router,
        private getHeaderUseCase: UC_GetHeader
    ) { }

    // functions -----------------------------------------------------------------------
    loginIntoAccount = (
        loginData: LoginCredentials
    ): Observable<LoginAndMessageResponse> => {
        return this.http
            .post<LoginAndMessageResponse>(ROUTE_LOGIN, JSON.stringify(loginData))
            .pipe(
                tap(() => {
                    this.isSearchBarVisible.next(true);
                    this.visibleUserName.next(loginData.username);
                }),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    };

    registerAccount = (
        registerData: RegisterCredentials
    ): Observable<LoginAndMessageResponse> => {
        return this.http
            .post<LoginAndMessageResponse>(
                ROUTE_REGISTER,
                JSON.stringify(registerData)
            )
            .pipe(
                tap(() => {
                    this.isSearchBarVisible.next(true);
                    this.visibleUserName.next(registerData.username);
                }),

                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    };

    logoutOfAccount = () => {
        if (isUserLoggedIn()) {
            if (isPlatformBrowser(this.platformId)) {
                localStorage.clear();
            }
            this.isSearchBarVisible.next(false);
            this.visibleUserName.next('');
        }
    };

    public resetPassword = (
        resetPasswordCredentials: ResetPasswordCredentials
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        return this.http
            .post<any>(
                ROUTE_RESET_PASSWORD,
                JSON.stringify(resetPasswordCredentials),
                { headers: header }
            )
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    };

    public showLoginMessage = () => {
        this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);

        // navigate to login page
        void this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
    };

    public showNoAccessMessage = () => {
        this.messageService.add(
            getMessageObject(
                'error',
                'Kein Zugriff',
                'Bitte melde dich an, um Zugriff zu erhalten.'
            )
        );
    };

    // functions for checking if user login is valid (or blocked due to too many login tries)
    public isUserLoginValid = (): boolean => {
        const calculateTimeDifference = (lastLogin: Date): number => {
            return Math.floor(
                (new Date().getTime() - lastLogin.getTime()) / 60000 // in minutes
            );
        };

        if (isPlatformBrowser(this.platformId)) {
            const lastLogin: string | null = localStorage.getItem(
                KEY_LOCAL_STORAGE_LAST_LOG_IN
            );
            const loginTries: string | null = localStorage.getItem(
                KEY_LOCAL_STORAGE_LAST_LOG_IN
            );

            if (!lastLogin || !loginTries) {
                localStorage.setItem(
                    KEY_LOCAL_STORAGE_LAST_LOG_IN,
                    new Date().toISOString()
                );
                localStorage.setItem(KEY_LOCAL_STORAGE_LOG_IN_TRIES, '0');

                return true;
            }

            const lastLoginDate: Date = new Date(lastLogin);
            const isLoginLimitExceeded: boolean =
                Number(loginTries) > this.USER_LOGIN_LIMIT;

            if (isLoginLimitExceeded) {
                // if login tries of user exceeds the number of valid login tries before locking out from login
                return calculateTimeDifference(lastLoginDate) >= 1;
            }
            return true;
        } else {
            return false;
        }
    };

    public increaseLoginTries = () => {
        if (isPlatformBrowser(this.platformId)) {
            const loginTries: string | null = localStorage.getItem(
                KEY_LOCAL_STORAGE_LOG_IN_TRIES
            );

            if (!loginTries) {
                localStorage.setItem(KEY_LOCAL_STORAGE_LOG_IN_TRIES, '0');
                return;
            }

            localStorage.setItem(
                KEY_LOCAL_STORAGE_LOG_IN_TRIES,
                `${Number(loginTries) + 1}`
            );
        }
    };

    public deleteUserAccount = (
        userData: DeleteUserRequest
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        return this.http
            .delete<any>(ROUTE_DELETE_USER_ACCOUNT, {
                body: JSON.stringify({
                    security_question: userData.security_question,
                    security_answer: userData.security_answer,
                }),
                headers: header,
            })
            .pipe(
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    };

    /**
     * Function for getting the username if the user is logged in
     * @returns string | null
     */
    public getUserName = (): string | null => {
        if (!isUserLoggedIn()) {
            return null;
        }

        let userName: string = '';

        if (isPlatformBrowser(this.platformId)) {
            userName = localStorage.getItem('username') ?? '';

            if (!userName.trim()) {
                return null;
            }

            return userName;
        }

        return null;
    };

    /**
     * Function for getting the user statistic data of the watch time.
     * @returns Observable<WatchTimeStatistic> | null
     */
    public getUserStatisticWatchTime =
        (): Observable<WatchTimeStatistic> | null => {
            const header = this.getHeaderUseCase.execute();

            if (!header) {
                return null;
            }

            return this.http
                .get<WatchTimeStatistic>(ROUTE_STATISTIC_GET_WATCHTIME_PER_DAY, {
                    headers: header,
                })
                .pipe(
                    shareReplay(1),
                    catchError((error: HttpErrorResponse) => {
                        return throwError(() => error);
                    })
                );
        };

    /**
     * Function for getting the data of the recent user activities.
     * @param responsePage number
     * @returns Observable<UserActivity> | null
     */
    public getUserActivities = (
        responsePage: number
    ): Observable<UserActivitiesResponse> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        return this.http
            .get<UserActivitiesResponse>(ROUTE_USER_ACTIVITIES + responsePage, {
                headers: header,
            })
            .pipe(
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    };

    public getUserRatings = (): Observable<RatingStatistic> | null => {
        const header = this.getHeaderUseCase.execute();
        if (!header) {
            return null;
        }

        return this.http.get<RatingStatistic>(
            ROUTE_STATISTICS_GET_USER_RATINGS,
            { headers: header }
        ).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => this.handleError(error));
            })
        );
    }

    private handleError(error: HttpErrorResponse): Error {
        // Custom Error Handling
        return new Error(`API request failed: ${error.message}`);
    }
}
