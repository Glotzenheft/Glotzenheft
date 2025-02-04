import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public showToast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  public triggerToast = () => {
    this.showToast$.next(true);
  };

  public isUserLoggedIn = (): boolean => {
    return !!localStorage.getItem('authToken');
  };
}
