import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { getVisibleRoutes } from '../../../shared/variables/routes-list';
import { VisibleRoute } from '../../../shared/interfaces/route-list-item';

@Component({
  selector: 'app-user-links',
  imports: [CommonModule],
  templateUrl: './user-links.component.html',
  styleUrl: './user-links.component.css',
})
export class UserLinksComponent {
  public isLoggedIn: boolean = false;
  public personalUserLinks: VisibleRoute[] = getVisibleRoutes().filter(
    (route: VisibleRoute) =>
      route.fullUrl.startsWith('user') || route.fullUrl.startsWith('media')
  );

  constructor(public authService: AuthService) {
    this.isLoggedIn = authService.isUserLoggedIn();
  }
}
