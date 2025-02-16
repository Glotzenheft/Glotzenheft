import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  LoginAndMessageResponse,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from '../../shared/interfaces/login';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { isUserLoggedIn } from '../../guards/auth.guard';
import { isPlatformBrowser } from '@angular/common';
import {
  ROUTE_LOGIN,
  ROUTE_RESET_PASSWORD,
} from '../../shared/variables/api-routes';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../shared/variables/routes-list';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isSearchBarVisible: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(isUserLoggedIn());
  public isSearchBarVisible$: Observable<boolean> =
    this.isSearchBarVisible.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService,
    private router: Router
  ) {}

  loginIntoAccount = (
    loginData: LoginCredentials
  ): Observable<LoginAndMessageResponse> => {
    return this.http
      .post<LoginAndMessageResponse>(ROUTE_LOGIN, JSON.stringify(loginData))
      .pipe(
        tap(() => this.isSearchBarVisible.next(true)),
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
    }
  };

  public resetPassword = (
    resetPasswordCredentials: ResetPasswordCredentials
  ): Observable<any> => {
    return this.http
      .post<any>(ROUTE_RESET_PASSWORD, JSON.stringify(resetPasswordCredentials))
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

    if (isPlatformBrowser(this.platformId)) {
      // clear localStorage
      localStorage.clear();
    }

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
}
