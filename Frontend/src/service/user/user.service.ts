import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  LoginAndMessageResponse,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from '../../shared/interfaces/login';
import {
  BehaviorSubject,
  catchError,
  last,
  Observable,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { isUserLoggedIn } from '../../guards/auth.guard';
import { isPlatformBrowser } from '@angular/common';
import {
  ROUTE_DELETE_USER_ACCOUNT,
  ROUTE_LOGIN,
  ROUTE_RESET_PASSWORD,
} from '../../shared/variables/api-routes';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../shared/variables/routes-list';
import { DeleteUserRequest } from '../../shared/interfaces/user-interfaces';
import { MediaService } from '../media/media.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isSearchBarVisible: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(isUserLoggedIn());
  public isSearchBarVisible$: Observable<boolean> =
    this.isSearchBarVisible.asObservable();

  // variables for checking validation of user login
  private USER_KEY_LAST_LOGIN: string = 'lastLogin';
  private USER_KEY_LOGIN_TRIES: string = 'loginTries';
  private USER_LOGIN_LIMIT: number = 3;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService,
    private router: Router,
    private mediaService: MediaService
  ) {}

  // functions -----------------------------------------------------------------------
  loginIntoAccount = (
    loginData: LoginCredentials
  ): Observable<LoginAndMessageResponse> => {
    return this.http
      .post<LoginAndMessageResponse>(ROUTE_LOGIN, JSON.stringify(loginData))
      .pipe(
        tap(() => {
          this.isSearchBarVisible.next(true);
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
        'https://127.0.0.1:8000/api/register',
        JSON.stringify(registerData)
      )
      .pipe(
        tap(() => this.isSearchBarVisible.next(true)),
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
    }
  };

  public resetPassword = (
    resetPasswordCredentials: ResetPasswordCredentials
  ): Observable<any> | null => {
    const header = this.mediaService.getHeader();

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
    this.messageService.add({
      life: 7000,
      severity: 'error',
      summary: 'Ungültige Anfrage',
      detail:
        'Dein Loginstatus für diesen Account ist abgelaufen. Bitte melde dich erneut an.',
    });

    // if (isPlatformBrowser(this.platformId)) {
    //   // clear localStorage
    //   localStorage.clear();
    // }

    // navigate to login page
    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
  };

  public showNoAccessMessage = () => {
    this.messageService.add({
      severity: 'error',
      summary: 'Kein Zugriff',
      detail:
        'Sie haben zur Zeit keinen Zugriff auf diese Seite. Bitte melden Sie sich an, um Zugriff zu erhalten.',
      life: 7000,
    });
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
        this.USER_KEY_LAST_LOGIN
      );
      const loginTries: string | null = localStorage.getItem(
        this.USER_KEY_LOGIN_TRIES
      );

      if (!lastLogin || !loginTries) {
        localStorage.setItem(
          this.USER_KEY_LAST_LOGIN,
          new Date().toISOString()
        );
        localStorage.setItem(this.USER_KEY_LOGIN_TRIES, '0');

        console.log(localStorage);

        return true;
      }

      const lastLoginDate: Date = new Date(lastLogin);
      const isLoginLimitExceeded: boolean =
        Number(loginTries) > this.USER_LOGIN_LIMIT;

      if (isLoginLimitExceeded) {
        // if login tries of user exceeds the number of valid login tries before locking out from login

        if (calculateTimeDifference(lastLoginDate) < 1) {
          // login not valid
          return false;
        }
        return true;
      }
      return true;
    } else {
      return false;
    }
  };

  public increaseLoginTries = () => {
    if (isPlatformBrowser(this.platformId)) {
      const loginTries: string | null = localStorage.getItem(
        this.USER_KEY_LOGIN_TRIES
      );

      if (!loginTries) {
        localStorage.setItem(this.USER_KEY_LOGIN_TRIES, '0');
        return;
      }

      localStorage.setItem(
        this.USER_KEY_LOGIN_TRIES,
        `${Number(loginTries) + 1}`
      );
    }
  };

  public deleteUserAccount = (
    userData: DeleteUserRequest
  ): Observable<any> | null => {
    const header = this.mediaService.getHeader();

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
}
