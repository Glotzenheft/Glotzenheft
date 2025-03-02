import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import {
  getVisibleRoutes,
  getVisibleRoutesForUser,
} from '../../../shared/variables/routes-list';
import { VisibleRoute } from '../../../shared/interfaces/route-list-item';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-user-links',
  imports: [CommonModule],
  templateUrl: './user-links.component.html',
  styleUrl: './user-links.component.css',
})
export class UserLinksComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public personalUserLinks: VisibleRoute[] = getVisibleRoutesForUser();

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.isSearchBarVisible$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }
}
