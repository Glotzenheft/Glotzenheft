import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../shared/variables/routes-list';
import { I_NavigationRepository } from '../../core/interfaces/navigation.repository';


@Injectable({
    providedIn: 'root',
})
export class R_Navigation implements I_NavigationRepository {
    constructor(private router: Router) { }

    public navigateToStartPage = () => {
        this.router.navigateByUrl('');
    };

    public navigateToUserStart = () => {
        this.router.navigateByUrl('user');
    };

    public navigateToMultiSearch = () => {
        this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
    };
}
