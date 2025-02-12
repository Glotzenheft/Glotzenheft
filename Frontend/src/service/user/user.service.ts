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
    @Inject(PLATFORM_ID) private platformId: Object
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
}
