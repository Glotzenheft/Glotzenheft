import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  LoginAndMessageResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../../shared/interfaces/login';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isUserLoggedIn } from '../../guards/auth.guard';
import { isPlatformBrowser } from '@angular/common';

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
      .post<LoginAndMessageResponse>(
        'https://127.0.0.1:8000/api/login',
        JSON.stringify(loginData)
      )
      .pipe(tap(() => this.isSearchBarVisible.next(true)));
  };

  registerAccount = (
    registerData: RegisterCredentials
  ): Observable<LoginAndMessageResponse> => {
    return this.http.post<LoginAndMessageResponse>(
      'https://127.0.0.1:8000/api/register',
      JSON.stringify(registerData)
    );
  };

  logoutOfAccount = () => {
    if (isUserLoggedIn()) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.clear();
      }
    }
  };
}
