import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../shared/variables/routes-list';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateToStartPage = () => {
    this.router.navigateByUrl('');
  };

  navigateToUserStart = () => {
    this.router.navigateByUrl('user');
  };

  navigateToMultiSearch = () => {
    this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
  };
}
