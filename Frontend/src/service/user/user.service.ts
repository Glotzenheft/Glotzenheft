import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
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
  ): Observable<{ token: string }> => {
    return this.http.post<{ token: string }>('', JSON.stringify(loginData));
  };

  registerAccount = (
    registerData: RegisterCredentials
  ): Observable<{ token: string }> => {
    return this.http.post<{ token: string }>('', JSON.stringify(registerData));
  };
}
