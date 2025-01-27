import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
}
