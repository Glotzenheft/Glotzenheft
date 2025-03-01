import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import {
  getVisibleRoutes,
  getVisibleRoutesForUser,
} from '../../../shared/variables/routes-list';
import { VisibleRoute } from '../../../shared/interfaces/route-list-item';
import { isUserLoggedIn } from '../../../guards/auth.guard';

@Component({
  selector: 'app-user-links',
  imports: [CommonModule],
  templateUrl: './user-links.component.html',
  styleUrl: './user-links.component.css',
})
export class UserLinksComponent {
  public isLoggedIn: boolean = false;
  public personalUserLinks: VisibleRoute[] = getVisibleRoutesForUser();

  constructor(public authService: AuthService) {
    this.isLoggedIn = isUserLoggedIn();
  }
}
