import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { I_AuthRepository } from '../../core/interfaces/auth.repository';

@Injectable({
    providedIn: 'root',
})
export class R_Auth implements I_AuthRepository {
    public showToast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );

    constructor() { }

    public triggerToast = () => {
        this.showToast$.next(true);
    };

    public isUserLoggedIn = (): boolean => {
        return !!localStorage.getItem('authToken');
    };
}
