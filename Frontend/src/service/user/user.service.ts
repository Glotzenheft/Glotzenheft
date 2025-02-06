import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginAndMessageResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../../shared/interfaces/login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  loginIntoAccount = (
    loginData: LoginCredentials
  ): Observable<LoginAndMessageResponse> => {
    return this.http.post<LoginAndMessageResponse>(
      'https://127.0.0.1:8000/api/login',
      JSON.stringify(loginData)
    );
  };

  registerAccount = (
    registerData: RegisterCredentials
  ): Observable<LoginAndMessageResponse> => {
    return this.http.post<LoginAndMessageResponse>(
      'https://127.0.0.1:8000/api/register',
      JSON.stringify(registerData)
    );
  };
}
